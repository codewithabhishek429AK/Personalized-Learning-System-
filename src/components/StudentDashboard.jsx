import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";
import CurriculumExplorer from "./CurriculumExplorer";
import useLearningData from "../hooks/useLearningData";
import useSelection from "../hooks/useSelection";
import {
  semesters,
  allSubjects,
  curriculumTotals,
  electiveGroups,
  getSubject,
  getTopic,
  subjectsInScope,
} from "../Data/mca";

function ProgressBar({ value, color = "#6840D9", height = "h-2" }) {
  return (
    <div
      className={`${height} overflow-hidden rounded-full bg-[#EEEAF8]`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

const percent = (done, total) =>
  total ? Math.min(100, Math.round((done / total) * 100)) : 0;

export default function StudentDashboard({
  studentName = "Student",
  onLogout,
}) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Real data from MongoDB
  const { completedBySubject, recentTopics, quizResults, isLoading, error } =
    useLearningData();

  // Saved regular-subject selection and elective choices (MongoDB)
  const selection = useSelection();

  const menuItems = [
    { name: "Dashboard", icon: "⌂", target: null },
    { name: "My Courses", icon: "▤", target: "my-courses" },
    { name: "My Progress", icon: "▥", target: "my-progress" },
    { name: "My Profile", icon: "◎", target: "my-profile" },
  ];

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.name);

    if (!menu.target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(menu.target)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const completedCount = (code) => completedBySubject[code]?.size || 0;

  // Progress is measured on the student's own path: every regular subject plus
  // the option chosen in each elective group. Topics completed in an elective
  // that is no longer chosen stay saved, but are not counted here.
  const scope = subjectsInScope(selection.electiveChoices);
  const scopeTopics = scope.reduce((sum, subject) => sum + subject.topicCount, 0);

  const totalCompleted = scope.reduce(
    (sum, subject) => sum + completedCount(subject.code),
    0
  );

  const overallProgress = percent(totalCompleted, scopeTopics);

  const regularTotal = semesters.reduce(
    (sum, semester) => sum + semester.regularSubjects.length,
    0
  );

  const chosenElectives = electiveGroups.filter(
    (group) => selection.electiveChoices[group.id]
  ).length;

  // Semester-wise progress (regular subjects + chosen electives of that semester)
  const semesterStats = semesters.map((semester) => {
    const inScope = scope.filter((subject) => subject.semester === semester.number);

    const topics = inScope.reduce((sum, subject) => sum + subject.topicCount, 0);

    const done = inScope.reduce(
      (sum, subject) => sum + completedCount(subject.code),
      0
    );

    return {
      number: semester.number,
      title: semester.title,
      regular: semester.regularSubjects.length,
      groups: semester.electiveGroups.length,
      groupsChosen: semester.electiveGroups.filter(
        (group) => selection.electiveChoices[group.id]
      ).length,
      topics,
      done,
      progress: percent(done, topics),
    };
  });

  // Subjects the student has actually started (real progress only)
  const startedSubjects = allSubjects
    .filter((subject) => completedCount(subject.code) > 0)
    .map((subject) => ({
      subject,
      done: completedCount(subject.code),
      progress: percent(completedCount(subject.code), subject.topicCount),
      inactiveElective:
        Boolean(subject.group) &&
        selection.electiveChoices[subject.group] !== subject.code,
    }));

  const stats = [
    {
      title: "Total Subjects",
      value: String(curriculumTotals.subjects),
      subtitle: `${regularTotal} regular + ${electiveGroups.length} elective groups × 5 options`,
      icon: "▤",
    },
    {
      title: "Selected Subjects",
      value: String(selection.selected.length + chosenElectives),
      subtitle: `${selection.selected.length} regular · ${chosenElectives}/${electiveGroups.length} electives chosen`,
      icon: "◎",
    },
    {
      title: "Completed Topics",
      value: String(totalCompleted),
      subtitle: `of ${scopeTopics} topics on your path`,
      icon: "✓",
    },
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      subtitle: "Regular subjects + your chosen electives",
      icon: "▥",
    },
  ];

  const recentQuizzes = quizResults.slice(0, 5).map((result) => {
    const found = getTopic(result.subjectId, result.topicId);

    return {
      id: result._id,
      topic: found?.topic.title || result.topicId,
      subject: found?.subject.name || getSubject(result.subjectId)?.name || result.subjectId,
      score: result.score,
      total: result.totalQuestions,
      percentage: result.percentage,
      date: new Date(result.completedAt).toLocaleDateString(),
    };
  });

  return (
    <div className="min-h-screen bg-[#F5F6FC] text-[#010737]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E5E2F5] bg-white px-5 py-7 md:flex">
          <div className="mb-12 px-2">
            <Logo size={44} to="/dashboard" />
          </div>

          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-[#9294AE]">
            Learning Menu
          </p>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-left font-semibold transition ${
                  activeMenu === item.name
                    ? "bg-gradient-to-r from-[#3B0CA3] to-[#6840D9] text-white shadow-lg shadow-[#6840D9]/20"
                    : "text-[#555B7D] hover:bg-[#F1EEFF] hover:text-[#3B0CA3]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-500 transition hover:bg-red-50"
            >
              <span className="text-xl">↪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-5 md:px-9 lg:px-12">
          {/* TOP NAVBAR */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="md:hidden">
              <Logo size={36} to="/dashboard" />
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-medium text-[#8588A5]">
                Learning Workspace
              </p>

              <h2 className="mt-1 text-2xl font-extrabold">Student Dashboard</h2>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-[#E5E2F5] bg-white px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3B0CA3] to-[#6840D9] font-bold text-white">
                  {studentName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-bold">{studentName}</p>
                  <p className="text-xs text-[#8588A5]">Student</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 md:hidden"
              >
                Logout
              </button>
            </div>
          </header>

          {/* WELCOME BANNER */}
          <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1237D5] via-[#2928C7] to-[#6416C8] p-6 text-white shadow-xl shadow-[#6840D9]/15 md:p-10">
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                MCA · AKTU · NEP 2020
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Hello, {studentName} 👋
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-white/80">
                Choose your subjects from Semester 1 to 4, study each topic
                with a step-by-step lesson and test yourself with a Practice
                Quiz.
              </p>

              <button
                onClick={() =>
                  document.getElementById("my-courses")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-[#3B0CA3] shadow-lg transition hover:-translate-y-1"
              >
                Browse Subjects →
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error} Progress numbers below may be incomplete.
            </div>
          )}

          {/* STATISTICS */}
          <section className="mb-10">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">Your Learning Overview</h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                {isLoading
                  ? "Loading your progress..."
                  : "Numbers come from your saved progress."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-[#E5E2F5] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#777B99]">
                      {stat.title}
                    </p>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EDFF] text-xl font-bold text-[#6840D9]">
                      {stat.icon}
                    </div>
                  </div>

                  <h3 className="mt-4 text-3xl font-extrabold text-[#010737]">
                    {stat.value}
                  </h3>

                  <p className="mt-2 text-xs text-[#9294AE]">{stat.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEMESTER CARDS */}
          <section className="mb-10" aria-label="Semesters">
            <h2 className="mb-5 text-xl font-extrabold">MCA Semesters</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {semesterStats.map((semester) => (
                <div
                  key={semester.number}
                  className="rounded-2xl border border-[#E5E2F5] bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-extrabold text-[#3B0CA3]">
                    {semester.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#555B7D]">
                    {semester.regular} regular subjects
                    {semester.groups > 0 &&
                      ` + ${semester.groupsChosen}/${semester.groups} electives chosen`}
                  </p>

                  <div className="mt-4 flex justify-between text-sm">
                    <span className="font-semibold text-[#555B7D]">Progress</span>
                    <span className="font-extrabold text-[#3B0CA3]">
                      {semester.progress}%
                    </span>
                  </div>

                  <div className="mt-2">
                    <ProgressBar value={semester.progress} />
                  </div>

                  <p className="mt-2 text-xs text-[#9294AE]">
                    {semester.done} / {semester.topics} topics completed
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* COURSES: SELECTION + TREE */}
          <section id="my-courses" className="mb-10 scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">My Courses</h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                Tick regular subjects to select them and pick one option in each elective group. Click a name to see its units and
                topics, or use Open to go to the subject page.
              </p>
            </div>

            <CurriculumExplorer
              selection={selection}
              completedBySubject={completedBySubject}
            />
          </section>

          {/* PROGRESS AND ACTIVITY */}
          <section
            id="my-progress"
            className="mb-10 grid scroll-mt-8 grid-cols-1 gap-6 xl:grid-cols-2"
          >
            {/* SUBJECT-WISE PROGRESS */}
            <div className="rounded-2xl border border-[#E5E2F5] bg-white p-5 sm:p-6">
              <h2 className="text-xl font-extrabold">Subject-wise Progress</h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                Subjects where you have completed at least one topic.
              </p>

              {startedSubjects.length === 0 ? (
                <p className="mt-6 rounded-xl bg-[#F8F7FF] px-4 py-3 text-sm text-[#555B7D]">
                  You have not completed any topic yet. Open a topic and press
                  "Mark as Completed" to start tracking.
                </p>
              ) : (
                <div className="mt-6 space-y-5">
                  {startedSubjects.map(({ subject, done, progress, inactiveElective }) => (
                    <div key={subject.code}>
                      <div className="mb-2 flex justify-between gap-3">
                        <Link
                          to={`/subjects/${subject.code}`}
                          className="min-w-0 truncate text-sm font-semibold text-[#3B0CA3] hover:underline"
                        >
                          {subject.name}
                        </Link>

                        <span className="shrink-0 text-sm font-bold text-[#555B7D]">
                          {progress}%
                        </span>
                      </div>

                      <ProgressBar value={progress} height="h-2.5" />

                      <p className="mt-1 text-xs text-[#9294AE]">
                        {subject.code} · Sem {subject.semester} · {done} /{" "}
                        {subject.topicCount} topics
                        {inactiveElective &&
                          " · elective not currently chosen (progress kept)"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECENTLY COMPLETED TOPICS */}
            <div className="rounded-2xl border border-[#E5E2F5] bg-white p-5 sm:p-6">
              <h2 className="text-xl font-extrabold">Recently Studied Topics</h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                Topics you most recently marked as completed.
              </p>

              {recentTopics.length === 0 ? (
                <p className="mt-6 rounded-xl bg-[#F8F7FF] px-4 py-3 text-sm text-[#555B7D]">
                  Nothing here yet.
                </p>
              ) : (
                <ul className="mt-6 space-y-4">
                  {recentTopics.slice(0, 5).map((item) => (
                    <li
                      key={`${item.code}-${item.topicId}`}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0EDFF] font-bold text-[#6840D9]">
                        ✓
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/subjects/${item.code}/topics/${item.topicId}`}
                          className="block break-words text-sm font-bold hover:text-[#6840D9]"
                        >
                          {item.topicTitle}
                        </Link>

                        <p className="mt-0.5 text-xs text-[#8588A5]">
                          {item.subjectName} · {item.unitLabel}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-[#9294AE]">
                        {new Date(item.completedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* LATEST QUIZ RESULTS */}
          <section className="mb-10 rounded-2xl border border-[#E5E2F5] bg-white p-5 sm:p-6">
            <h2 className="text-xl font-extrabold">Latest Quiz Results</h2>

            <p className="mt-1 text-sm text-[#8588A5]">
              Your most recent Practice Quiz scores.
            </p>

            {recentQuizzes.length === 0 ? (
              <p className="mt-6 rounded-xl bg-[#F8F7FF] px-4 py-3 text-sm text-[#555B7D]">
                No Practice Quiz attempts yet.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-[#EEEAF8]">
                {recentQuizzes.map((quiz) => (
                  <li
                    key={quiz.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold">{quiz.topic}</p>

                      <p className="text-xs text-[#8588A5]">
                        {quiz.subject} · {quiz.date}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        quiz.percentage >= 60
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {quiz.score}/{quiz.total} · {quiz.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* PROFILE */}
          <section
            id="my-profile"
            className="mb-8 scroll-mt-8 rounded-2xl border border-[#E5E2F5] bg-white p-6"
          >
            <h2 className="text-xl font-extrabold">My Profile</h2>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3B0CA3] to-[#6840D9] text-xl font-bold text-white">
                {studentName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-bold">{studentName}</h3>

                <p className="mt-1 text-sm text-[#8588A5]">LearnCraft Student</p>
              </div>
            </div>
          </section>

          <footer className="border-t border-[#E5E2F5] py-6 text-center text-sm text-[#9294AE]">
            © 2026 LearnCraft | Personalized Learning System
          </footer>
        </main>
      </div>
    </div>
  );
}
