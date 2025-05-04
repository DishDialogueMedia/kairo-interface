// api/processor.js

import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// 🧠 Simulated processor logic
function generateResponse(input) {
  return `[Simulated Kairo response to: "${input}"]`;
}

export default async function handler(req, res) {
  try {
    const snapshot = await db
      .collection("kairo_log")
      .where("status", "==", "pending")
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No pending tasks." });
    }

    let processed = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const input = data.message || "(no message)";
      const result = generateResponse(input);

      await doc.ref.update({
        response: result,
        result,
        status: "complete",
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      processed++;
    }

    return res.status(200).json({
      message: `✅ Successfully processed ${processed} task(s).`
    });
  } catch (error) {
    console.error("❌ Processor failed:", error);
    return res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}
