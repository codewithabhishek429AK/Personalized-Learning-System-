
import { useState } from "react";
import courseData from "../Data/subjects";

export default function StudentDashboard({
  studentName = "Abhishek",
  onLogout,
  onOpenSubject,
}) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Read saved learning progress
  const [completedBySubject] = useState(() => {
    try {
      const savedProgress = localStorage.getItem("learncraft-progress");
      return savedProgress ? JSON.parse(savedProgress) : {};
    } catch {
      return {};
    }
  });

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "My Courses", icon: "▤" },
    { name: "My Progress", icon: "▥" },
    { name: "My Profile", icon: "◎" },
  ];

  // Subject colors and icons
  const subjectStyles = {
    DBMS: {
      shortName: "DBMS",
      color: "#3B0CA3",
      icon: "▤",
    },
    "Operating Systems": {
      shortName: "OS",
      color: "#2563EB",
      icon: "⚙",
    },
    "Data Structures": {
      shortName: "DSA",
      color: "#7C3AED",
      icon: "⌘",
    },
    "Web Technology": {
      shortName: "WT",
      color: "#0D9488",
      icon: "◇",
    },
  };

  // Calculate actual subject progress
  const subjects = courseData.map((course) => {
    const completedTopics = completedBySubject[String(course.id)] || [];
    const totalTopics = course.topics?.length || 0;
    const completedCount = completedTopics.length;

    const progress = totalTopics
      ? Math.min(
          100,
          Math.round((completedCount / totalTopics) * 100)
        )
      : 0;

    const style = subjectStyles[course.name] || {
      shortName: course.name,
      color: "#6840D9",
      icon: "▤",
    };

    return {
      id: course.id,
      name:
        course.name === "DBMS"
          ? "Database Management System"
          : course.name,
      shortName: style.shortName,
      description: course.description,
      progress,
      color: style.color,
      icon: style.icon,
      completedCount,
      totalTopics,
      topics: `${completedCount} / ${totalTopics} Topics`,
    };
  });

  // Overall completed topics
  const completedTopicCount = Object.values(
    completedBySubject
  ).reduce((total, topics) => {
    return total + (Array.isArray(topics) ? topics.length : 0);
  }, 0);

  const totalTopics = courseData.reduce(
    (total, subject) => total + (subject.topics?.length || 0),
    0
  );

  const overallProgress = totalTopics
    ? Math.min(
        100,
        Math.round((completedTopicCount / totalTopics) * 100)
      )
    : 0;

  // Demo activities until activity tracking is implemented
  const activities = [
    {
      title: "Completed SQL Joins",
      subject: "Database Management System",
      time: "Today",
      icon: "✓",
    },
    {
      title: "Attempted Operating Systems Quiz",
      subject: "Operating Systems",
      time: "Yesterday",
      icon: "✎",
    },
    {
      title: "Studied Linked Lists",
      subject: "Data Structures",
      time: "2 days ago",
      icon: "▤",
    },
  ];

  const stats = [
    {
      title: "Enrolled Subjects",
      value: String(subjects.length).padStart(2, "0"),
      subtitle: "Your learning subjects",
      icon: "▤",
    },
    {
      title: "Completed Topics",
      value: String(completedTopicCount),
      subtitle: "Keep learning!",
      icon: "✓",
    },
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      subtitle: "Your learning progress",
      icon: "◎",
    },
    {
      title: "Learning Hours",
      value: "32",
      subtitle: "Demo study time",
      icon: "◷",
    },
  ];

  // Sidebar navigation
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (menu === "Dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (menu === "My Courses") {
      document.getElementById("my-courses")?.scrollIntoView({
        behavior: "smooth",
      });
    } else if (menu === "My Progress") {
      document.getElementById("my-progress")?.scrollIntoView({
        behavior: "smooth",
      });
    } else if (menu === "My Profile") {
      document.getElementById("my-profile")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FC] text-[#010737]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E5E2F5] bg-white px-5 py-7 md:flex">

          {/* LOGO */}
          <div className="mb-12 flex items-center gap-3 px-2">
            <img
              src="/Images/LearnCraft-Logo.png"
              alt="LearnCraft Logo"
              className="h-11 w-11 object-contain"
            />

            <span className="text-2xl font-extrabold text-[#3B0CA3]">
              LearnCraft
            </span>
          </div>

          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-[#9294AE]">
            Learning Menu
          </p>

          {/* MENU ITEMS */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
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

          {/* BOTTOM SIDEBAR */}
          <div className="mt-auto">
            <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#F0EDFF] to-[#E7EFFF] p-4">
              <p className="font-bold text-[#3B0CA3]">
                Keep Growing!
              </p>

              <p className="mt-2 text-sm leading-6 text-[#555B7D]">
                Small daily progress leads to big achievements.
              </p>
            </div>

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
        <main className="min-w-0 flex-1 px-5 py-7 md:px-9 lg:px-12">

          {/* TOP NAVBAR */}
          <header className="mb-9 flex flex-wrap items-center justify-between gap-4">

            <div className="md:hidden">
              <div className="flex items-center gap-2">
                <img
                  src="/Images/LearnCraft-Logo.png"
                  alt="LearnCraft Logo"
                  className="h-9 w-9 object-contain"
                />

                <span className="text-xl font-extrabold text-[#3B0CA3]">
                  LearnCraft
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-medium text-[#8588A5]">
                Learning Workspace
              </p>

              <h2 className="mt-1 text-2xl font-extrabold">
                Student Dashboard
              </h2>
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
            </div>
          </header>

          {/* WELCOME BANNER */}
          <section className="relative mb-9 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1237D5] via-[#2928C7] to-[#6416C8] p-7 text-white shadow-xl shadow-[#6840D9]/15 md:p-10">

            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-[#AFA0FF]/20 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                Welcome Back!
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Hello, {studentName} 👋
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-white/80">
                Ready to continue your learning journey?
                Keep improving your skills and achieve your academic goals.
              </p>

              <button
                onClick={() =>
                  document.getElementById("my-courses")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="mt-7 rounded-xl bg-white px-6 py-3 font-bold text-[#3B0CA3] shadow-lg transition hover:-translate-y-1"
              >
                Continue Learning →
              </button>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="mb-10">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">
                Your Learning Overview
              </h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                A quick look at your learning activities.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-[#E5E2F5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

                  <p className="mt-2 text-xs text-[#9294AE]">
                    {stat.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* COURSES */}
          <section id="my-courses" className="mb-10 scroll-mt-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">
                  My Courses
                </h2>

                <p className="mt-1 text-sm text-[#8588A5]">
                  Continue learning your enrolled subjects.
                </p>
              </div>

              <span className="text-sm font-bold text-[#6840D9]">
                {subjects.length.toString().padStart(2, "0")} Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
              {subjects.map((subject) => (
                <div
                  key={subject.shortName}
                  className="rounded-2xl border border-[#E5E2F5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EDFF] text-xl font-extrabold text-[#3B0CA3]">
                      {subject.shortName}
                    </div>

                    <span className="rounded-full bg-[#F0EDFF] px-3 py-1 text-xs font-bold text-[#6840D9]">
                      {subject.progress === 100
                        ? "Completed"
                        : subject.completedCount > 0
                          ? "In Progress"
                          : "Not Started"}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold">
                    {subject.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#8588A5]">
                    {subject.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#555B7D]">
                      Course Progress
                    </span>

                    <span
                      className="font-extrabold"
                      style={{ color: subject.color }}
                    >
                      {subject.progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEEAF8]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#8588A5]">
                      {subject.topics}
                    </span>

                    <button
                      onClick={() =>
                        onOpenSubject?.(subject.shortName)
                      }
                      className="text-sm font-bold text-[#6840D9] transition hover:text-[#3B0CA3]"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROGRESS AND ACTIVITY */}
          <section
            id="my-progress"
            className="mb-10 grid scroll-mt-8 grid-cols-1 gap-6 xl:grid-cols-2"
          >

            {/* PROGRESS */}
            <div className="rounded-2xl border border-[#E5E2F5] bg-white p-6">
              <h2 className="text-xl font-extrabold">
                Learning Progress
              </h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                Your subject-wise learning progress.
              </p>

              <div className="mt-7 space-y-6">
                {subjects.map((subject) => (
                  <div key={subject.shortName}>
                    <div className="mb-2 flex justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {subject.shortName}
                      </span>

                      <span className="text-sm font-bold text-[#555B7D]">
                        {subject.progress}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#EEEAF8]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${subject.progress}%`,
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-[#9294AE]">
                      {subject.topics}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-[#F5F2FF] p-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-bold text-[#3B0CA3]">
                    Overall Progress
                  </span>

                  <span className="text-sm font-extrabold text-[#3B0CA3]">
                    {overallProgress}%
                  </span>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3B0CA3] to-[#6840D9] transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#777B99]">
                  {completedTopicCount} of {totalTopics} topics completed
                </p>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="rounded-2xl border border-[#E5E2F5] bg-white p-6">
              <h2 className="text-xl font-extrabold">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-[#8588A5]">
                Sample learning activities.
              </p>

              <div className="mt-6 space-y-5">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EDFF] font-bold text-[#6840D9]">
                      {activity.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#8588A5]">
                        {activity.subject}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-[#9294AE]">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROFILE */}
          <section
            id="my-profile"
            className="mb-8 scroll-mt-8 rounded-2xl border border-[#E5E2F5] bg-white p-6"
          >
            <h2 className="text-xl font-extrabold">
              My Profile
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3B0CA3] to-[#6840D9] text-xl font-bold text-white">
                {studentName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-bold">{studentName}</h3>

                <p className="mt-1 text-sm text-[#8588A5]">
                  LearnCraft Student
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-[#E5E2F5] py-6 text-center text-sm text-[#9294AE]">
            © 2026 LearnCraft | Personalized Learning System
          </footer>

        </main>
      </div>
    </div>
  );
}
