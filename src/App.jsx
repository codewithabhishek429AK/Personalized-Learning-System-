
import {
  Routes,
  Route,
  Navigate,
  useLocation,
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
import { setToken, clearSession } from "./utils/auth";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Home page cards -> official AKTU subject codes
  const subjectCodes = {
    DBMS: "BMC204",
    "Operating Systems": "BMC203",
    "Data Structures": "BMC205",
    "Web Technology": "BMC201",
  };

  const openSubject = (subjectName) => {
    const code = subjectCodes[subjectName];

    if (code) {
      navigate(`/subjects/${code}`);
    }
  };

  // Login API
  const handleLogin = async ({ email, password, rememberMe }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token, rememberMe);

    // Return to the page the student came from (e.g. a topic link)
    const from = location.state?.from;

    navigate(
      typeof from === "string" && from.startsWith("/") ? from : "/dashboard",
      { replace: true }
    );
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
    clearSession();
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
            <DashboardRoute onLogout={handleLogout} />
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
