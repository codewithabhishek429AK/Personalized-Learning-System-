import { useState } from "react";
import { Link } from "react-router-dom";

import { semesterTotals } from "../Data/mca";

const TYPE_STYLES = {
  Theory: "bg-[#F0EDFF] text-[#3B0CA3]",
  Practical: "bg-[#E7EFFF] text-[#1D4ED8]",
  Elective: "bg-[#E6F7F4] text-[#0F766E]",
  Project: "bg-[#FFF4E0] text-[#B45309]",
};

function Chevron({ open, small = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`shrink-0 text-[#6840D9] transition-transform ${
        open ? "rotate-90" : ""
      } ${small ? "h-4 w-4" : "h-5 w-5"}`}
      fill="currentColor"
    >
      <path d="M7 4l6 6-6 6V4z" />
    </svg>
  );
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// One subject: control (checkbox / radio) + name (expand) + Open link,
// with its units and topics underneath when expanded.
function SubjectRow({
  subject,
  control,
  isChosen,
  expanded,
  toggle,
  done,
  lastOpened,
}) {
  const subjectKey = `sub-${subject.code}`;
  const subjectOpen = expanded.has(subjectKey);
  const doneCount = done ? done.size : 0;

  return (
    <li>
      <div
        className={`flex flex-wrap items-center gap-3 px-4 py-2.5 sm:px-5 ${
          isChosen ? "bg-[#F5F2FF]" : ""
        } ${
          lastOpened?.code === subject.code
            ? "border-l-4 border-[#6840D9]"
            : "border-l-4 border-transparent"
        }`}
      >
        {control}

        <button
          type="button"
          onClick={() => toggle(subjectKey)}
          aria-expanded={subjectOpen}
          className="flex min-w-[60%] flex-1 items-center gap-2 text-left sm:min-w-0"
        >
          <Chevron open={subjectOpen} small />

          <span className="min-w-0">
            <span className="block font-semibold text-[#010737]">
              {subject.name}
            </span>

            <span className="block text-xs text-[#555B7D]">
              {subject.hasSyllabus
                ? `${plural(subject.unitCount, "unit")} · ${plural(
                    subject.topicCount,
                    "topic"
                  )}${doneCount ? ` · ${doneCount} completed` : ""}`
                : "No syllabus units published"}
            </span>
          </span>
        </button>

        <span className="rounded-md bg-[#EEEAF8] px-2 py-0.5 text-xs font-bold text-[#555B7D]">
          {subject.code}
        </span>

        <span
          className={`rounded-md px-2 py-0.5 text-xs font-bold ${
            TYPE_STYLES[subject.type] || TYPE_STYLES.Theory
          }`}
        >
          {subject.type}
        </span>

        <Link
          to={`/subjects/${subject.code}`}
          className="text-sm font-bold text-[#6840D9] hover:text-[#3B0CA3]"
        >
          Open →
        </Link>
      </div>

      {subjectOpen && (
        <div className="pb-2 pl-6 pr-3 sm:pl-12">
          {!subject.hasSyllabus ? (
            <p className="rounded-xl bg-[#FFF9EC] px-4 py-3 text-sm text-[#7A5200]">
              {subject.note ||
                "The official PDF does not list units for this item."}
            </p>
          ) : (
            <ul className="space-y-1">
              {subject.units.map((unit) => {
                const unitKey = `unit-${subject.code}-${unit.id}`;
                const unitOpen = expanded.has(unitKey);

                const unitDone = unit.topics.filter(
                  (topic) => done && done.has(topic.id)
                ).length;

                return (
                  <li key={unit.id}>
                    <button
                      type="button"
                      onClick={() => toggle(unitKey)}
                      aria-expanded={unitOpen}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-[#F8F7FF]"
                    >
                      <Chevron open={unitOpen} small />

                      <span className="text-sm font-bold text-[#3B0CA3]">
                        {unit.label}
                      </span>

                      <span className="text-xs text-[#555B7D]">
                        {plural(unit.topics.length, "topic")}
                        {unitDone ? ` · ${unitDone} completed` : ""}
                      </span>
                    </button>

                    {unitOpen && (
                      <ul className="mb-1 ml-6 space-y-0.5 border-l border-[#E5E2F5] pl-3">
                        {unit.topics.map((topic) => {
                          const isDone = done && done.has(topic.id);

                          const isCurrent =
                            lastOpened?.code === subject.code &&
                            lastOpened?.topicId === topic.id;

                          return (
                            <li key={topic.id}>
                              <Link
                                to={`/subjects/${subject.code}/topics/${topic.id}`}
                                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-[#F0EDFF] ${
                                  isCurrent
                                    ? "bg-[#EAE4FF] font-bold text-[#3B0CA3]"
                                    : "text-[#333B69]"
                                }`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                    isDone
                                      ? "bg-green-500 text-white"
                                      : "border border-[#AFA0FF] text-transparent"
                                  }`}
                                >
                                  ✓
                                </span>

                                <span className="min-w-0 break-words">
                                  {topic.title}
                                </span>

                                {isDone && (
                                  <span className="sr-only">(completed)</span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

// MCA -> Semester -> (Regular Subjects | Elective Groups) -> Subject -> Unit -> Topic.
//  - Regular subject: checkbox, any number can be selected.
//  - Elective option: radio button, exactly one per elective group.
//  - Subject name expands it; "Open" goes to the subject page.
function CurriculumTree({
  semesters,
  selected,
  electiveChoices = {},
  onToggleSubject,
  onToggleSemester,
  onChooseElective,
  completedBySubject = {},
  lastOpened = null,
  canSelect = true,
}) {
  const [expanded, setExpanded] = useState(() => {
    const initial = new Set();

    if (lastOpened) {
      const unitId = lastOpened.topicId.split("-")[0];

      semesters.forEach((semester) => {
        if (semester.subjects.some((s) => s.code === lastOpened.code)) {
          initial.add(`sem-${semester.number}`);
        }
      });

      initial.add(`sub-${lastOpened.code}`);
      initial.add(`unit-${lastOpened.code}-${unitId}`);
    }

    return initial;
  });

  const toggle = (key) => {
    setExpanded((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  return (
    <div className="space-y-4">
      {semesters.map((semester) => {
        const totals = semesterTotals(semester);
        const semesterKey = `sem-${semester.number}`;
        const semesterOpen = expanded.has(semesterKey);

        const regularCodes = semester.regularSubjects.map((s) => s.code);
        const selectedCount = regularCodes.filter((code) =>
          selected.has(code)
        ).length;
        const allSelected = selectedCount === regularCodes.length;

        return (
          <section
            key={semester.number}
            className="rounded-2xl border border-[#DCD8FF] bg-white shadow-sm"
          >
            {/* SEMESTER ROW */}
            <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={() => toggle(semesterKey)}
                aria-expanded={semesterOpen}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <Chevron open={semesterOpen} />

                <span className="min-w-0">
                  <span className="block text-lg font-extrabold text-[#010737]">
                    {semester.title}
                  </span>

                  <span className="block text-xs text-[#555B7D]">
                    {plural(totals.regular, "regular subject")}
                    {totals.electiveGroups > 0 &&
                      ` + ${plural(
                        totals.electiveGroups,
                        "elective group"
                      )} (5 options each)`}{" "}
                    · {plural(totals.units, "unit")} ·{" "}
                    {plural(totals.topics, "topic")}
                  </span>
                </span>
              </button>

              {canSelect && (
                <button
                  type="button"
                  onClick={() => onToggleSemester(semester.number)}
                  className="rounded-lg border border-[#AFA0FF] bg-white px-3 py-1.5 text-xs font-bold text-[#3B0CA3] transition hover:bg-[#F0EDFF]"
                >
                  {allSelected ? "Deselect all regular" : "Select all regular"} (
                  {selectedCount}/{regularCodes.length})
                </button>
              )}
            </div>

            {semesterOpen && (
              <div className="border-t border-[#EEEAF8]">
                {/* REGULAR SUBJECTS */}
                <p className="bg-[#F8F7FF] px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6840D9]">
                  Regular subjects
                </p>

                <ul>
                  {semester.regularSubjects.map((subject) => (
                    <SubjectRow
                      key={subject.code}
                      subject={subject}
                      isChosen={selected.has(subject.code)}
                      expanded={expanded}
                      toggle={toggle}
                      done={completedBySubject[subject.code]}
                      lastOpened={lastOpened}
                      control={
                        canSelect && (
                          <input
                            type="checkbox"
                            checked={selected.has(subject.code)}
                            onChange={() => onToggleSubject(subject.code)}
                            aria-label={`Select ${subject.name}`}
                            className="h-4 w-4 shrink-0 cursor-pointer accent-[#6840D9]"
                          />
                        )
                      }
                    />
                  ))}
                </ul>

                {/* ELECTIVE GROUPS */}
                {semester.electiveGroups.map((group) => {
                  const chosenCode = electiveChoices[group.id];
                  const chosen = group.options.find((o) => o.code === chosenCode);

                  return (
                    <div
                      key={group.id}
                      role="radiogroup"
                      aria-label={`${group.id}: choose one option`}
                      className="border-t border-[#EEEAF8]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F8F7FF] px-5 py-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6840D9]">
                          {group.id} · choose one of {group.options.length}
                        </p>

                        <p
                          className={`text-xs font-semibold ${
                            chosen ? "text-green-700" : "text-amber-700"
                          }`}
                        >
                          {chosen
                            ? `Chosen: ${chosen.name}`
                            : "Not chosen yet"}
                        </p>
                      </div>

                      <ul>
                        {group.options.map((subject) => (
                          <SubjectRow
                            key={subject.code}
                            subject={subject}
                            isChosen={chosenCode === subject.code}
                            expanded={expanded}
                            toggle={toggle}
                            done={completedBySubject[subject.code]}
                            lastOpened={lastOpened}
                            control={
                              canSelect && (
                                <input
                                  type="radio"
                                  name={`elective-${group.id}`}
                                  checked={chosenCode === subject.code}
                                  onChange={() =>
                                    onChooseElective(group.id, subject.code)
                                  }
                                  aria-label={`Choose ${subject.name} for ${group.id}`}
                                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#6840D9]"
                                />
                              )
                            }
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default CurriculumTree;
