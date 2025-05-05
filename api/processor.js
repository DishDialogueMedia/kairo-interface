import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

try {
  // Rebuild service account object from separate Vercel environment variables
  const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  };

  // Validate critical fields
  if (!serviceAccount.private_key || !serviceAccount.project_id) {
    throw new Error("❌ Missing required Firebase credential fields.");
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("✅ Firebase initialized");
  }

  db = getFirestore();

} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
}

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
