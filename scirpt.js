async function solveProblem() {
  console.log("Solve button clicked!"); // Confirm function runs

  const question = document.getElementById('questionInput').value.trim();
  console.log("Question:", question);

  if (!question) {
    alert("Please enter a question.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    console.log("Fetch response status:", response.status);
    const data = await response.json();
    console.log("Response JSON:", data);

    document.getElementById('solutionBox').classList.remove('hidden');
    document.getElementById('solutionText').textContent = data.answer || "No answer found";

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Error connecting to the server. Please try again.");
  }
}
