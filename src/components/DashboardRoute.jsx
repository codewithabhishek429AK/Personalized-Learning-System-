
import { useOutletContext } from "react-router-dom";

import StudentDashboard from "./StudentDashboard";

function DashboardRoute({ onLogout, onOpenSubject }) {
  // Receive verified student profile from ProtectedRoute
  const { student } = useOutletContext();

  return (
    <StudentDashboard
      studentName={student?.name || "Student"}
      onLogout={onLogout}
      onOpenSubject={onOpenSubject}
    />
  );
}

export default DashboardRoute;
