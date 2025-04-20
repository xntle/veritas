"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LogEntry {
  transaction_id: string;
  company: string;
  status: string;
  description: string;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/stretched_transaction_points_final.geojson");
      const geojson = await res.json();

      const entries = geojson.features.map((feature: any) => ({
        transaction_id: feature.properties.transaction_id,
        company: feature.properties.company,
        status: feature.properties.status,
        description: feature.properties.description,
      }));

      setLogs(entries);
    };

    fetchLogs();
  }, []);

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 bg-white dark:bg-black text-black dark:text-white  py-12 font-[family-name:var(--font-geist-sans)]">
      {/* Log Panel */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 flex flex-col border border-gray-200 dark:border-neutral-700 w-full">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">
          Veritas Logbook
        </h2>
        <p className="mb-4 text-gray-600">
          Here display all the waste activities accross the globe
        </p>
        <div className="overflow-y-scroll max-h-[75vh] space-y-4 pr-2">
          {logs.map((entry, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 text-sm leading-snug border border-gray-200 dark:border-neutral-700"
            >
              <div className="font-semibold text-black dark:text-white">
                {entry.company}
              </div>
              <div className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                TX ID: {entry.transaction_id}
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {entry.description}
              </p>
              <span className="text-xs mt-1 block italic text-gray-500 dark:text-gray-400">
                Status: {entry.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scoreboard + CTA */}
      <div className="flex flex-col justify-between w-full">
        <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-full text-center border border-gray-200 dark:border-neutral-700">
          <h3 className="text-xl font-semibold mb-2">
            Transparency Scoreboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time accountability rankings
          </p>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-sm rounded-full flex items-center gap-2 border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-neutral-900 transition">
            <Image
              src="/veritas.svg"
              alt="Veritas logo"
              width={20}
              height={20}
            />
            Join the Movement
          </button>
        </div>
      </div>
    </div>
  );
}
