
/* global require, module */

const express = require("express");

const {
  saveQuizResult,
  getQuizResults,
} = require("../controllers/quizController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Save Quiz Result
router.post("/result", protect, saveQuizResult);

// Get Student Quiz History
router.get("/results", protect, getQuizResults);

module.exports = router;

