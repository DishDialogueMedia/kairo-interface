// main.js
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

  const reply = await fetchKairoResponse(userMessage);
  appendMessage('Kairo', reply);
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

    // ✅ Log to Firestore
    if (window.kairoDB) {
      const { db, collection, addDoc } = window.kairoDB;
      await addDoc(collection(db, "kairo_log"), {
        user: "Ryan Wisnoski",
        message: message,
        response: data.reply,
        timestamp: new Date()
      });
      console.log("📝 Logged to Firestore");
    } else {
      console.warn("⚠️ Firestore not available.");
    }

    return data.reply || "✅ Message submitted.";
  } catch (error) {
    console.error("❌ Network error or backend unreachable:", error);
    return "⚠️ Network error. Kairo is unreachable right now.";
  }
}
