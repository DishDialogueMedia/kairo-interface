// api/processor.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

try {
  const raw = process.env.GOOGLE_CREDENTIALS;

  if (!raw) {
    console.error("❌ Missing GOOGLE_CREDENTIALS environment variable.");
    throw new Error("Missing GOOGLE_CREDENTIALS.");
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch (parseError) {
    console.error("❌ Failed to parse GOOGLE_CREDENTIALS:", parseError.message);
    throw parseError;
  }

  if (!serviceAccount.private_key || !serviceAccount.project_id) {
    console.error("❌ GOOGLE_CREDENTIALS is missing required fields.");
    throw new Error("Incomplete service account object.");
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("✅ Firebase initialized.");
  }

  db = getFirestore();

} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
}

// ✅ Request handler
export default async function handler(req, res) {
  if (!db) {
    return res.status(500).json({ error: "Firebase not initialized." });
  }

  try {
    const snapshot = await db.collection('task_queue').get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No pending tasks." });
    }

    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json({ message: "Tasks fetched.", tasks });

  } catch (error) {
    console.error("🔥 Handler error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
