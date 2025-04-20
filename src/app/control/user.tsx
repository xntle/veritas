// components/UserPanel.tsx
"use client";

import Image from "next/image";

export default function UserPanel() {
  return (
    <div className="h-[46vh] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 w-full h-100 flex flex-col items-center text-center">
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
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        Specializes in hazardous waste transportation with AI-monitored routing
        and QR-code traceability.
      </p>
    </div>
  );
}
