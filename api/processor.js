import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ Firebase Initialization
let db;

try {
  const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  // 🔍 DEBUG: Check private key format
  console.log("🔐 Key preview:", serviceAccount.private_key.substring(0, 80));

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  db = getFirestore();
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// ✅ API Handler
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
    console.error("🔥 Handler error:", error);
    return res.status(500).json({ error: error.message });
  }
}
