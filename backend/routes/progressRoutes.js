

const express = require("express");

const {
  getProgress,
  completeTopic,
} = require("../controllers/progressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get Student Learning Progress
router.get("/", protect, getProgress);

// Mark Topic as Completed
router.post("/complete-topic", protect, completeTopic);

module.exports = router;
