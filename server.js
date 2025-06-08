app.post('/solve', async (req, res) => {
  const question = req.body.question;
  console.log("📩 Received question:", question);

  // 👇 Add this line to check if API key is being read correctly
  console.log("🔑 Sending API Key:", process.env.OPENROUTER_API_KEY);  // DEBUG LOG

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
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
