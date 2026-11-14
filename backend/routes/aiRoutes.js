/* global require, module */

const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  generateAIQuiz,
  generateAILesson,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/generate-quiz", protect, generateAIQuiz);

router.post("/generate-lesson", protect, generateAILesson);

module.exports = router;