

const Progress = require("../models/Progress");
const { getTopic } = require("../data/curriculum");

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

    if (!getTopic(subjectId, topicId)) {
      return res.status(400).json({
        success: false,
        message: "Unknown subject or topic.",
      });
    }

    // Atomic update: avoids duplicate topics if two requests arrive together
    await Progress.updateOne(
      { student: req.studentId, subjectId },
      { $setOnInsert: { completedTopics: [] } },
      { upsert: true }
    );

    const updated = await Progress.findOneAndUpdate(
      {
        student: req.studentId,
        subjectId,
        "completedTopics.topicId": { $ne: topicId },
      },
      { $push: { completedTopics: { topicId } } },
      { returnDocument: "after" }
    );

    const progress =
      updated ||
      (await Progress.findOne({ student: req.studentId, subjectId }));

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
