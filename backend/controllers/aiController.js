
/* global require, process, module */

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// GENERATE AI QUIZ
// ==========================================

const generateAIQuiz = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty = "Medium",
      numberOfQuestions = 5,
    } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof topic !== "string" ||
      !topic.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and topic are required.",
      });
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level.",
      });
    }

    if (
      !Number.isInteger(numberOfQuestions) ||
      numberOfQuestions < 1 ||
      numberOfQuestions > 15
    ) {
      return res.status(400).json({
        success: false,
        message: "Choose between 1 and 15 questions.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are an expert educational quiz generator.

Generate accurate multiple-choice questions.

Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Exact correct option",
      "explanation": "Simple explanation"
    }
  ]
}

Rules:
1. Generate exactly the requested number of questions.
2. Every question must have exactly four options.
3. Only one option must be correct.
4. correctAnswer must exactly match one option.
5. Write explanations in simple English.
6. Do not include markdown or text outside JSON.`,
        },
        {
          role: "user",
          content: `Generate exactly ${numberOfQuestions} ${difficulty} difficulty MCQ questions for the subject "${subject}" and topic "${topic}". Use simple English.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 5000,
      response_format: {
        type: "json_object",
      },
    });

    const aiResponse =
      completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Groq returned an empty response.");
    }

    const quizData = JSON.parse(aiResponse);

    if (
      !Array.isArray(quizData.questions) ||
      quizData.questions.length !== numberOfQuestions
    ) {
      throw new Error("AI generated an invalid number of questions.");
    }

    for (const question of quizData.questions) {
      if (
        typeof question.question !== "string" ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.options.every(
          (option) => typeof option === "string"
        ) ||
        typeof question.correctAnswer !== "string" ||
        !question.options.includes(question.correctAnswer) ||
        typeof question.explanation !== "string"
      ) {
        throw new Error("AI generated an invalid question format.");
      }
    }

    return res.status(200).json({
      success: true,
      message: "AI Quiz generated successfully!",
      quiz: quizData,
    });

  } catch (error) {
    console.error("AI Quiz Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate quiz. Please try again.",
    });
  }
};


// ==========================================
// GENERATE AI STUDY LESSON
// ==========================================

const generateAILesson = async (req, res) => {
  try {
    const { subject, topic } = req.body;

    // Validate subject and topic
    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof topic !== "string" ||
      !topic.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and topic are required.",
      });
    }

    // Generate complete learning material
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `You are LearnCraft, an expert AI teacher.

Your job is to teach students a selected academic topic from beginner level to exam-ready level.

Teach in simple, clear English. Assume the student is learning the topic for the first time.

Return ONLY valid JSON in this exact structure:

{
  "title": "Topic title",
  "introduction": "Detailed introduction in simple English",
  "whyImportant": "Why this topic is important",
  "learningObjectives": [
    "Learning objective 1",
    "Learning objective 2"
  ],
  "sections": [
    {
      "heading": "Concept heading",
      "explanation": "Detailed explanation of this concept",
      "example": "A clear practical example",
      "code": "Optional code or query example. Use an empty string if not needed.",
      "codeExplanation": "Explain the code line by line. Use an empty string if not needed."
    }
  ],
  "realWorldExample": "Explain where this topic is used in real applications and companies.",
  "importantPoints": [
    "Important point 1",
    "Important point 2"
  ],
  "examQuestions": [
    "Important exam question 1",
    "Important exam question 2"
  ],
  "summary": [
    "Summary point 1",
    "Summary point 2"
  ]
}

Teaching rules:

1. Start from basic concepts and gradually move to advanced concepts.
2. Explain every important concept in detail, not just one-line definitions.
3. Include at least 5 meaningful learning sections.
4. Use practical examples wherever possible.
5. For SQL topics, include correct SQL queries and explain them.
6. For Relational Algebra, explain symbols, operations, expressions and solved examples.
7. If a topic contains multiple related concepts, teach each concept separately.
8. Explain technical terms in simple English.
9. Include useful exam and interview points.
10. Do not invent facts or incorrect syntax.
11. Keep all content relevant to the selected topic.
12. Do not generate quiz questions here. Quiz is a separate feature.
13. Return valid JSON only. Do not include Markdown outside JSON.`,
        },

        {
          role: "user",
          content: `Teach me the complete topic "${topic}" from the subject "${subject}".

I am a beginner MCA student. Explain the topic step by step in simple English with detailed definitions, concepts, practical examples, solved examples, and relevant code or SQL queries.

Make the lesson useful for university exams and technical interviews.`,
        },
      ],

      temperature: 0.4,
      max_tokens: 7000,

      response_format: {
        type: "json_object",
      },
    });

    const aiResponse =
      completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Groq returned an empty lesson.");
    }

    const lessonData = JSON.parse(aiResponse);

    // Validate lesson structure
    if (
      typeof lessonData.title !== "string" ||
      typeof lessonData.introduction !== "string" ||
      typeof lessonData.whyImportant !== "string" ||
      !Array.isArray(lessonData.learningObjectives) ||
      !Array.isArray(lessonData.sections) ||
      lessonData.sections.length < 1 ||
      typeof lessonData.realWorldExample !== "string" ||
      !Array.isArray(lessonData.importantPoints) ||
      !Array.isArray(lessonData.examQuestions) ||
      !Array.isArray(lessonData.summary)
    ) {
      throw new Error("AI generated an invalid lesson structure.");
    }

    // Validate each learning section
    for (const section of lessonData.sections) {
      if (
        typeof section.heading !== "string" ||
        typeof section.explanation !== "string" ||
        typeof section.example !== "string" ||
        typeof section.code !== "string" ||
        typeof section.codeExplanation !== "string"
      ) {
        throw new Error("AI generated an invalid lesson section.");
      }
    }

    return res.status(200).json({
      success: true,
      message: "Study lesson generated successfully!",
      lesson: lessonData,
    });

  } catch (error) {
    console.error("AI Lesson Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate study lesson. Please try again.",
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  generateAIQuiz,
  generateAILesson,
};
