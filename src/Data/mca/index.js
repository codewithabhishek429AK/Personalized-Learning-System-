import semester1 from "./semester1.json";
import semester2 from "./semester2.json";
import semester3 from "./semester3.json";
import semester4 from "./semester4.json";
import legacySubjects from "../subjects";

// Verified AKTU MCA (NEP 2020) curriculum:
// MCA -> Semester -> Subject -> Unit -> Topic

const UNIT_LABELS = { Lab: "Practical Experiments" };

function buildSubject(raw, semester) {
  const units = (raw.units || []).map((unit, unitIndex) => ({
    id: `u${unitIndex + 1}`,
    no: unit.no,
    label: UNIT_LABELS[unit.no] || (/^[IVX]+$/.test(unit.no) ? `Unit ${unit.no}` : unit.no),
    topics: unit.topics.map((topic, topicIndex) => ({
      id: `u${unitIndex + 1}-t${topicIndex + 1}`,
      title: topic.t,
      // Verbatim syllabus text (labs use the experiment text itself)
      text: topic.x || topic.t,
      editorialTitle: Boolean(topic.e),
    })),
  }));

  return {
    code: raw.code,
    name: raw.name,
    type: raw.type,
    group: raw.group || null,
    ltp: raw.ltp,
    credits: raw.credits,
    note: raw.note || "",
    hasSyllabus: !raw.noSyllabus && units.length > 0,
    semester,
    units,
    unitCount: units.length,
    topicCount: units.reduce((sum, unit) => sum + unit.topics.length, 0),
  };
}

export const semesters = [semester1, semester2, semester3, semester4].map(
  (raw) => ({
    number: raw.semester,
    title: raw.title,
    source: raw.source,
    subjects: raw.subjects.map((subject) => buildSubject(subject, raw.semester)),
  })
);

export const allSubjects = semesters.flatMap((semester) => semester.subjects);

const subjectByCode = new Map(allSubjects.map((s) => [s.code, s]));

// Elective groups: Elective-1 ... Elective-5, five options each.
// A student chooses exactly one option per group.
export const electiveGroups = [
  ...new Set(allSubjects.filter((s) => s.group).map((s) => s.group)),
].map((id) => {
  const options = allSubjects.filter((s) => s.group === id);

  return { id, semester: options[0].semester, options };
});

export const isElective = (subject) => Boolean(subject && subject.group);

// Per semester: regular subjects + the elective groups that belong to it
semesters.forEach((semester) => {
  semester.regularSubjects = semester.subjects.filter((s) => !s.group);
  semester.electiveGroups = electiveGroups.filter(
    (group) => group.semester === semester.number
  );
});

// A student's own path = every regular subject + the chosen option of each
// elective group. electiveChoices looks like { "Elective-1": "BMC011" }.
export function subjectsInScope(electiveChoices = {}) {
  return allSubjects.filter(
    (subject) => !subject.group || electiveChoices[subject.group] === subject.code
  );
}

export function getSubject(code) {
  return subjectByCode.get(String(code || "").toUpperCase()) || null;
}

export function getTopic(code, topicId) {
  const subject = getSubject(code);

  if (!subject) return null;

  for (const unit of subject.units) {
    const topic = unit.topics.find((item) => item.id === topicId);

    if (topic) {
      return { subject, unit, topic };
    }
  }

  return null;
}

export function semesterTotals(semester) {
  return {
    subjects: semester.subjects.length,
    regular: semester.regularSubjects.length,
    electiveGroups: semester.electiveGroups.length,
    units: semester.subjects.reduce((sum, s) => sum + s.unitCount, 0),
    topics: semester.subjects.reduce((sum, s) => sum + s.topicCount, 0),
  };
}

export const curriculumTotals = {
  semesters: semesters.length,
  subjects: allSubjects.length,
  units: allSubjects.reduce((sum, s) => sum + s.unitCount, 0),
  topics: allSubjects.reduce((sum, s) => sum + s.topicCount, 0),
};

// Existing hand-written LearnCraft content, kept where it matches the
// official syllabus (DBMS "Introduction" = BMC204 Unit I, first topic).
const legacyDbmsIntro = legacySubjects[0]?.topics?.[0];

export const legacyContent = {
  "BMC204:u1-t1": {
    importantPoints: legacyDbmsIntro?.importantPoints || [],
    realWorldExample: legacyDbmsIntro?.studyMaterial?.realWorldExample || null,
  },
};

// Old numeric subject URLs (/subjects/1 ...) map to their official codes
export const legacySubjectCodes = {
  1: "BMC204",
  2: "BMC203",
  3: "BMC205",
  4: "BMC201",
};
