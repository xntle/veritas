// pages/api/logs.ts
export default async function handler(req, res) {
  try {
    const backendRes = await fetch("http://127.0.0.1:8888/api/transfers/log");
    const data = await backendRes.json();

    const formatted = data.map((item: any) => ({
      transaction_id: item.transactionId,
      company: item.company || "P&G",
      status: item.status || "Delivered",
      description: item.description || "200lb of trash reach California",
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
}
