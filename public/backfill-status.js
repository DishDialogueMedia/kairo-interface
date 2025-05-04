// backfill-status.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmLHI1qAd-FAAGG3pzNvc4MgWDC7pozGU",
  authDomain: "dish-dialogue-kairo-f54e2.firebaseapp.com",
  projectId: "dish-dialogue-kairo-f54e2",
  storageBucket: "dish-dialogue-kairo-f54e2.firebasestorage.app",
  messagingSenderId: "733841485241",
  appId: "1:733841485241:web:292aee1cd489cd67729a68"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function backfillStatus() {
  const logsRef = collection(db, "kairo_log");
  const snapshot = await getDocs(logsRef);
  let updatedCount = 0;

  for (const log of snapshot.docs) {
    const data = log.data();

    // Only update if status field is missing or "unknown"
    if (!data.status || data.status === "unknown") {
      await updateDoc(doc(db, "kairo_log", log.id), {
        status: "complete"
      });
      console.log(`✅ Updated log ${log.id}`);
      updatedCount++;
    }
  }

  console.log(`🎉 Backfill complete. ${updatedCount} log(s) updated.`);
}

backfillStatus();
