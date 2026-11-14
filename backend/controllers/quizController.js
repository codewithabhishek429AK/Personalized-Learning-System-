
/* global require, module */

const QuizResult = require("../models/QuizResult");

// Save Quiz Result
const saveQuizResult = async (req, res) => {
  try {
    const {
      subjectId,
      topicId,
      score,
      totalQuestions,
    } = req.body;

    // Validate required fields
    if (
      !subjectId ||
      !topicId ||
      score === undefined ||
      totalQuestions === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all quiz details.",
      });
    }

    // Validate score
    if (
      !Number.isInteger(score) ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1 ||
      score < 0 ||
      score > totalQuestions
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz score or total questions.",
      });
    }

    // Calculate percentage on backend
    const percentage = Math.round(
      (score / totalQuestions) * 100
    );

    // Save result
    const quizResult = await QuizResult.create({
      student: req.studentId,
      subjectId,
      topicId,
      score,
      totalQuestions,
      percentage,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz result saved successfully!",
      quizResult,
    });
  } catch (error) {
    console.error("Save Quiz Result Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while saving quiz result.",
    });
  }
};

// Get Student Quiz History
const getQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find({
      student: req.studentId,
    }).sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Quiz history fetched successfully!",
      totalAttempts: quizResults.length,
      quizResults,
    });
  } catch (error) {
    console.error("Get Quiz Results Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching quiz history.",
    });
  }
};

module.exports = {
  saveQuizResult,
  getQuizResults,
};
