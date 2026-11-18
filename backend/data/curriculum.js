// Server-side copy of the verified AKTU MCA (NEP 2020) curriculum.
// It reads the same JSON files the React app uses, so there is one source of truth.

const path = require("path");

const dataDir = path.join(__dirname, "..", "..", "src", "Data", "mca");

const semesters = [1, 2, 3, 4].map((number) => {
  const raw = require(path.join(dataDir, `semester${number}.json`));

  const subjects = raw.subjects.map((subject) => {
    const units = (subject.units || []).map((unit, unitIndex) => ({
      id: `u${unitIndex + 1}`,
      no: unit.no,
      topics: unit.topics.map((topic, topicIndex) => ({
        id: `u${unitIndex + 1}-t${topicIndex + 1}`,
        title: topic.t,
        text: topic.x || topic.t,
      })),
    }));

    return {
      code: subject.code,
      name: subject.name,
      type: subject.type,
      group: subject.group || null,
      ltp: subject.ltp,
      credits: subject.credits,
      note: subject.note || "",
      hasSyllabus: !subject.noSyllabus && units.length > 0,
      semester: raw.semester,
      units,
    };
  });

  return { number: raw.semester, title: raw.title, source: raw.source, subjects };
});

const allSubjects = semesters.flatMap((semester) => semester.subjects);
const subjectByCode = new Map(allSubjects.map((s) => [s.code, s]));

const getSubject = (code) =>
  subjectByCode.get(String(code || "").toUpperCase()) || null;

const getTopic = (code, topicId) => {
  const subject = getSubject(code);

  if (!subject) return null;

  for (const unit of subject.units) {
    const topic = unit.topics.find((item) => item.id === topicId);

    if (topic) {
      return { subject, unit, topic };
    }
  }

  return null;
};

// Elective groups: Elective-1 ... Elective-5, each with five options.
// A student picks exactly one option per group.
const electiveGroups = [
  ...new Set(allSubjects.filter((s) => s.group).map((s) => s.group)),
].map((id) => {
  const options = allSubjects.filter((s) => s.group === id);

  return { id, semester: options[0].semester, options: options.map((s) => s.code) };
});

const getElectiveGroup = (id) => electiveGroups.find((g) => g.id === id) || null;

const isElective = (subject) => Boolean(subject && subject.group);

const countTopics = (subject) =>
  subject.units.reduce((sum, unit) => sum + unit.topics.length, 0);

module.exports = {
  semesters,
  allSubjects,
  getSubject,
  getTopic,
  countTopics,
  electiveGroups,
  getElectiveGroup,
  isElective,
};
