// src/app/api/cerebras/route.ts
import { NextRequest, NextResponse } from "next/server";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const geojson = await req.json(); // geojson.features

    const completion = await cerebras.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a geolocation data analysis assistant. For each GeoJSON node, return:

{
  "company": "Company Name",
  "description": "Short summary of the status.",
  "colorCode": "green" or "red",
  "explanation": "reason for status"
}

Use red for off-route, stalled, idle, deviation, unknown. Use green for smooth delivery or good transit.`,
        },
        {
          role: "user",
          content: JSON.stringify(geojson, null, 2),
        },
      ],
      model: "llama-4-scout-17b-16e-instruct",
      stream: false,
      max_completion_tokens: 2048,
      temperature: 0.2,
      top_p: 1,
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(aiResponse);
  } catch (err) {
    console.error("Cerebras API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze with Cerebras." },
      { status: 500 }
    );
  }
}
