// api/processor.js

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmLHI1qAd-FAAGG3pzNvc4MgWDC7pozGU",
  authDomain: "dish-dialogue-kairo-f54e2.firebaseapp.com",
  projectId: "dish-dialogue-kairo-f54e2",
  storageBucket: "dish-dialogue-kairo-f54e2.firebasestorage.app",
  messagingSenderId: "733841485241",
  appId: "1:733841485241:web:292aee1cd489cd67729a68"
};

// 🧠 Simple simulated processor (replace with real logic)
function generateResponse(input) {
  return `[Simulated Kairo response to: "${input}"]`;
}

export default async function handler(req, res) {
  try {
    // ✅ Initialize Firebase only once
    if (getApps().length === 0) initializeApp(firebaseConfig);
    const db = getFirestore();

    // 🔍 Get all pending tasks
    const q = query(collection(db, "kairo_log"), where("status", "==", "pending"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(200).json({ message: "No pending tasks." });
    }

    let processed = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const input = data.message || "(no message)";
      const result = generateResponse(input);

      await updateDoc(doc(db, "kairo_log", docSnap.id), {
        response: result,
        result,
        status: "complete",
        completedAt: Timestamp.now()
      });

      processed++;
    }

    res.status(200).json({ message: `✅ Processed ${processed} task(s).` });
  } catch (error) {
    console.error("❌ Processor error:", error);
    res.status(500).json({ error: "Processor failed", detail: error.message });
  }
}
