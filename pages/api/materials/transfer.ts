// pages/api/materials/transfer.ts
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.authorization?.replace("Bearer ", "");
  const { materialId, ...transferData } = req.body;

  try {
    const backendRes = await fetch(
      `http://127.0.0.1:8888/api/materials/${materialId}/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transferData),
      }
    );

    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during transfer.");
  }
}
