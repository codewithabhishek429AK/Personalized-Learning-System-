
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import subjects from "../Data/subjects";
import { apiRequest } from "../utils/api";

// Convert topic title into URL-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Map frontend numeric IDs to backend subject IDs
const backendSubjectIds = {
  1: "dbms",
  2: "os",
  3: "dsa",
  4: "wt",
};

function SubjectLayout() {
  const { subjectId } = useParams();

  const currentSubject = subjects.find(
    (item) => item.id === Number(subjectId)
  );

  const backendSubjectId = backendSubjectIds[subjectId];

  // Load existing progress from localStorage
  const [completedBySubject, setCompletedBySubject] = useState(() => {
    try {
      const savedProgress = localStorage.getItem("learncraft-progress");

      return savedProgress ? JSON.parse(savedProgress) : {};
    } catch {
      return {};
    }
  });

  // Fetch progress from MongoDB
  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      const token = localStorage.getItem("learncraft-token");

      if (!token || !backendSubjectId || !currentSubject) {
        return;
      }

      try {
        const data = await apiRequest("/progress");

        if (!isMounted) return;

        const subjectProgress = data.progress.find(
          (item) => item.subjectId === backendSubjectId
        );

        if (!subjectProgress) return;

        // Convert backend topic IDs into frontend topic titles
        const savedTopicTitles = subjectProgress.completedTopics
          .map((completedTopic) => {
            const matchedTopic = currentSubject.topics.find(
              (topic) =>
                createSlug(topic.title) === completedTopic.topicId
            );

            return matchedTopic ? matchedTopic.title : null;
          })
          .filter(Boolean);

        setCompletedBySubject((previousProgress) => {
          const existingTopics = previousProgress[subjectId] || [];

          const mergedTopics = [
            ...new Set([...existingTopics, ...savedTopicTitles]),
          ];

          return {
            ...previousProgress,
            [subjectId]: mergedTopics,
          };
        });
      } catch (error) {
        console.error("Progress Fetch Error:", error.message);
      }
    };

    fetchProgress();

    return () => {
      isMounted = false;
    };
  }, [subjectId, backendSubjectId, currentSubject]);

  // Save progress locally whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "learncraft-progress",
      JSON.stringify(completedBySubject)
    );
  }, [completedBySubject]);

  const completedTopics = completedBySubject[subjectId] || [];

  // Mark topic as completed
  const markTopicCompleted = async (topicId, topicTitle) => {
    const isAlreadyCompleted = completedTopics.includes(topicTitle);

    if (isAlreadyCompleted) return;

    // Update frontend immediately
    setCompletedBySubject((previousProgress) => {
      const currentCompleted = previousProgress[subjectId] || [];

      if (currentCompleted.includes(topicTitle)) {
        return previousProgress;
      }

      return {
        ...previousProgress,
        [subjectId]: [...currentCompleted, topicTitle],
      };
    });

    // Save progress to MongoDB
    const token = localStorage.getItem("learncraft-token");

    if (!token || !backendSubjectId) {
      return;
    }

    try {
      await apiRequest("/progress/complete-topic", {
        method: "POST",
        body: JSON.stringify({
          subjectId: backendSubjectId,
          topicId,
        }),
      });

      console.log("Topic progress saved successfully!");
    } catch (error) {
      console.error("Progress Save Error:", error.message);
    }
  };

  if (!currentSubject) {
    return <p className="p-8">Subject not found.</p>;
  }

  return (
    <Outlet
      context={{
        currentSubject,
        completedTopics,
        markTopicCompleted,
      }}
    />
  );
}

export default SubjectLayout;
