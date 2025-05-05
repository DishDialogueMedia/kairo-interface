// main.js — Writes tasks to Firestore 'task_queue' and logs success

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  // 🔁 Replace with your actual Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "dish-dialogue-kairo-f54e2",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("submit-button").addEventListener("click", async () => {
  const taskInput = document.getElementById("task-input").value.trim();

  if (!taskInput) {
    alert("Please enter a task.");
    return;
  }

  const taskData = {
    id: taskInput,
    type: "test-trigger",
    description: `Manual task to verify processor function`,
    status: "pending",
    created_at: serverTimestamp(),
    details: {
      initiated_by: "manual",
      purpose: "test"
    }
  };

  try {
    await addDoc(collection(db, "task_queue"), taskData);
    console.log("✅ Task submitted:", taskData);
    alert(`✅ Task "${taskInput}" submitted to Firestore`);
  } catch (error) {
    console.error("❌ Error writing task:", error);
    alert("❌ Failed to submit task. See console for details.");
  }
});
