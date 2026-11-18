

const express = require("express");

const {
  getStudentProfile,
  getSelectedSubjects,
  updateSelectedSubjects,
  chooseElective,
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get Logged-in Student Profile
router.get("/profile", protect, getStudentProfile);

// Selected Subjects (curriculum tree checkboxes)
router.get("/subjects", protect, getSelectedSubjects);

router.put("/subjects", protect, updateSelectedSubjects);

// One choice per elective group (Elective-1 ... Elective-5)
router.put("/electives/:group", protect, chooseElective);

module.exports = router;

