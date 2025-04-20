import { NextApiRequest, NextApiResponse } from "next";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY!,
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const features = req.body;

  const prompt = `You are a highly intelligent environmental compliance assistant.

Given a list of geolocation nodes in GeoJSON format representing waste shipments and routes, perform a comprehensive analysis of the entire dataset.

Respond with a **detailed natural language report** (not JSON) that includes:
- 🚩 Suspicious or off-route activities
- 💤 Stalled or idle shipments
- 🏭 High-risk companies
- 🧭 Patterns or anomalies in movement
- 💡 Suggestions for improving delivery efficiency

Present your findings as a readable, professional report. Do not return JSON.`;

  try {
    const stream = await cerebras.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: JSON.stringify(features, null, 2) },
      ],
      model: "llama-4-scout-17b-16e-instruct",
      stream: true,
      max_completion_tokens: 2048,
      temperature: 0.2,
      top_p: 1,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "");
    }

    res.end();
  } catch (error) {
    console.error("Cerebras AI error:", error);
    res.status(500).json({ error: "Failed to generate AI insight." });
  }
}
