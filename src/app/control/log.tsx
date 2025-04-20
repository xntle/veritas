// components/LogPanel.tsx
"use client";
import { useEffect, useState } from "react";

interface LogEntry {
  transaction_id: string;
  company: string;
  status: string;
  description: string;
}

export default function LogPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/stretched_transaction_points_final.geojson");
      const geojson = await res.json();
      const entries = geojson.features.map((f: any) => ({
        transaction_id: f.properties.transaction_id,
        company: f.properties.company,
        status: f.properties.status,
        description: f.properties.description,
      }));
      setLogs(entries);
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4">
      <h2 className="text-xl font-bold mb-4">📜 Veritas Logbook</h2>
      <div className="space-y-3 max-h-[300px] overflow-y-scroll pr-2">
        {logs.map((entry, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-neutral-800 rounded-md p-3 text-sm leading-snug border border-gray-200 dark:border-neutral-700"
          >
            <div className="font-semibold">{entry.company}</div>
            <div className="text-xs text-gray-500 mt-1">
              TX ID: {entry.transaction_id}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {entry.description}
            </p>
            <span className="text-xs italic text-gray-400 mt-1 block">
              Status: {entry.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
