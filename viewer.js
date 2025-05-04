const firebaseConfig = {
  apiKey: "AIzaSyDmLHI1qAd-FAAGG3pzNvc4MgWDC7pozGU",
  authDomain: "dish-dialogue-kairo-f54e2.firebaseapp.com",
  projectId: "dish-dialogue-kairo-f54e2",
  storageBucket: "dish-dialogue-kairo-f54e2.firebasestorage.app",
  messagingSenderId: "733841485241",
  appId: "1:733841485241:web:292aee1cd489cd67729a68"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const logBody = document.getElementById("log-body");

db.collection("kairo_log")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    logBody.innerHTML = "";
    snapshot.forEach(doc => {
      const log = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${log.timestamp?.toDate().toLocaleString() || ""}</td>
        <td>${log.user || ""}</td>
        <td>${log.message || ""}</td>
        <td>${log.response || ""}</td>
        <td>${log.status || "unknown"}</td>
      `;
      logBody.appendChild(row);
    });
  });
