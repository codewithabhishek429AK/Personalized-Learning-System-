
/* global require, module */

const Progress = require("../models/Progress");

// Get Student Learning Progress
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      student: req.studentId,
    });

    return res.status(200).json({
      success: true,
      message: "Learning progress fetched successfully!",
      progress,
    });
  } catch (error) {
    console.error("Get Progress Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching progress.",
    });
  }
};

// Mark Topic as Completed
const completeTopic = async (req, res) => {
  try {
    const { subjectId, topicId } = req.body;

    if (!subjectId || !topicId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID and Topic ID are required.",
      });
    }

    let progress = await Progress.findOne({
      student: req.studentId,
      subjectId,
    });

    if (!progress) {
      progress = new Progress({
        student: req.studentId,
        subjectId,
        completedTopics: [],
      });
    }

    const alreadyCompleted = progress.completedTopics.some(
      (topic) => topic.topicId === topicId
    );

    if (alreadyCompleted) {
      return res.status(200).json({
        success: true,
        message: "Topic is already completed.",
        progress,
      });
    }

    progress.completedTopics.push({ topicId });

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Topic marked as completed!",
      progress,
    });
  } catch (error) {
    console.error("Complete Topic Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating progress.",
    });
  }
};

module.exports = {
  getProgress,
  completeTopic,
};
