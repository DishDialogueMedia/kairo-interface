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
  // Placeholder logic — will be replaced by real endpoint later
  return `[This is a simulated Kairo reply to: "${message}"]`;
}
