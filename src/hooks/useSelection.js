import { useCallback, useEffect, useRef, useState } from "react";

import { allSubjects, semesters } from "../Data/mca";
import { apiRequest } from "../utils/api";

const ORDER = new Map(allSubjects.map((subject, index) => [subject.code, index]));

const sortByCurriculum = (codes) =>
  [...codes].sort((a, b) => ORDER.get(a) - ORDER.get(b));

// The student's saved choices, stored in MongoDB:
//  - selected:        regular subject codes (checkboxes)
//  - electiveChoices: { "Elective-1": "BMC011", ... } (one per group)
export default function useSelection() {
  const [selected, setSelected] = useState([]);
  const [electiveChoices, setElectiveChoices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");

  const regularRequest = useRef(0);
  const electiveRequest = useRef({});

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await apiRequest("/students/subjects");

        if (!ignore) {
          setSelected(sortByCurriculum(data.selectedSubjects || []));
          setElectiveChoices(data.electiveChoices || {});
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load your selections.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // Regular subjects: optimistic update, then persist the whole list
  const saveRegular = useCallback(
    async (next) => {
      const previous = selected;
      const requestId = ++regularRequest.current;

      setSelected(next);
      setError("");
      setPending((count) => count + 1);

      try {
        const data = await apiRequest("/students/subjects", {
          method: "PUT",
          body: JSON.stringify({ subjects: next }),
        });

        if (requestId === regularRequest.current) {
          setSelected(sortByCurriculum(data.selectedSubjects));
        }
      } catch (err) {
        if (requestId === regularRequest.current) {
          setSelected(previous);
          setError(err.message || "Unable to save your selection.");
        }
      } finally {
        setPending((count) => count - 1);
      }
    },
    [selected]
  );

  const selectedSet = new Set(selected);

  const toggleSubject = (code) => {
    saveRegular(
      selectedSet.has(code)
        ? selected.filter((item) => item !== code)
        : sortByCurriculum([...new Set([...selected, code])])
    );
  };

  // Select all REGULAR subjects of a semester (electives are never bulk-selected)
  const toggleSemester = (number) => {
    const semester = semesters.find((item) => item.number === number);
    const codes = semester.regularSubjects.map((subject) => subject.code);
    const allSelected = codes.every((code) => selectedSet.has(code));

    saveRegular(
      allSelected
        ? selected.filter((code) => !codes.includes(code))
        : sortByCurriculum([...new Set([...selected, ...codes])])
    );
  };

  const removeSubject = (code) =>
    saveRegular(selected.filter((item) => item !== code));

  const clearRegular = () => saveRegular([]);

  // Elective: choose or change the single option of one group
  const chooseElective = useCallback(
    async (group, code) => {
      const previous = electiveChoices[group];

      if (previous === code) return;

      const requestId = (electiveRequest.current[group] || 0) + 1;

      electiveRequest.current[group] = requestId;

      setElectiveChoices((choices) => ({ ...choices, [group]: code }));
      setError("");
      setPending((count) => count + 1);

      try {
        const data = await apiRequest(
          `/students/electives/${encodeURIComponent(group)}`,
          { method: "PUT", body: JSON.stringify({ code }) }
        );

        if (requestId === electiveRequest.current[group]) {
          setElectiveChoices((choices) => ({
            ...choices,
            [group]: data.electiveChoices[group],
          }));
        }
      } catch (err) {
        if (requestId === electiveRequest.current[group]) {
          setElectiveChoices((choices) => {
            const next = { ...choices };

            if (previous) {
              next[group] = previous;
            } else {
              delete next[group];
            }

            return next;
          });

          setError(err.message || "Unable to save your elective choice.");
        }
      } finally {
        setPending((count) => count - 1);
      }
    },
    [electiveChoices]
  );

  return {
    selected,
    selectedSet,
    electiveChoices,
    isLoading,
    isSaving: pending > 0,
    error,
    toggleSubject,
    toggleSemester,
    removeSubject,
    clearRegular,
    chooseElective,
  };
}
