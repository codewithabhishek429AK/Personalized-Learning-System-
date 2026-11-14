
/* global require, module */

const express = require("express");

const {
  getStudentProfile,
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get Logged-in Student Profile
router.get("/profile", protect, getStudentProfile);

module.exports = router;

