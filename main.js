console.log("Firestore db instance:", db);
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chat = document.getElementById('chat-window');

// Event: Form Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('You', userMessage);
  input.value = '';
  input.disabled = true;

  const reply = await fetchKairoResponse(userMessage);
  appendMessage('Kairo', reply);
  input.disabled = false;
  input.focus();
});

// Add message to chat window
function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = `${sender}: ${message}`;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

// Fetch from Apps Script via proxy and log to Firestore
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

    // Firestore logging
    if (typeof db !== "undefined") {
  await db.collection("kairo_log")
    console.log("Logging to Firestore...", {
  user: "Ryan Wisnoski",
  message: message,
  response: data.reply,
  timestamp: new Date()
});
;
}};
    }

    return data.reply || "✅ Message submitted.";
  } catch (error) {
    console.error("❌ Network error or backend unreachable:", error);
    return "⚠️ Network error. Kairo is unreachable right now.";
  }
}
