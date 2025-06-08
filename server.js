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
    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" }); // ✅ correct path with "models/"
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    res.json({ solution: text });
  } catch (error) {
    console.error("❌ Gemini error:", error);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Key: Loaded`);
  console.log(`🚀 Server running...`);
  console.log(`🚀 Listening on port ${PORT}`);
});
