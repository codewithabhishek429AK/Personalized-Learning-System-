
function HomePage({ onLogin, onOpenSubject }) {
  const subjects = [
    "DBMS",
    "Operating Systems",
    "Data Structures",
    "Web Technology",
  ];

  const scrollToSubjects = () => {
    document.getElementById("subjects")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F1FF] text-[#010737]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#DCD8FF] bg-[#F3F1FF]/95 px-6 py-5 backdrop-blur-md">
        <h2 className="bg-gradient-to-r from-[#6840D9] to-[#3B0CA3] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
          LearnCraft
        </h2>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#home"
            className="font-semibold text-[#010737] transition hover:text-[#3B0CA3]"
          >
            Home
          </a>

          <a
            href="#subjects"
            className="font-medium text-[#333B69] transition hover:text-[#3B0CA3]"
          >
            Subjects
          </a>

          <a
            href="#about"
            className="font-medium text-[#333B69] transition hover:text-[#3B0CA3]"
          >
            About
          </a>
        </div>

        <button
          onClick={onLogin}
          className="rounded-xl bg-gradient-to-r from-[#6840D9] to-[#3B0CA3] px-6 py-3 font-semibold text-white shadow-md shadow-[#6840D9]/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Login
        </button>
      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#F8F9FF] via-[#F3F1FF] to-[#EFEBFF] px-6 py-20 md:flex-row"
      >
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#849CFF]/25 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-[#AFA0FF]/35 blur-3xl" />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex-1">
          <p className="mb-5 inline-block rounded-full border border-[#DCD8FF] bg-[#AFA0FF]/25 px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#3B0CA3]">
            Personalized Learning Platform
          </p>

          <h1 className="text-4xl font-extrabold leading-tight text-[#010737] md:text-6xl">
            Learn Smarter.
            <br />

            <span className="bg-[linear-gradient(90deg,#1237D5_0%,#2928C7_35%,#4820B8_70%,#6416C8_100%)] bg-clip-text text-transparent">
              Prepare Better.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#333B69]">
            A smart learning platform for MCA and college students
            to understand subjects, practice questions, and prepare
            better for semester examinations.
          </p>

          {/* HERO BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={scrollToSubjects}
              className="rounded-xl bg-gradient-to-r from-[#849CFF] via-[#6840D9] to-[#3B0CA3] px-7 py-3 font-semibold text-white shadow-lg shadow-[#6840D9]/25 transition hover:-translate-y-1"
            >
              Start Learning →
            </button>

            <button
              onClick={scrollToSubjects}
              className="rounded-xl border border-[#AFA0FF] bg-white px-7 py-3 font-semibold text-[#3B0CA3] transition hover:bg-[#AFA0FF]/20"
            >
              Explore Subjects
            </button>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative z-10 w-full flex-1">
          <div className="overflow-hidden rounded-3xl border border-[#DCD8FF] bg-gradient-to-br from-[#849CFF] via-[#AFA0FF] to-[#3B0CA3] p-2 shadow-2xl shadow-[#6840D9]/20">
            <img
              src="/Images/learncraft%20image.png"
              alt="LearnCraft students studying together"
              className="h-full max-h-[480px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* LEARNING FEATURES */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-16 md:grid-cols-4">
        {[
          { number: "04+", label: "Learning Subjects" },
          { number: "AI", label: "Smart Learning" },
          { number: "Quiz", label: "Practice Questions" },
          { number: "100%", label: "Self Learning" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#DCD8FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-2xl font-extrabold text-[#6840D9]">
              {item.number}
            </h3>

            <p className="mt-2 text-sm font-medium text-[#333B69]">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      {/* SUBJECTS SECTION */}
      <section
        id="subjects"
        className="bg-gradient-to-b from-[#EFEBFF] via-[#F3F1FF] to-[#F8F9FF] px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[#3B0CA3]">
              Start Your Journey
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#010737] md:text-4xl">
              Explore Your Subjects
            </h2>

            <p className="mt-4 text-[#333B69]">
              Start learning your college subjects.
            </p>
          </div>

          {/* SUBJECT CARDS */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="rounded-2xl border border-[#DCD8FF] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#6840D9] hover:shadow-xl hover:shadow-[#6840D9]/15"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#AFA0FF]/25 text-xl font-extrabold text-[#3B0CA3]">
                  {subject === "DBMS"
                    ? "DB"
                    : subject === "Operating Systems"
                    ? "OS"
                    : subject === "Data Structures"
                    ? "DS"
                    : "WT"}
                </div>

                <h3 className="text-xl font-bold text-[#010737]">
                  {subject}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#333B69]">
                  Learn concepts and practice exam questions.
                </p>

                <button
                  onClick={() => onOpenSubject(subject)}
                  className="mt-6 font-bold text-[#6840D9] transition hover:text-[#3B0CA3]"
                >
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="about"
        className="border-t border-[#DCD8FF] bg-[#F3F1FF] px-6 py-10 text-center"
      >
        <h2 className="bg-gradient-to-r from-[#6840D9] to-[#3B0CA3] bg-clip-text text-2xl font-extrabold text-transparent">
          LearnCraft
        </h2>

        <p className="mt-3 text-[#333B69]">
          Learn Smarter. Prepare Better.
        </p>

        <p className="mt-5 text-sm text-[#333B69]/70">
          © 2026 LearnCraft | Personalized Learning System
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
