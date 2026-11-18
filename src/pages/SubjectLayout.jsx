import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";

import SiteNavbar from "../components/SiteNavbar";
import SiteFooter from "../components/SiteFooter";
import { getSubject, legacySubjectCodes } from "../Data/mca";
import { apiRequest } from "../utils/api";
import { getToken } from "../utils/auth";

function SubjectData({ subject }) {
  const isLoggedIn = Boolean(getToken());
  const [completedTopicIds, setCompletedTopicIds] = useState(() => new Set());

  // Load this subject's progress from MongoDB
  useEffect(() => {
    if (!isLoggedIn) return undefined;

    let ignore = false;

    async function fetchProgress() {
      try {
        const data = await apiRequest("/progress");

        if (ignore) return;

        const record = data.progress.find(
          (item) => item.subjectId === subject.code
        );

        setCompletedTopicIds(
          new Set((record?.completedTopics || []).map((t) => t.topicId))
        );
      } catch (error) {
        console.error("Progress Fetch Error:", error.message);
      }
    }

    fetchProgress();

    return () => {
      ignore = true;
    };
  }, [subject.code, isLoggedIn]);

  // Mark topic as completed (saved in MongoDB)
  const markTopicCompleted = async (topicId) => {
    if (completedTopicIds.has(topicId)) return;

    await apiRequest("/progress/complete-topic", {
      method: "POST",
      body: JSON.stringify({ subjectId: subject.code, topicId }),
    });

    setCompletedTopicIds((previous) => new Set([...previous, topicId]));
  };

  return (
    <Outlet
      context={{
        subject,
        completedTopicIds,
        markTopicCompleted,
        isLoggedIn,
      }}
    />
  );
}

function SubjectLayout() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  // Old numeric URLs (/subjects/1) redirect to the official subject code
  const legacyCode = legacySubjectCodes[subjectId];

  if (legacyCode) {
    return <Navigate to={`/subjects/${legacyCode}`} replace />;
  }

  const subject = getSubject(subjectId);

  if (!subject) {
    return (
      <div className="min-h-screen bg-[#F3F1FF] text-[#010737]">
        <SiteNavbar />

        <main className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="text-3xl font-extrabold">Subject not found</h1>

          <p className="mt-3 text-[#333B69]">
            No subject with the code "{subjectId}" exists in the MCA curriculum.
          </p>

          <button
            onClick={() => navigate("/", { replace: true })}
            className="mt-6 rounded-xl bg-[#6840D9] px-6 py-3 font-semibold text-white hover:bg-[#3B0CA3]"
          >
            Go to Home
          </button>
        </main>

        <SiteFooter />
      </div>
    );
  }

  return <SubjectData key={subject.code} subject={subject} />;
}

export default SubjectLayout;
