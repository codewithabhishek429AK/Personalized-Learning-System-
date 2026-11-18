
const express = require("express");

const {
  registerStudent,
  loginStudent,
} = require("../controllers/authController");

const router = express.Router();

// Student Registration
router.post("/register", registerStudent);

// Student Login
router.post("/login", loginStudent);

module.exports = router;