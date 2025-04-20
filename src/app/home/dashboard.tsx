import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      {/* Left: Log section */}
      <div className="relative bg-black rounded-md overflow-hidden">
        <div className="h-full max-h-[600px] overflow-y-scroll p-4 space-y-3">
          {/* Replace with actual log items */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 text-white px-4 py-3 rounded-md text-sm"
            >
              🚚 Transaction #{i + 1}: Sample log entry
            </div>
          ))}
        </div>
        <span className="absolute bottom-4 left-4 text-white text-base font-medium">
          log
        </span>
      </div>

      {/* Right: Scoreboard & CTA */}
      <div className="flex flex-col justify-between h-full">
        <div className="bg-black text-white h-full rounded-md flex items-center justify-center text-center text-base font-medium p-4">
          Transparency Scoreboard
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button className="bg-black text-white px-6 py-2 text-sm rounded-md flex items-center gap-2">
            <Image src="/star.svg" alt="Star logo" width={20} height={20} />
            join the movement
          </button>
        </div>
      </div>
    </div>
  );
}
