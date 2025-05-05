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

    console.log("🔄 Starting task:", taskData);

    await taskDoc.ref.update({
      status: "in_progress",
      startedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

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