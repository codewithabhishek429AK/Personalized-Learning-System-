import { Link } from "react-router-dom";

import { electiveGroups, getSubject } from "../Data/mca";

// Selected regular subjects and elective choices are shown separately.
function SelectedSubjectsPanel({
  selected,
  electiveChoices = {},
  onRemove,
  onClear,
  completedBySubject = {},
  isSaving = false,
}) {
  const subjects = selected.map((code) => getSubject(code)).filter(Boolean);
  const chosenCount = electiveGroups.filter((g) => electiveChoices[g.id]).length;

  return (
    <section
      aria-label="Selected subjects"
      className="grid gap-5 rounded-2xl border border-[#DCD8FF] bg-white p-5 shadow-sm lg:grid-cols-2"
    >
      {/* REGULAR SUBJECTS */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#010737]">
              Selected Regular Subjects
            </h3>

            <p className="text-sm text-[#555B7D]" aria-live="polite">
              {subjects.length} selected
              {isSaving ? " · saving..." : ""}
            </p>
          </div>

          {subjects.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
            >
              Clear selection
            </button>
          )}
        </div>

        {subjects.length === 0 ? (
          <p className="mt-4 rounded-xl bg-[#F8F7FF] px-4 py-3 text-sm text-[#555B7D]">
            No regular subjects selected yet. Tick a checkbox in the tree
            below.
          </p>
        ) : (
          <ul className="mt-4 grid max-h-72 gap-2 overflow-y-auto">
            {subjects.map((subject) => {
              const done = completedBySubject[subject.code]?.size || 0;

              return (
                <li
                  key={subject.code}
                  className="flex items-center gap-3 rounded-xl border border-[#E5E2F5] bg-[#FBFAFF] px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/subjects/${subject.code}`}
                      className="block truncate text-sm font-bold text-[#3B0CA3] hover:underline"
                    >
                      {subject.name}
                    </Link>

                    <p className="text-xs text-[#555B7D]">
                      {subject.code} · Sem {subject.semester} · {done}/
                      {subject.topicCount} topics
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(subject.code)}
                    aria-label={`Remove ${subject.name}`}
                    className="rounded-lg px-2 py-1 text-lg font-bold leading-none text-[#8588A5] transition hover:bg-red-50 hover:text-red-600"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ELECTIVES */}
      <div>
        <h3 className="text-lg font-extrabold text-[#010737]">
          Selected Electives
        </h3>

        <p className="text-sm text-[#555B7D]" aria-live="polite">
          {chosenCount} of {electiveGroups.length} groups chosen
        </p>

        <ul className="mt-4 grid gap-2">
          {electiveGroups.map((group) => {
            const subject = getSubject(electiveChoices[group.id]);

            return (
              <li
                key={group.id}
                className="flex items-center gap-3 rounded-xl border border-[#E5E2F5] bg-[#FBFAFF] px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6840D9]">
                    {group.id} · Sem {group.semester}
                  </p>

                  {subject ? (
                    <Link
                      to={`/subjects/${subject.code}`}
                      className="block truncate text-sm font-bold text-[#3B0CA3] hover:underline"
                    >
                      {subject.name}{" "}
                      <span className="font-medium text-[#555B7D]">
                        ({subject.code})
                      </span>
                    </Link>
                  ) : (
                    <p className="text-sm text-amber-700">
                      Not chosen yet. Pick one option in the tree.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default SelectedSubjectsPanel;
