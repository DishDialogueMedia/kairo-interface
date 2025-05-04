import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  try {
    const tasksRef = db.collection("kairo_tasks");
    const snapshot = await tasksRef.where("status", "==", "pending").get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No pending tasks." });
    }

    let processedCount = 0;

    for (const doc of snapshot.docs) {
      const task = doc.data();
      const taskId = doc.id;

      // Simulated processing logic
      console.log(`🛠️ Processing task: ${taskId} →`, task);

      // Update status to complete
      await tasksRef.doc(taskId).update({
        status: "complete",
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      processedCount++;
    }

    return res.status(200).json({ message: `✅ Processed ${processedCount} task(s).` });

  } catch (error) {
    console.error("❌ Processor error:", error);
    return res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}
