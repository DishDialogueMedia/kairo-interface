// processor.js — Firestore update fully verified version

const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

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
    const taskId = taskDoc.id;

    console.log("🔄 Starting task:", taskData);

    // Step 1: Mark as in_progress
    await taskDoc.ref.update({
      status: "in_progress",
      startedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Mark as done
    await taskDoc.ref.update({
      status: "done",
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ Task completed:", taskData);
    return res.status(200).json({
      message: "Task processed",
      taskId: taskId,
      original: taskData
    });

  } catch (error) {
    console.error("❌ Error processing task:", error);
    return res.status(500).json({ error: error.message });
  }
};
