const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/solve', async (req, res) => {
  const question = req.body.question;
  console.log("📩 Received question:", question);

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    // 👇 Prompt Gemini to do multiple things
    const prompt = `
You're an AI tutor. A student asked: "${question}"

1. Solve the problem.
2. If it is a math problem, explain the core concept in 2-3 lines.
3. Then, generate 3 practice problems of varying difficulty (easy, medium, hard) related to the same concept.

Format your response as JSON like:
{
  "solution": "...",
  "concept": "...",
  "examples": [
    { "difficulty": "Easy", "question": "..." },
    { "difficulty": "Medium", "question": "..." },
    { "difficulty": "Hard", "question": "..." }
  ]
}
If it's not a math question, just respond with: { "solution": "..." }
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // ⚠️ Try parsing as JSON (Gemini sometimes returns Markdown)
    let clean = text.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/```json|```/g, '').trim();
    }

    const parsed = JSON.parse(clean);
    res.json(parsed);

  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Key: Loaded`);
  console.log(`🚀 Server running...`);
  console.log(`🚀 Listening on port ${PORT}`);
});
