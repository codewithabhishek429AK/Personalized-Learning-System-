
import { useNavigate, useOutletContext } from "react-router-dom";

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function SubjectPage() {
  const navigate = useNavigate();

  const {
    currentSubject,
    completedTopics,
  } = useOutletContext();

  const subject = currentSubject.name;
  const topics = currentSubject.topics || [];

  return (
    <div className="min-h-screen bg-[#F3F1FF] text-[#010737]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center border-b border-[#DCD8FF] bg-[#F3F1FF]/95 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img
            src="/Images/learncraft-logo.png"
            alt="LearnCraft Logo"
            className="h-11 w-11 object-contain"
          />

          <h2 className="bg-gradient-to-r from-[#1237D5] via-[#4820B8] to-[#6416C8] bg-clip-text text-2xl font-extrabold text-transparent">
            LearnCraft
          </h2>
        </div>
      </nav>

      {/* BACK BUTTON */}
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <button
          onClick={() => navigate("/")}
          className="rounded-xl border border-[#AFA0FF] bg-white px-6 py-3 font-semibold text-[#3B0CA3] shadow-sm transition hover:bg-[#AFA0FF]/20"
        >
          ← Back to Home
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* PAGE HEADING */}
        <div className="rounded-3xl border border-[#DCD8FF] bg-gradient-to-br from-white via-[#F3F1FF] to-[#EFEBFF] p-8 shadow-sm md:p-12">

          <p className="font-bold uppercase tracking-widest text-[#3B0CA3]">
            Your Learning Path
          </p>

          <h1 className="mt-4 text-4xl font-extrabold text-[#010737] md:text-5xl">
            {subject}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#333B69]">
            Select a unit and start learning. Understand concepts,
            practice questions and prepare for your semester examination.
          </p>

          {/* PROGRESS STATS */}
          <div className="mt-7 flex flex-wrap gap-4">

            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-2xl font-extrabold text-[#3B0CA3]">
                {topics.length}
              </p>
              <p className="text-sm text-[#333B69]">
                Total Units
              </p>
            </div>

            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-2xl font-extrabold text-[#3B0CA3]">
                {completedTopics.length}
              </p>
              <p className="text-sm text-[#333B69]">
                Completed
              </p>
            </div>

          </div>
        </div>

        {/* TOPICS HEADING */}
        <div className="mt-12">
          <p className="font-bold uppercase tracking-widest text-[#6840D9]">
            Course Content
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#010737]">
            Explore Units
          </h2>

          <p className="mt-2 text-[#333B69]">
            Choose any unit to begin your learning journey.
          </p>
        </div>

        {/* TOPIC CARDS */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {topics.map((topic, index) => (

            <div
              key={topic.title || index}
              className="rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#6840D9] hover:shadow-xl hover:shadow-[#6840D9]/10"
            >

              <div className="flex items-center justify-between">

                <span className="rounded-lg bg-[#AFA0FF]/25 px-4 py-2 text-sm font-bold text-[#3B0CA3]">
                  {topic.unit}
                </span>

                {completedTopics.includes(topic.title) && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ✓ Completed
                  </span>
                )}

              </div>

              <h3 className="mt-5 text-2xl font-bold text-[#010737]">
                {topic.title}
              </h3>

              <p className="mt-3 leading-7 text-[#333B69]">
                {topic.description}
              </p>

              <button
                onClick={() =>
                  navigate(`topics/${createSlug(topic.title)}`)
                }
                className="mt-7 rounded-xl bg-gradient-to-r from-[#1237D5] via-[#4820B8] to-[#6416C8] px-6 py-3 font-semibold text-white shadow-md shadow-[#6840D9]/20 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {completedTopics.includes(topic.title)
                  ? "Revise Topic →"
                  : "Start Topic →"}
              </button>

            </div>

          ))}

        </div>

        {/* EMPTY STATE */}
        {topics.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#DCD8FF] bg-white p-8 text-center">
            <h3 className="text-xl font-bold text-[#010737]">
              No Units Available
            </h3>

            <p className="mt-2 text-[#333B69]">
              Learning content for this subject will be added soon.
            </p>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-[#DCD8FF] bg-[#F3F1FF] px-6 py-8 text-center">
        <h2 className="bg-gradient-to-r from-[#1237D5] to-[#6416C8] bg-clip-text text-xl font-extrabold text-transparent">
          LearnCraft
        </h2>

        <p className="mt-2 text-sm text-[#333B69]">
          Learn Smarter. Prepare Better.
        </p>

        <p className="mt-4 text-xs text-[#333B69]/70">
          © 2026 LearnCraft | Personalized Learning System
        </p>
      </footer>

    </div>
  );
}

export default SubjectPage;
