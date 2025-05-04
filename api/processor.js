import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  // 🔍 DEBUG: Log key prefix to verify formatting
  console.log("🔐 Key preview:", serviceAccount.private_key.substring(0, 80));

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const db = getFirestore();

  export default async function handler(req, res) {
    try {
      const snapshot = await db.collection('task_queue').get();

      if (snapshot.empty) {
        return res.status(200).json({ message: "No pending tasks." });
      }

      const tasks = [];
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() });
      });

      // Processed tasks
      return res.status(200).json({ message: "Tasks fetched.", tasks });
    } catch (error) {
      console.error("🔥 Handler error:", error);
      return res.status(500).json({ error: error.message });
    }
  };

} catch (error) {
  console.error("❌ Firebase Init Error:", error);
  // Still export the handler to avoid deploy crash
  export default function handler(req, res) {
    return res.status(500).json({ error: "Firebase initialization failed." });
  }
}
