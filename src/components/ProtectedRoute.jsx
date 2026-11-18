
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { apiRequest } from "../utils/api";
import { getToken, clearSession } from "../utils/auth";

function ProtectedRoute() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const verifyStudent = async () => {
      const token = getToken();

      // Check whether token exists
      if (!token) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        // Fetch logged-in student's profile
        const data = await apiRequest("/students/profile");

        if (isMounted) {
          setStudent(data.student);
        }
      } catch (error) {
        // Invalid or expired token: end the session so we redirect to login
        if (error.status === 401 || error.status === 404) {
          clearSession();
        }

        if (isMounted) {
          setError(error.message || "Unable to verify your account.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifyStudent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading screen during verification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F1FF]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6840D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#010737] font-semibold">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if token is missing
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  // Show error if profile verification fails (e.g. server unreachable)
  if (error) {
    const handleLoginRedirect = () => {
      clearSession();
      navigate("/login", { replace: true });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F1FF] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#010737] mb-3">
            Account Verification Failed
          </h2>

          <p className="text-red-500 mb-6">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mr-3 rounded-xl border border-[#E6E2FA] bg-white px-6 py-3 font-semibold text-[#6C55F5] transition-colors hover:bg-[#F8F9FF]"
          >
            Try Again
          </button>

          <button
            onClick={handleLoginRedirect}
            className="bg-[#6840D9] hover:bg-[#3B0CA3] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Allow access after successful verification
  return <Outlet context={{ student }} />;
}

export default ProtectedRoute;
