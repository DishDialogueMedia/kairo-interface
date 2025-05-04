import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmLHI1qAd-FAAGG3pzNvc4MgWDC7pozGU",
  authDomain: "dish-dialogue-kairo-f54e2.firebaseapp.com",
  projectId: "dish-dialogue-kairo-f54e2",
  storageBucket: "dish-dialogue-kairo-f54e2.appspot.com",
  messagingSenderId: "733841485241",
  appId: "1:733841485241:web:292aee1cd489cd67729a68"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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

    await addDoc(collection(db, "kairo_log"), {
      user: "Ryan Wisnoski",
      message: message,
      response: data.reply,
      timestamp: new Date()
    });

    console.log("📝 Logged to Firestore:", data);
    return data.reply || "✅ Message submitted.";
  } catch (error) {
    console.error("❌ Network error:", error);
    return "⚠️ Kairo is unreachable.";
  }
}
