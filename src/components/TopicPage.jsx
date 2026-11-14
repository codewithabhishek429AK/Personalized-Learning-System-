
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function TopicPage({
  topic,
  onBack,
  onComplete,
  subjectId,
  topicId,
}) {
  // AI Lesson states
  const [lesson, setLesson] = useState(null);
  const [isLessonLoading, setIsLessonLoading] = useState(true);
  const [lessonError, setLessonError] = useState("");

  // Existing topic material fallback
  const studyMaterial = topic.studyMaterial;
  const importantPoints = topic.importantPoints || [];

  // Quiz generation states
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [generationError, setGenerationError] = useState("");

  // Quiz states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Result API states
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [quizSaveMessage, setQuizSaveMessage] = useState("");
  const [quizSaveError, setQuizSaveError] = useState("");

  const question = questions[currentQuestion];

  // ==========================================
  // GENERATE AI STUDY LESSON AUTOMATICALLY
  // ==========================================

  async function loadAILesson() {
    try {
      setIsLessonLoading(true);
      setLessonError("");
      setLesson(null);

      const data = await apiRequest("/ai/generate-lesson", {
        method: "POST",
        body: JSON.stringify({
          subject:
            topic.subject ||
            topic.subjectName ||
            "Computer Science",
          topic: topic.title,
        }),
      });

      if (!data.success || !data.lesson) {
        throw new Error("Unable to load study material.");
      }

      setLesson(data.lesson);
    } catch (error) {
      setLessonError(
        error.message || "Unable to generate study material."
      );
    } finally {
      setIsLessonLoading(false);
    }
  }

  useEffect(() => {
    loadAILesson();
  }, [topic.title]);

  // ==========================================
  // GENERATE AI PRACTICE QUIZ
  // ==========================================

  async function generateAIQuiz(event) {
    event.preventDefault();

    try {
      setIsGenerating(true);
      setGenerationError("");
      setQuizSaveError("");

      const data = await apiRequest("/ai/generate-quiz", {
        method: "POST",
        body: JSON.stringify({
          subject:
            topic.subject ||
            topic.subjectName ||
            "Computer Science",
          topic: topic.title,
          difficulty,
          numberOfQuestions: Number(numberOfQuestions),
        }),
      });

      if (!data.success || !Array.isArray(data.quiz?.questions)) {
        throw new Error("Invalid quiz response.");
      }

      const formattedQuestions = data.quiz.questions.map((item) => ({
        question: item.question,
        options: item.options,
        answer: item.correctAnswer,
        explanation: item.explanation,
      }));

      if (
        formattedQuestions.length !== Number(numberOfQuestions) ||
        formattedQuestions.some(
          (item) =>
            !item.question ||
            !Array.isArray(item.options) ||
            item.options.length !== 4 ||
            !item.answer ||
            !item.options.includes(item.answer)
        )
      ) {
        throw new Error("AI generated an invalid quiz. Please try again.");
      }

      setQuestions(formattedQuestions);
      setCurrentQuestion(0);
      setSelectedAnswer("");
      setScore(0);
      setFinalScore(0);
      setQuizFinished(false);
      setAnswerSubmitted(false);
      setQuizSaveMessage("");
      setQuizSaveError("");
      setQuizStarted(true);
    } catch (error) {
      setGenerationError(
        error.message || "Unable to generate quiz. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  // ==========================================
  // CHECK ANSWER
  // ==========================================

  function handleSubmit() {
    if (!selectedAnswer || answerSubmitted || !question) {
      return;
    }

    const isCorrect = selectedAnswer === question.answer;

    if (isCorrect) {
      setScore((previousScore) => previousScore + 1);
    }

    setAnswerSubmitted(true);
  }

  // ==========================================
  // NEXT QUESTION AND SAVE RESULT
  // ==========================================

  async function handleNextQuestion() {
    if (!answerSubmitted || isSavingQuiz) {
      return;
    }

    const updatedScore = score;

    if (currentQuestion === questions.length - 1) {
      setIsSavingQuiz(true);
      setQuizSaveMessage("");
      setQuizSaveError("");

      try {
        if (!subjectId || !topicId) {
          throw new Error("Subject or topic information is missing.");
        }

        await apiRequest("/quizzes/result", {
          method: "POST",
          body: JSON.stringify({
            subjectId,
            topicId,
            score: updatedScore,
            totalQuestions: questions.length,
          }),
        });

        setFinalScore(updatedScore);
        setQuizFinished(true);
        setQuizSaveMessage("Quiz result saved successfully!");
      } catch (error) {
        setQuizSaveError(
          error.message || "Unable to save quiz result."
        );
      } finally {
        setIsSavingQuiz(false);
      }
    } else {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer("");
      setAnswerSubmitted(false);
    }
  }

  // ==========================================
  // RESTART QUIZ
  // ==========================================

  function restartQuiz() {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setFinalScore(0);
    setQuizFinished(false);
    setAnswerSubmitted(false);
    setQuizStarted(false);
    setQuizSaveMessage("");
    setQuizSaveError("");
    setGenerationError("");
  }

  const isCorrect = question
    ? selectedAnswer === question.answer
    : false;

  // AI lesson data with fallback
  const displayedImportantPoints =
    lesson?.importantPoints?.length > 0
      ? lesson.importantPoints
      : importantPoints;

  return (
    <div className="min-h-screen bg-[#F3F1FF] text-[#010737]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center border-b border-[#DCD8FF] bg-[#F3F1FF]/95 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img
            src="/Images/learncraft-logo.png"
            alt="LearnCraft Logo"
            className="h-11 w-11 object-contain"
          />

          <h2 className="bg-gradient-to-r from-[#1237D5] via-[#4820B8] to-[#6416C8] bg-clip-text text-2xl font-extrabold text-transparent">
            LearnCraft
          </h2>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={onBack}
          className="mb-8 rounded-xl border border-[#AFA0FF] bg-white px-5 py-2.5 font-semibold text-[#3B0CA3] shadow-sm transition hover:bg-[#AFA0FF]/20"
        >
          ← Back to Units
        </button>

        {/* TOPIC HEADER */}
        <div className="rounded-3xl border border-[#DCD8FF] bg-gradient-to-br from-white via-[#F3F1FF] to-[#EFEBFF] p-8 shadow-sm md:p-10">
          <p className="font-bold uppercase tracking-widest text-[#3B0CA3]">
            Your Learning Journey
          </p>

          <h1 className="mt-4 text-3xl font-extrabold text-[#010737] md:text-5xl">
            {topic.title}
          </h1>

          <p className="mt-4 leading-7 text-[#333B69]">
            {topic.description}
          </p>

          <div className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 shadow-sm">
            <span className="font-semibold text-[#6840D9]">
              {topic.unit}
            </span>
          </div>
        </div>

        {/* ==================================
            AI LESSON INTRODUCTION
        ================================== */}

        <section className="mt-10 rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm md:p-9">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#AFA0FF]/25 text-xl">
              📘
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#010737]">
                Learn This Topic
              </h2>

              <p className="text-sm text-[#6840D9]">
                Step-by-step study material
              </p>
            </div>
          </div>

          {isLessonLoading ? (
            <div className="mt-8 rounded-xl bg-[#F8F9FF] p-8 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DCD8FF] border-t-[#6840D9]" />

              <h3 className="mt-5 text-lg font-bold text-[#3B0CA3]">
                Preparing Your Lesson...
              </h3>

              <p className="mt-2 text-sm text-[#333B69]">
                Your study material is being prepared.
              </p>
            </div>
          ) : lessonError ? (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="font-semibold text-red-700">
                {lessonError}
              </p>

              <button
                onClick={loadAILesson}
                className="mt-4 rounded-lg bg-[#6840D9] px-5 py-2.5 font-semibold text-white hover:bg-[#3B0CA3]"
              >
                Try Again
              </button>
            </div>
          ) : lesson ? (
            <>
              <h3 className="mt-8 text-2xl font-bold text-[#3B0CA3]">
                {lesson.title}
              </h3>

              <p className="mt-4 leading-8 text-[#333B69]">
                {lesson.introduction}
              </p>

              {/* WHY IMPORTANT */}
              <div className="mt-7 rounded-xl border border-[#DCD8FF] bg-[#F8F9FF] p-6">
                <h3 className="text-lg font-bold text-[#3B0CA3]">
                  🎯 Why Is This Topic Important?
                </h3>

                <p className="mt-3 leading-7 text-[#333B69]">
                  {lesson.whyImportant}
                </p>
              </div>

              {/* LEARNING OBJECTIVES */}
              <div className="mt-7">
                <h3 className="text-xl font-bold text-[#010737]">
                  What You Will Learn
                </h3>

                <ul className="mt-4 space-y-3">
                  {lesson.learningObjectives.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#333B69]"
                    >
                      <span className="font-bold text-[#6840D9]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="mt-6 text-[#333B69]">
              Study material is not available right now.
            </p>
          )}
        </section>

        {/* ==================================
            DETAILED LEARNING SECTIONS
        ================================== */}

        {lesson && (
          <section className="mt-6 space-y-6">

            {lesson.sections.map((section, index) => (
              <article
                key={index}
                className="rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm md:p-9"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#AFA0FF]/25 font-bold text-[#3B0CA3]">
                    {index + 1}
                  </div>

                  <h2 className="text-xl font-extrabold text-[#010737] md:text-2xl">
                    {section.heading}
                  </h2>
                </div>

                <p className="mt-6 whitespace-pre-line leading-8 text-[#333B69]">
                  {section.explanation}
                </p>

                {/* PRACTICAL EXAMPLE */}
                {section.example && (
                  <div className="mt-6 rounded-xl border border-[#DCD8FF] bg-[#F8F9FF] p-5">
                    <h3 className="font-bold text-[#3B0CA3]">
                      💡 Example
                    </h3>

                    <p className="mt-3 whitespace-pre-line leading-7 text-[#333B69]">
                      {section.example}
                    </p>
                  </div>
                )}

                {/* CODE OR SQL QUERY */}
                {section.code && (
                  <div className="mt-6 overflow-hidden rounded-xl bg-[#10152F]">
                    <div className="border-b border-white/10 px-5 py-3">
                      <span className="text-sm font-semibold text-[#C4B5FD]">
                        Code Example
                      </span>
                    </div>

                    <pre className="overflow-x-auto p-5 text-sm leading-7 text-[#E2E8F0]">
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}

                {/* CODE EXPLANATION */}
                {section.codeExplanation && (
                  <div className="mt-5 rounded-xl bg-[#F3F1FF] p-5">
                    <h3 className="font-bold text-[#3B0CA3]">
                      Code Explanation
                    </h3>

                    <p className="mt-3 whitespace-pre-line leading-7 text-[#333B69]">
                      {section.codeExplanation}
                    </p>
                  </div>
                )}
              </article>
            ))}

            {/* REAL WORLD EXAMPLE */}
            <article className="rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm md:p-9">
              <h2 className="text-2xl font-extrabold text-[#010737]">
                🌍 Real-World Applications
              </h2>

              <p className="mt-5 whitespace-pre-line leading-8 text-[#333B69]">
                {lesson.realWorldExample}
              </p>
            </article>

          </section>
        )}

        {/* ==================================
            IMPORTANT POINTS
        ================================== */}

        <section className="mt-6 rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm md:p-9">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#AFA0FF]/25 text-xl">
              ⭐
            </div>

            <h2 className="text-2xl font-extrabold text-[#010737]">
              Important Points
            </h2>
          </div>

          {displayedImportantPoints.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {displayedImportantPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[#333B69]"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#AFA0FF]/30 text-sm font-bold text-[#3B0CA3]">
                    ✓
                  </span>

                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-[#333B69]">
              Important points will be added soon.
            </p>
          )}
        </section>

        {/* ==================================
            EXAM QUESTIONS
        ================================== */}

        {lesson?.examQuestions?.length > 0 && (
          <section className="mt-6 rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-extrabold text-[#010737]">
              📝 Important Exam Questions
            </h2>

            <ol className="mt-6 list-inside list-decimal space-y-4 text-[#333B69]">
              {lesson.examQuestions.map((item, index) => (
                <li key={index} className="leading-7">
                  {item}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ==================================
            QUICK SUMMARY
        ================================== */}

        {lesson?.summary?.length > 0 && (
          <section className="mt-6 rounded-2xl border border-[#DCD8FF] bg-gradient-to-br from-white to-[#EFEBFF] p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-extrabold text-[#3B0CA3]">
              📚 Quick Revision
            </h2>

            <ul className="mt-5 space-y-3">
              {lesson.summary.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 leading-7 text-[#333B69]"
                >
                  <span className="font-bold text-[#6840D9]">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ==================================
            PRACTICE QUIZ
        ================================== */}

        <section className="mt-8 rounded-2xl border border-[#DCD8FF] bg-white p-7 shadow-sm md:p-9">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#AFA0FF]/25 text-xl">
              🧠
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#010737]">
                Practice Quiz
              </h2>

              <p className="text-sm text-[#333B69]">
                Test what you have learned.
              </p>
            </div>
          </div>

          {/* QUIZ SETUP */}
          {!quizStarted && (
            <form onSubmit={generateAIQuiz} className="mt-7">

              <div className="rounded-xl border border-[#DCD8FF] bg-[#F8F9FF] p-5">
                <h3 className="font-bold text-[#3B0CA3]">
                  Ready to Test Your Knowledge?
                </h3>

                <p className="mt-2 leading-7 text-[#333B69]">
                  Complete your lesson and check your understanding with a practice quiz.
                </p>

                <p className="mt-3 text-sm font-semibold text-[#6840D9]">
                  Topic: {topic.title}
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block font-semibold text-[#333B69]">
                    Difficulty Level
                  </label>

                  <select
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                    className="w-full rounded-xl border border-[#DCD8FF] bg-white p-3 outline-none focus:border-[#6840D9]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-[#333B69]">
                    Number of Questions
                  </label>

                  <select
                    value={numberOfQuestions}
                    onChange={(event) =>
                      setNumberOfQuestions(Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-[#DCD8FF] bg-white p-3 outline-none focus:border-[#6840D9]"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>
              </div>

              {generationError && (
                <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {generationError}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#1237D5] via-[#4820B8] to-[#6416C8] px-7 py-4 font-bold text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating
                  ? "Generating Your Quiz..."
                  : "✨ Start Practice Quiz"}
              </button>
            </form>
          )}

          {/* GENERATED QUIZ */}
          {quizStarted && questions.length > 0 && (
            !quizFinished ? (
              <>
                <div className="mt-7 flex justify-between text-sm font-semibold text-[#333B69]">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>

                  <span className="text-[#6840D9]">
                    Score: {score}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E9E4FF]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1237D5] to-[#6416C8] transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                <h3 className="mt-7 text-xl font-bold text-[#010737]">
                  {question.question}
                </h3>

                <div className="mt-5 space-y-3">
                  {question.options.map((option, index) => {
                    const correctOption = option === question.answer;
                    const selectedOption = option === selectedAnswer;

                    let optionStyle =
                      "border-[#DCD8FF] bg-white hover:border-[#6840D9]";

                    if (answerSubmitted && correctOption) {
                      optionStyle = "border-green-500 bg-green-50";
                    } else if (answerSubmitted && selectedOption) {
                      optionStyle = "border-red-500 bg-red-50";
                    } else if (selectedOption) {
                      optionStyle = "border-[#6840D9] bg-[#AFA0FF]/20";
                    }

                    return (
                      <label
                        key={index}
                        className={`flex items-center gap-3 rounded-xl border p-4 transition ${optionStyle} ${
                          answerSubmitted
                            ? "cursor-default"
                            : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="radio"
                          name="quiz-answer"
                          value={option}
                          checked={selectedAnswer === option}
                          disabled={answerSubmitted}
                          onChange={(event) =>
                            setSelectedAnswer(event.target.value)
                          }
                          className="accent-[#3B0CA3]"
                        />

                        <span className="flex-1 font-medium text-[#333B69]">
                          {option}
                        </span>

                        {answerSubmitted && correctOption && (
                          <span className="font-bold text-green-700">
                            ✓ Correct
                          </span>
                        )}

                        {answerSubmitted &&
                          selectedOption &&
                          !correctOption && (
                            <span className="font-bold text-red-600">
                              ✕ Incorrect
                            </span>
                          )}
                      </label>
                    );
                  })}
                </div>

                {/* ANSWER EXPLANATION */}
                {answerSubmitted && (
                  <div
                    className={`mt-6 rounded-xl border p-5 ${
                      isCorrect
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                    }`}
                  >
                    <h4
                      className={`font-bold ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isCorrect ? "Correct Answer!" : "Incorrect Answer"}
                    </h4>

                    <p className="mt-2 leading-7 text-[#333B69]">
                      <strong>Correct answer:</strong> {question.answer}
                    </p>

                    <p className="mt-2 leading-7 text-[#333B69]">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}

                {quizSaveError && (
                  <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                    {quizSaveError}
                  </div>
                )}

                {!answerSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="mt-7 rounded-xl bg-gradient-to-r from-[#1237D5] via-[#4820B8] to-[#6416C8] px-7 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={isSavingQuiz}
                    className="mt-7 rounded-xl bg-gradient-to-r from-[#1237D5] to-[#6416C8] px-7 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSavingQuiz
                      ? "Saving Result..."
                      : currentQuestion === questions.length - 1
                        ? "See Result →"
                        : "Next Question →"}
                  </button>
                )}
              </>
            ) : (
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#F3F1FF] to-[#EFEBFF] p-8 text-center">
                <div className="text-5xl">🎉</div>

                <h3 className="mt-4 text-3xl font-extrabold text-[#3B0CA3]">
                  Quiz Completed!
                </h3>

                <p className="mt-5 text-2xl font-bold text-[#010737]">
                  Your Score: {finalScore} / {questions.length}
                </p>

                <p className="mt-3 text-[#333B69]">
                  {Math.round((finalScore / questions.length) * 100)}% - Keep learning and improving!
                </p>

                <p className="mt-4 text-sm font-semibold text-green-700">
                  {quizSaveMessage}
                </p>

                <button
                  onClick={restartQuiz}
                  className="mt-7 rounded-xl bg-gradient-to-r from-[#1237D5] to-[#6416C8] px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Generate Another Quiz ↻
                </button>
              </div>
            )
          )}
        </section>

        {/* MARK AS COMPLETED */}
        <section className="mt-8 rounded-2xl border border-[#DCD8FF] bg-white p-7 text-center shadow-sm">
          <h3 className="text-xl font-bold text-[#010737]">
            Finished Learning This Topic?
          </h3>

          <p className="mt-2 text-[#333B69]">
            Mark this topic as completed to track your progress.
          </p>

          <button
            onClick={onComplete}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#6840D9] to-[#3B0CA3] px-7 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            ✓ Mark as Completed
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-[#DCD8FF] bg-[#F3F1FF] px-6 py-8 text-center">
        <h2 className="bg-gradient-to-r from-[#1237D5] to-[#6416C8] bg-clip-text text-xl font-extrabold text-transparent">
          LearnCraft
        </h2>

        <p className="mt-2 text-sm text-[#333B69]">
          Learn Smarter. Prepare Better.
        </p>

        <p className="mt-4 text-xs text-[#333B69]/70">
          © 2026 LearnCraft | Personalized Learning System
        </p>
      </footer>
    </div>
  );
}

export default TopicPage;
