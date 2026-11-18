
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Regular (non-elective) subject codes the student has selected
    selectedSubjects: {
      type: [String],
      default: [],
    },

    // Exactly one chosen option per elective group, e.g.
    // [{ group: "Elective-1", code: "BMC011" }]
    electiveChoices: {
      type: [
        new mongoose.Schema(
          {
            group: { type: String, required: true },
            code: { type: String, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
