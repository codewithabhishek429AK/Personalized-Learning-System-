
/* global require, module */

const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subjectId: {
      type: String,
      required: true,
    },

    completedTopics: [
      {
        topicId: {
          type: String,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// One progress document per student per subject
progressSchema.index(
  { student: 1, subjectId: 1 },
  { unique: true }
);

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
