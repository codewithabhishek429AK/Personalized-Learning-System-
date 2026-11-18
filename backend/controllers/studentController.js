

const Student = require("../models/Student");
const {
  getSubject,
  getElectiveGroup,
  isElective,
} = require("../data/curriculum");

// Get Logged-in Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully!",
      student,
    });
  } catch (error) {
    console.error("Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile.",
    });
  }
};

// Shape returned to the client: regular selections + one choice per group
const selectionPayload = (student) => {
  const electiveChoices = {};

  (student.electiveChoices || []).forEach((choice) => {
    electiveChoices[choice.group] = choice.code;
  });

  return {
    // Only regular subjects belong here (older data may contain electives)
    selectedSubjects: (student.selectedSubjects || []).filter((code) => {
      const subject = getSubject(code);

      return subject && !isElective(subject);
    }),
    electiveChoices,
  };
};

// Get regular selections and elective choices
const getSelectedSubjects = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select(
      "selectedSubjects electiveChoices"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      ...selectionPayload(student),
    });
  } catch (error) {
    console.error("Get Selected Subjects Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching selected subjects.",
    });
  }
};

// Replace the logged-in student's REGULAR subject selection.
// Elective options are chosen through /electives/:group instead.
const updateSelectedSubjects = async (req, res) => {
  try {
    const { subjects } = req.body;

    if (
      !Array.isArray(subjects) ||
      subjects.length > 100 ||
      !subjects.every((code) => typeof code === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please send a list of subject codes.",
      });
    }

    // Normalise and remove duplicates
    const unique = [
      ...new Set(subjects.map((code) => code.trim().toUpperCase())),
    ];

    const unknown = unique.filter((code) => !getSubject(code));

    if (unknown.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown subject code(s): ${unknown.join(", ")}`,
      });
    }

    const electives = unique.filter((code) => isElective(getSubject(code)));

    if (electives.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${electives.join(", ")} ${
          electives.length === 1 ? "is an elective" : "are electives"
        }. Choose electives one per group.`,
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.studentId,
      { $set: { selectedSubjects: unique } },
      { returnDocument: "after" }
    ).select("selectedSubjects electiveChoices");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Selected subjects saved.",
      ...selectionPayload(student),
    });
  } catch (error) {
    console.error("Update Selected Subjects Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while saving selected subjects.",
    });
  }
};

// Choose (or change) the single option for one elective group.
// Only this group's entry is replaced; progress and other groups are untouched.
const chooseElective = async (req, res) => {
  try {
    const { group } = req.params;
    const code =
      typeof req.body.code === "string" ? req.body.code.trim().toUpperCase() : "";

    const electiveGroup = getElectiveGroup(group);

    if (!electiveGroup) {
      return res.status(400).json({
        success: false,
        message: "Unknown elective group.",
      });
    }

    if (!electiveGroup.options.includes(code)) {
      return res.status(400).json({
        success: false,
        message: `${code || "That subject"} is not an option of ${group}.`,
      });
    }

    // Single atomic update: drop any previous choice for this group, add the new one
    const student = await Student.findByIdAndUpdate(
      req.studentId,
      [
        {
          $set: {
            electiveChoices: {
              $concatArrays: [
                {
                  $filter: {
                    input: { $ifNull: ["$electiveChoices", []] },
                    cond: { $ne: ["$$this.group", group] },
                  },
                },
                [{ group, code }],
              ],
            },
          },
        },
      ],
      { returnDocument: "after", updatePipeline: true }
    ).select("selectedSubjects electiveChoices");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${group} saved.`,
      ...selectionPayload(student),
    });
  } catch (error) {
    console.error("Choose Elective Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while saving elective choice.",
    });
  }
};

module.exports = {
  getStudentProfile,
  getSelectedSubjects,
  updateSelectedSubjects,
  chooseElective,
};

