
function LessonSidebar({ sections, onSelectSection }) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <aside className="h-fit rounded-2xl border border-[#DCD8FF] bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <h3 className="text-lg font-extrabold text-[#010737]">
        📚 Lesson Contents
      </h3>

      <p className="mt-1 text-sm text-[#6840D9]">
        Explore each concept step by step
      </p>

      <div className="mt-5 space-y-2">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSelectSection(index)}
            className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#F3F1FF]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#AFA0FF]/25 text-sm font-bold text-[#6840D9]">
              {index + 1}
            </span>

            <span className="pt-1 text-sm font-semibold text-[#333B69]">
              {section.heading}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default LessonSidebar;
