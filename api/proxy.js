// File: api/proxy.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwI6rll4UFHDKN_QO2TNnUWdtEq_cVyUaJY9U_u0FsRJx4cnAncV43wHMBExrwVSzho/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy Error:", err);
    return res.status(500).json({ error: "Proxy failed." });
  }
}
