
import { useState } from "react";
import { apiRequest } from "../utils/api";

function AIQuizGenerator() {
  const [subject, setSubject] = useState("DBMS");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async (event) => {
    event.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuestions([]);
      setAnswers({});
      setQuizSubmitted(false);

      const data = await apiRequest("/ai/generate-quiz", {
        method: "POST",
        body: JSON.stringify({
          subject,
          topic: topic.trim(),
          difficulty,
          numberOfQuestions: Number(numberOfQuestions),
        }),
      });

      if (!data.success || !Array.isArray(data.quiz?.questions)) {
        throw new Error("Unable to generate quiz.");
      }

      setQuestions(data.quiz.questions);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: selectedOption,
    }));
  };

  const calculateScore = () => {
    return questions.filter(
      (question, index) =>
        answers[index] === question.correctAnswer
    ).length;
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError("");
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setQuizSubmitted(false);
    setError("");
    setTopic("");
  };

  return (
    <div className="min-h-screen bg-[#F3F1FF] px-4 py-8 md:px-10">

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            ✨ Powered by Groq AI
          </div>

          <h1 className="text-3xl font-bold text-[#181E56] md:text-4xl">
            AI Quiz Generator
          </h1>

          <p className="mt-3 text-gray-600">
            Generate personalized quizzes and test your knowledge.
          </p>
        </div>

        {/* Quiz Form */}
        {questions.length === 0 && (
          <form
            onSubmit={generateQuiz}
            className="rounded-2xl bg-white p-6 shadow-lg md:p-8"
          >
            <h2 className="mb-6 text-xl font-bold text-[#181E56]">
              Create Your Quiz
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Subject */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Select Subject
                </label>

                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500"
                >
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Web Technology">Web Technology</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Enter Topic
                </label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Normalization"
                  className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Difficulty Level
                </label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Number of Questions
                </label>

                <select
                  value={numberOfQuestions}
                  onChange={(e) =>
                    setNumberOfQuestions(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#6840D9] to-[#849CFF] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating Quiz..." : "✨ Generate AI Quiz"}
            </button>
          </form>
        )}

        {/* Generated Questions */}
        {questions.length > 0 && (
          <div className="space-y-5">

            <div className="rounded-xl bg-white p-5 shadow">
              <h2 className="text-xl font-bold text-[#181E56]">
                {subject} - {topic}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {difficulty} Level · {questions.length} Questions
              </p>
            </div>

            {questions.map((question, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 shadow"
              >
                <h3 className="mb-5 font-semibold text-[#181E56]">
                  Q{index + 1}. {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[index] === option;

                    const isCorrect =
                      quizSubmitted &&
                      option === question.correctAnswer;

                    const isWrong =
                      quizSubmitted &&
                      isSelected &&
                      !isCorrect;

                    return (
                      <button
                        type="button"
                        key={optionIndex}
                        disabled={quizSubmitted}
                        onClick={() => handleAnswer(index, option)}
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          isCorrect
                            ? "border-green-500 bg-green-50"
                            : isWrong
                            ? "border-red-500 bg-red-50"
                            : isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-400"
                        }`}
                      >
                        <span className="mr-2 font-semibold">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-5 rounded-lg bg-purple-50 p-4">
                    <p className="font-semibold text-purple-800">
                      Correct Answer: {question.correctAnswer}
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-red-600">
                {error}
              </p>
            )}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmit}
                className="w-full rounded-xl bg-[#6840D9] py-3 font-semibold text-white hover:bg-[#5630C0]"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="rounded-2xl bg-white p-7 text-center shadow-lg">
                <h2 className="text-2xl font-bold text-[#181E56]">
                  Quiz Completed!
                </h2>

                <p className="mt-4 text-4xl font-bold text-purple-600">
                  {calculateScore()} / {questions.length}
                </p>

                <p className="mt-2 text-gray-600">
                  Your Score:{" "}
                  {Math.round(
                    (calculateScore() / questions.length) * 100
                  )}%
                </p>

                <button
                  onClick={resetQuiz}
                  className="mt-6 rounded-xl bg-[#6840D9] px-8 py-3 font-semibold text-white hover:bg-[#5630C0]"
                >
                  Generate Another Quiz
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AIQuizGenerator;
