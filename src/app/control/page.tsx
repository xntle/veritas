"use client";

import MapPanel from "./map";
import LogPanel from "./log";
import InsightsPanel from "./insight";
import QRScannerPanel from "./qr";
import UserPanel from "./user";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full p-4 sm:p-6 bg-white dark:bg-black text-black dark:text-white font-[family-name:var(--font-geist-sans)] grid gap-4
      grid-cols-1
      sm:grid-cols-3
      sm:grid-rows-1"
    >
      {/* Left Column (1/3 width on desktop) */}
      <div className="flex flex-col gap-4 sm:h-full">
        <div className="flex-1 overflow-hidden">
          <UserPanel />
        </div>
        <div className="flex-1 overflow-hidden">
          <InsightsPanel />
        </div>
        <div>
          <button>Log Out</button>
        </div>
      </div>

      {/* Right Column (2/3 width on desktop) */}
      <div className="sm:col-span-2 flex flex-col gap-4 sm:h-full">
        <div className="overflow-hidden flex-1">
          <MapPanel />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div className="overflow-hidden">
            <LogPanel />
          </div>
          <div className="overflow-hidden">
            <QRScannerPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
