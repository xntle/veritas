export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.warn("❌ Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📨 Forwarding request to Python backend:", req.body);

    const backendRes = await fetch(
      "http://127.0.0.1:8888/api/companies/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const text = await backendRes.text();

    console.log("✅ Response from backend:");
    console.log("📦 Status:", backendRes.status);
    console.log("📦 Body:", text);

    // Try parsing JSON
    try {
      const data = JSON.parse(text);
      return res.status(backendRes.status).json(data);
    } catch (jsonErr) {
      console.warn("⚠️ Could not parse backend response as JSON.");
      return res.status(backendRes.status).json({
        error: "Non-JSON response from backend",
        raw: text,
      });
    }
  } catch (err) {
    console.error("🔥 Failed to connect to backend:", err);
    return res.status(500).json({ error: "Failed to connect to backend" });
  }
}
