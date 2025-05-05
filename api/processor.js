// processor.js — Updated to use 'task_queue' collection

const admin = require("firebase-admin");

// Parse service account from environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  try {
    const queueRef = db.collection("task_queue");
    const snapshot = await queueRef.where("status", "==", "pending").limit(1).get();

    if (snapshot.empty) {
      console.log("🟡 No pending tasks found.");
      return res.status(200).json({ message: "No tasks to process" });
    }

    const taskDoc = snapshot.docs[0];
    const taskData = taskDoc.data();

    console.log("🔄 Starting task:", taskData);

    // Step 1: Mark as in_progress
    await taskDoc.ref.update({
      status: "in_progress",
      startedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Step 2: Simulate processing (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Mark as done
    await taskDoc.ref.update({
      status: "done",
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ Task completed:", taskData);
    return res.status(200).json({ message: "Task processed", task: taskData });

  } catch (error) {
    console.error("❌ Error processing task:", error);
    return res.status(500).json({ error: error.message });
  }
};
