const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chat = document.getElementById('chat-window');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('You', userMessage);
  input.value = '';
  input.disabled = true;

  const response = await fetchKairoResponse(async function fetchKairoResponse(message) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Ryan Wisnoski",
        message: message
      })
    });

    const data = await response.json();

    // Log to Firestore
    await db.collection("kairo_log").add({
      user: "Ryan Wisnoski",
      message: message,
      response: data.reply,
      timestamp: new Date()
    });

    console.log("✅ Response from Apps Script:", data);
    return data.reply || "✅ Message submitted.";
  } catch (error) {
    console.error("❌ Network error or backend unreachable:", error);
    return "⚠️ Network error. Kairo is unreachable right now.";
  }
}
);
  appendMessage('Kairo', response);
  input.disabled = false;
  input.focus();
});

function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = `${sender}: ${message}`;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

async function fetchKairoResponse(message) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Ryan Wisnoski",
        message: message
      })
    });

    const data = await response.json();
    console.log("✅ Response from Kairo (via proxy):", data);
    return data.reply || "✅ Message submitted.";
  } catch (error) {
    console.error("❌ Proxy or network error:", error);
    return "⚠️ Network error. Kairo is unreachable right now.";
  }
}
