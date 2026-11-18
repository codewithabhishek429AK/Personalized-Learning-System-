import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "../utils/api";
import { getTopic } from "../Data/mca";

// Loads the logged-in student's real progress and quiz history from MongoDB.
export default function useLearningData() {
  const [progress, setProgress] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      const [progressResult, quizResult] = await Promise.allSettled([
        apiRequest("/progress"),
        apiRequest("/quizzes/results"),
      ]);

      if (ignore) return;

      if (progressResult.status === "fulfilled") {
        setProgress(progressResult.value.progress || []);
      } else {
        setError(progressResult.reason?.message || "Unable to load progress.");
      }

      if (quizResult.status === "fulfilled") {
        setQuizResults(quizResult.value.quizResults || []);
      }

      setIsLoading(false);
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // subject code -> Set of completed topic ids (ignores records that do not
  // belong to the current curriculum, e.g. old demo data)
  const { completedBySubject, recentTopics } = useMemo(() => {
    const completed = {};
    const recent = [];

    progress.forEach((record) => {
      (record.completedTopics || []).forEach((entry) => {
        const found = getTopic(record.subjectId, entry.topicId);

        if (!found) return;

        const code = found.subject.code;

        if (!completed[code]) {
          completed[code] = new Set();
        }

        completed[code].add(entry.topicId);

        recent.push({
          code,
          subjectName: found.subject.name,
          topicId: entry.topicId,
          topicTitle: found.topic.title,
          unitLabel: found.unit.label,
          completedAt: entry.completedAt,
        });
      });
    });

    recent.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return { completedBySubject: completed, recentTopics: recent };
  }, [progress]);

  return {
    completedBySubject,
    recentTopics,
    quizResults,
    isLoading,
    error,
  };
}
