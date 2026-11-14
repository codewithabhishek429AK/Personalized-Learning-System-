
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SubjectLayout from "./pages/SubjectLayout";
import SubjectPage from "./components/SubjectPage";
import TopicRoute from "./pages/TopicRoute";

import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRoute from "./components/DashboardRoute";
import AIQuizGenerator from "./components/AIQuizGenerator";

import { apiRequest } from "./utils/api";

function App() {
  const navigate = useNavigate();

  const subjectIds = {
    DBMS: 1,
    "Operating Systems": 2,
    "Data Structures": 3,
    "Web Technology": 4,
  };

  const dashboardSubjectIds = {
    DBMS: 1,
    OS: 2,
    DSA: 3,
    WT: 4,
  };

  const openSubject = (subjectName) => {
    const subjectId = subjectIds[subjectName];

    if (subjectId) {
      navigate(`/subjects/${subjectId}`);
    }
  };

  const openDashboardSubject = (shortName) => {
    const subjectId = dashboardSubjectIds[shortName];

    if (subjectId) {
      navigate(`/subjects/${subjectId}`);
    }
  };

  // Login API
  const handleLogin = async ({ email, password }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("learncraft-token", data.token);

    alert("Login successful! Welcome to LearnCraft.");

    navigate("/dashboard", { replace: true });
  };

  // Registration API
  const handleRegister = async ({ name, email, password }) => {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    alert("Registration successful! Please login.");

    navigate("/login", { replace: true });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("learncraft-token");
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <HomePage
            onLogin={() => navigate("/login")}
            onOpenSubject={openSubject}
          />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={handleLogin}
            onRegister={() => navigate("/register")}
            onForgotPassword={() => navigate("/forgot-password")}
            onBack={() => navigate("/")}
          />
        }
      />

      {/* Registration */}
      <Route
        path="/register"
        element={
          <RegistrationPage
            onRegister={handleRegister}
            onLogin={() => navigate("/login")}
            onBack={() => navigate("/")}
          />
        }
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage
            onBack={() => navigate("/login")}
            onLogin={() => navigate("/login")}
          />
        }
      />

      {/* Protected Pages */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardRoute
              onLogout={handleLogout}
              onOpenSubject={openDashboardSubject}
            />
          }
        />

        {/* AI Quiz Generator */}
        <Route
          path="/ai-quiz"
          element={<AIQuizGenerator />}
        />
      </Route>

      {/* Subject and Topic Pages */}
      <Route
        path="/subjects/:subjectId"
        element={<SubjectLayout />}
      >
        <Route index element={<SubjectPage />} />

        <Route
          path="topics/:topicId"
          element={<TopicRoute />}
        />
      </Route>

      {/* Invalid Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
