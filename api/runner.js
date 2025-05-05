// api/runner.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

try {
  const raw = process.env.GOOGLE_CREDENTIALS;

  if (!raw) throw new Error("Missing GOOGLE_CREDENTIALS.");

  const serviceAccount = JSON.parse(raw);

  if (!serviceAccount.private_key || !serviceAccount.project_id) {
    throw new Error("Incomplete service account object.");
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("✅ Firebase initialized in runner");
  }

  db = getFirestore();

} catch (error) {
  console.error("❌ Firebase initialization failed in runner:", error.message);
}

export default async function handler(req, res) {
  if (!db) {
    return res.status(500).json({ error: "Firebase not initialized." });
  }

  try {
    const snapshot = await db.collection('task_queue')
      .where('status', '==', 'pending')
      .limit(10)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No tasks to process." });
    }

    const updates = [];

    for (const doc of snapshot.docs) {
      const task = doc.data();
      const taskRef = db.collection('task_queue').doc(doc.id);

      try {
        await taskRef.update({ status: 'processing', started_at: new Date() });

        // ✅ Replace this logic with your actual task behavior
        console.log(`🔧 Processing task ${doc.id}...`);
        await new Promise(r => setTimeout(r, 1000)); // Simulated task delay

        await taskRef.update({ status: 'completed', completed_at: new Date() });
        updates.push({ id: doc.id, status: 'completed' });

      } catch (taskError) {
        console.error(`❌ Error processing task ${doc.id}:`, taskError.message);
        await taskRef.update({
          status: 'error',
          error_message: taskError.message,
          failed_at: new Date()
        });
        updates.push({ id: doc.id, status: 'error' });
      }
    }

    return res.status(200).json({ message: "Processed tasks.", results: updates });

  } catch (error) {
    console.error("🔥 Runner error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
