
import {
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";

import TopicPage from "../components/TopicPage";

// Convert topic title into URL-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Frontend subject ID to backend subject ID
const backendSubjectIds = {
  1: "dbms",
  2: "os",
  3: "dsa",
  4: "wt",
};

function TopicRoute() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const {
    currentSubject,
    markTopicCompleted,
  } = useOutletContext();

  if (!currentSubject) {
    return <p className="p-8">Subject not found.</p>;
  }

  const topic = currentSubject.topics.find(
    (item) => createSlug(item.title) === topicId
  );

  if (!topic) {
    return <p className="p-8">Topic not found.</p>;
  }

  const backendSubjectId = backendSubjectIds[subjectId];

  // Mark topic as completed
  const handleComplete = () => {
    markTopicCompleted(
      createSlug(topic.title),
      topic.title
    );
  };

  return (
    <TopicPage
      topic={topic}
      subjectId={backendSubjectId}
      topicId={topicId}
      onBack={() => navigate("..")}
      onComplete={handleComplete}
    />
  );
}

export default TopicRoute;
