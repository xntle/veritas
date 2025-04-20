// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendRes = await fetch(
      "http://127.0.0.1:8888/api/companies/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await backendRes.text();

    try {
      const json = JSON.parse(text);
      return res.status(backendRes.status).json(json);
    } catch {
      return res
        .status(backendRes.status)
        .json({ error: "Invalid JSON", raw: text });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to connect to backend", details: String(err) });
  }
}
