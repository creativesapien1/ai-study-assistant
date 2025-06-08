const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

console.log("✅ API Key:", process.env.OPENROUTER_API_KEY ? "Loaded" : "Missing");
console.log("🚀 Server running...");

app.post('/solve', async (req, res) => {
  const question = req.body.question;
  console.log("📩 Received question:", question);

  try {
    console.log("🔐 Sending request with key:", process.env.OPENROUTER_API_KEY); // For debugging in Render

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://creativesapien1.github.io',
    'X-Title': 'AI Study Assistant'
  },
  body: JSON.stringify({
    model: 'openai/gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful AI tutor. Explain clearly and step-by-step.' },
      { role: 'user', content: question }
    ]
  })
});

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenRouter error:", data);
      return res.status(500).json({ error: 'AI service error' });
    }

    const aiAnswer = data.choices[0].message.content;
    console.log("✅ AI Answer:", aiAnswer);

    res.json({ solution: aiAnswer });

  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
