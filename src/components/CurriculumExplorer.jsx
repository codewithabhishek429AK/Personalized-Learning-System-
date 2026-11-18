import CurriculumTree from "./CurriculumTree";
import SelectedSubjectsPanel from "./SelectedSubjectsPanel";
import { semesters, curriculumTotals, electiveGroups } from "../Data/mca";
import { getLastOpened } from "../utils/lastOpened";
import { useState } from "react";

// Selection panel + tree. `selection` comes from useSelection(), which keeps
// regular subjects and elective choices in MongoDB for the logged-in student.
function CurriculumExplorer({ selection, completedBySubject = {} }) {
  const [lastOpened] = useState(() => getLastOpened());

  const regularTotal = semesters.reduce(
    (sum, semester) => sum + semester.regularSubjects.length,
    0
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-[#555B7D]">
        MCA (AKTU, NEP 2020): {curriculumTotals.semesters} semesters ·{" "}
        {regularTotal} regular subjects · {electiveGroups.length} elective
        groups (choose one of 5 in each) · {curriculumTotals.units} units ·{" "}
        {curriculumTotals.topics} topics
      </p>

      {selection.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {selection.error}
        </div>
      )}

      <SelectedSubjectsPanel
        selected={selection.selected}
        electiveChoices={selection.electiveChoices}
        onRemove={selection.removeSubject}
        onClear={selection.clearRegular}
        completedBySubject={completedBySubject}
        isSaving={selection.isSaving || selection.isLoading}
      />

      <CurriculumTree
        semesters={semesters}
        selected={selection.selectedSet}
        electiveChoices={selection.electiveChoices}
        onToggleSubject={selection.toggleSubject}
        onToggleSemester={selection.toggleSemester}
        onChooseElective={selection.chooseElective}
        completedBySubject={completedBySubject}
        lastOpened={lastOpened}
        canSelect={!selection.isLoading}
      />
    </div>
  );
}

export default CurriculumExplorer;
