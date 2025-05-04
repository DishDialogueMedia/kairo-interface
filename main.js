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

  const response = await fetchKairoResponse(userMessage);
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
    const response = await fetch("https://script.google.com/macros/s/AKfycbw4vrALR03cyIx_78GT8HubKPa6QZP0stk-zo4xvoSkTrs8uK16hk45wccazB-28pp9/exec", {
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
    console.log("✅ Response from Apps Script:", data);
    return data.reply || "✅ Message submitted.";
  } catch (error) {
    console.error("❌ Network error or backend unreachable:", error);
    return "⚠️ Network error. Kairo is unreachable right now.";
  }
}
