"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AiInsight {
  company: string;
  description: string;
  colorCode: "red" | "green";
  explanation?: string;
}

export default function UserPanel() {
  const [insight, setInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch("/new_geo.geojson");
        const geojson = await res.json();
        const ai = await fetch("/cerebras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geojson.features),
        });
        const result = await ai.json();
        setInsight(result);
      } catch (error) {
        console.error("Failed to fetch AI insight", error);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="h-[46vh] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 w-full flex flex-col items-center text-center overflow-y-auto">
      {/* Company Info */}
      <Image
        src="/logos/pg.png"
        alt="Company Logo"
        width={80}
        height={80}
        className="mb-4"
      />
      <h3 className="text-xl font-bold mb-1">P&G</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Compliance Level: <span className="text-green-600">High</span>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Last Audit: 2025-04-15
      </p>
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
        Specializes in hazardous waste transportation with AI-monitored routing
        and QR-code traceability.
      </p>

      {/* AI Insight */}
      <div className="w-full mt-2">
        <h2 className="text-md font-bold mb-2">🧠 Live AI Insight</h2>
        {!insight ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fetching AI analysis...
          </p>
        ) : (
          <div>
            <p className="text-sm font-semibold mb-1">{insight.company}</p>
            <p
              className={`text-sm mb-1 ${
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
    </div>
  );
}
