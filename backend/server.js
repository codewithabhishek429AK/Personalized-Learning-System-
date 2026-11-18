

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quizRoutes = require("./routes/quizRoutes");
const aiRoutes = require("./routes/aiRoutes");
const curriculumRoutes = require("./routes/curriculumRoutes");

const missingEnv = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"].filter(
  (name) => !process.env[name]
);

if (missingEnv.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnv.join(", ")}`
  );
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Student Routes
app.use("/api/students", studentRoutes);

// Progress Routes
app.use("/api/progress", progressRoutes);

// Quiz Routes
app.use("/api/quizzes", quizRoutes);

// AI Routes
app.use("/api/ai", aiRoutes);

// Curriculum Routes (verified AKTU MCA syllabus)
app.use("/api/curriculum", curriculumRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LearnCraft Backend is running successfully!",
  });
});

// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`LearnCraft server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
