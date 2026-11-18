import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import SiteNavbar from "./SiteNavbar";
import SiteFooter from "./SiteFooter";
import useSmartBack from "../hooks/useSmartBack";

function SubjectPage() {
  const { subject, completedTopicIds, isLoggedIn } = useOutletContext();

  const goBack = useSmartBack(isLoggedIn ? "/dashboard" : "/");

  // First unit open by default
  const [openUnits, setOpenUnits] = useState(
    () => new Set(subject.units.length ? [subject.units[0].id] : [])
  );

  const toggleUnit = (unitId) => {
    setOpenUnits((previous) => {
      const next = new Set(previous);

      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }

      return next;
    });
  };

  const completedCount = subject.units.reduce(
    (sum, unit) =>
      sum + unit.topics.filter((topic) => completedTopicIds.has(topic.id)).length,
    0
  );

  return (
    <div className="min-h-screen bg-[#F3F1FF] text-[#010737]">
      <SiteNavbar />

      {/* BACK BUTTON */}
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <button
          onClick={goBack}
          className="rounded-xl border border-[#AFA0FF] bg-white px-6 py-3 font-semibold text-[#3B0CA3] shadow-sm transition hover:bg-[#AFA0FF]/20"
        >
          ← Back
        </button>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* SUBJECT HEADER */}
        <div className="rounded-3xl border border-[#DCD8FF] bg-gradient-to-br from-white via-[#F3F1FF] to-[#EFEBFF] p-8 shadow-sm md:p-12">
          <p className="font-bold uppercase tracking-widest text-[#3B0CA3]">
            MCA · Semester {subject.semester} · {subject.code}
          </p>

          <h1 className="mt-4 text-3xl font-extrabold text-[#010737] md:text-5xl">
            {subject.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-[#3B0CA3]">
            <span className="rounded-lg bg-white px-3 py-1">{subject.type}</span>

            {subject.group && (
              <span className="rounded-lg bg-white px-3 py-1">
                {subject.group}
              </span>
            )}

            <span className="rounded-lg bg-white px-3 py-1">
              L-T-P {subject.ltp}
            </span>

            <span className="rounded-lg bg-white px-3 py-1">
              {subject.credits} credit{subject.credits === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-2xl font-extrabold text-[#3B0CA3]">
                {subject.unitCount}
              </p>
              <p className="text-sm text-[#333B69]">Units</p>
            </div>

            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-2xl font-extrabold text-[#3B0CA3]">
                {subject.topicCount}
              </p>
              <p className="text-sm text-[#333B69]">Topics</p>
            </div>

            {isLoggedIn && (
              <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                <p className="text-2xl font-extrabold text-[#3B0CA3]">
                  {completedCount}
                </p>
                <p className="text-sm text-[#333B69]">Completed</p>
              </div>
            )}
          </div>

          {!isLoggedIn && (
            <p className="mt-5 text-sm text-[#333B69]">
              <Link
                to="/login"
                state={{ from: `/subjects/${subject.code}` }}
                className="font-bold text-[#6840D9] underline"
              >
                Log in
              </Link>{" "}
              to open lessons, take Practice Quizzes and save your progress.
            </p>
          )}
        </div>

        {/* UNITS */}
        <div className="mt-12">
          <p className="font-bold uppercase tracking-widest text-[#6840D9]">
            Course Content
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#010737]">
            Units and Topics
          </h2>
        </div>

        {!subject.hasSyllabus ? (
          <div className="mt-8 rounded-2xl border border-[#DCD8FF] bg-white p-8 text-center">
            <h3 className="text-xl font-bold text-[#010737]">
              No units published
            </h3>

            <p className="mt-2 text-[#333B69]">{subject.note}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {subject.units.map((unit) => {
              const open = openUnits.has(unit.id);

              const unitDone = unit.topics.filter((topic) =>
                completedTopicIds.has(topic.id)
              ).length;

              return (
                <section
                  key={unit.id}
                  className="rounded-2xl border border-[#DCD8FF] bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
                  >
                    <span>
                      <span className="block text-xl font-extrabold text-[#3B0CA3]">
                        {unit.label}
                      </span>

                      <span className="block text-sm text-[#555B7D]">
                        {unit.topics.length} topic
                        {unit.topics.length === 1 ? "" : "s"}
                        {unitDone ? ` · ${unitDone} completed` : ""}
                      </span>
                    </span>

                    <span aria-hidden="true" className="text-2xl text-[#6840D9]">
                      {open ? "−" : "+"}
                    </span>
                  </button>

                  {open && (
                    <ul className="space-y-2 border-t border-[#EEEAF8] px-6 py-4">
                      {unit.topics.map((topic) => {
                        const done = completedTopicIds.has(topic.id);

                        return (
                          <li key={topic.id}>
                            <Link
                              to={`topics/${topic.id}`}
                              className="flex items-start justify-between gap-3 rounded-xl border border-[#E5E2F5] px-4 py-3 transition hover:border-[#6840D9] hover:bg-[#F8F7FF]"
                            >
                              <span className="min-w-0 break-words font-semibold text-[#010737]">
                                {topic.title}
                              </span>

                              <span
                                className={`shrink-0 text-xs font-bold ${
                                  done ? "text-green-700" : "text-[#6840D9]"
                                }`}
                              >
                                {done ? "✓ Completed" : "Start →"}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default SubjectPage;
