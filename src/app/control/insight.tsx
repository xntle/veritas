// components/InsightsPanel.tsx
"use client";
import { useEffect, useState } from "react";

interface AiInsight {
  company: string;
  description: string;
  colorCode: "red" | "green";
  explanation?: string;
}

export default function InsightsPanel() {
  const [insight, setInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const res = await fetch("/new_geo.geojson");
      const geojson = await res.json();
      const ai = await fetch("/cerebras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geojson.features),
      });
      const result = await ai.json();
      setInsight(result);
    };
    fetchInsight();
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 h-1/2 shadow-sm p-4 text-center">
      <h2 className="text-xl font-bold mb-4">🧠 Live AI Insight</h2>
      {!insight ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Fetching AI analysis...
        </p>
      ) : (
        <div>
          <p className="text-lg font-semibold mb-1">{insight.company}</p>
          <p
            className={`mb-2 ${
              insight.colorCode === "red" ? "text-red-500" : "text-green-600"
            }`}
          >
            {insight.description}
          </p>
          {insight.explanation && (
            <p className="text-xs italic text-gray-500">
              {insight.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
