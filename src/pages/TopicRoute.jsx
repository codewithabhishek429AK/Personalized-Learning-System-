import { useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";

import TopicPage from "../components/TopicPage";
import SiteNavbar from "../components/SiteNavbar";
import SiteFooter from "../components/SiteFooter";
import { getTopic, legacyContent } from "../Data/mca";
import { setLastOpened } from "../utils/lastOpened";

function MessagePage({ title, text, action }) {
  return (
    <div className="min-h-screen bg-[#F3F1FF] text-[#010737]">
      <SiteNavbar />

      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-3xl font-extrabold">{title}</h1>

        <p className="mt-3 text-[#333B69]">{text}</p>

        <div className="mt-6">{action}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TopicRoute() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { subject, completedTopicIds, markTopicCompleted, isLoggedIn } =
    useOutletContext();

  const found = getTopic(subject.code, topicId);

  // Remember the last opened topic (highlighted in the curriculum tree)
  useEffect(() => {
    if (isLoggedIn && found) {
      setLastOpened(subject.code, topicId);
    }
  }, [isLoggedIn, found, subject.code, topicId]);

  if (!found) {
    return (
      <MessagePage
        title="Topic not found"
        text={`"${topicId}" is not a topic of ${subject.name}.`}
        action={
          <Link
            to={`/subjects/${subject.code}`}
            replace
            className="rounded-xl bg-[#6840D9] px-6 py-3 font-semibold text-white hover:bg-[#3B0CA3]"
          >
            Back to {subject.code}
          </Link>
        }
      />
    );
  }

  // Lessons and quizzes need an account
  if (!isLoggedIn) {
    return (
      <MessagePage
        title="Please log in to study this topic"
        text="AI lessons, Practice Quizzes and progress tracking are available after you log in."
        action={
          <button
            onClick={() =>
              navigate("/login", { state: { from: location.pathname } })
            }
            className="rounded-xl bg-[#6840D9] px-6 py-3 font-semibold text-white hover:bg-[#3B0CA3]"
          >
            Go to Login
          </button>
        }
      />
    );
  }

  const { unit, topic } = found;

  const extra = legacyContent[`${subject.code}:${topic.id}`];

  return (
    <TopicPage
      key={`${subject.code}-${topic.id}`}
      topic={{
        title: topic.title,
        description: topic.text,
        unit: `Semester ${subject.semester} · ${subject.code} · ${unit.label}`,
        importantPoints: extra?.importantPoints || [],
      }}
      subjectId={subject.code}
      topicId={topic.id}
      isCompleted={completedTopicIds.has(topic.id)}
      onBack={() => navigate(`/subjects/${subject.code}`)}
      onComplete={() => markTopicCompleted(topic.id)}
    />
  );
}

export default TopicRoute;
