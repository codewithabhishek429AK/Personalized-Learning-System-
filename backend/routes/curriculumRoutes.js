const express = require("express");

const {
  semesters,
  allSubjects,
  getSubject,
  countTopics,
  electiveGroups,
} = require("../data/curriculum");

const router = express.Router();

// Summary of the whole MCA curriculum (public)
router.get("/", (req, res) => {
  const summary = semesters.map((semester) => ({
    semester: semester.number,
    title: semester.title,
    source: semester.source,
    subjects: semester.subjects.map((subject) => ({
      code: subject.code,
      name: subject.name,
      type: subject.type,
      group: subject.group,
      ltp: subject.ltp,
      credits: subject.credits,
      hasSyllabus: subject.hasSyllabus,
      units: subject.units.length,
      topics: countTopics(subject),
    })),
  }));

  res.status(200).json({
    success: true,
    totals: {
      semesters: semesters.length,
      subjects: allSubjects.length,
      units: allSubjects.reduce((sum, s) => sum + s.units.length, 0),
      topics: allSubjects.reduce((sum, s) => sum + countTopics(s), 0),
    },
    electiveGroups,
    curriculum: summary,
  });
});

// Full syllabus of one subject (public)
router.get("/subjects/:code", (req, res) => {
  const subject = getSubject(req.params.code);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: "Subject not found.",
    });
  }

  return res.status(200).json({ success: true, subject });
});

module.exports = router;
