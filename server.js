const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

console.log("✅ API Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
console.log("🚀 Server running...");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/solve', async (req, res) => {
  const question = req.body.question;
  console.log("📩 Received question:", question);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    console.log("✅ AI Answer:", answer);
    res.json({ solution: answer });

  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
