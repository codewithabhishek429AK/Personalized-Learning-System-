
/* global require, module */

const Student = require("../models/Student");

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

module.exports = { getStudentProfile };

