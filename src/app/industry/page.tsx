import Image from "next/image";
import Carousel from "../../components/carousel";

export default function Industry() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)] bg-white text-black dark:bg-black dark:text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left max-w-2xl">
        <Image
          className="dark:invert"
          src="/veritas.svg"
          alt="Veritas logo"
          width={80}
          height={80}
          priority
        />

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight ">
          Make Your Waste Management Public
        </h1>

        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <strong>Veritas</strong> helps you manage hazardous waste with{" "}
          <strong>accuracy</strong>, <strong>accountability</strong>, and{" "}
          <strong>transparency</strong>. Stay compliant, earn trust, and lead
          with data.
        </p>

        <section className="w-full">
          <h2 className="text-lg font-semibold mb-4 ">Why It Matters</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 border border-gray-200 rounded-md dark:bg-gray-800">
              <h3 className="font-semibold mb-1">1. Better Brand Trust</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>74% of consumers prefer transparent brands</li>
                <li>80% trust companies that share real sustainability data</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-md dark:bg-gray-800">
              <h3 className="font-semibold mb-1">
                2. Lower Legal & Cleanup Risk
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Avoid fines and lawsuits</li>
                <li>
                  Prevent billion-dollar settlements (e.g. 3M’s $10.3B PFAS
                  case)
                </li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-md dark:bg-gray-800">
              <h3 className="font-semibold mb-1">
                3. Because the Planet Is Dying
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>158M Americans exposed to PFAS-contaminated water</li>
                <li>199M tons of plastic in oceans</li>
                <li>
                  35M tons of hazardous waste generated in the U.S. annually
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Carousel />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-medium text-sm sm:text-base h-12 px-6"
            href="/login"
          >
            Let’s Put You On The Map
          </a>
          <a
            className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 font-medium text-sm sm:text-base h-12 px-6"
            href="/how"
          >
            🔎 See How It Works
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-4 flex-wrap items-center justify-center text-xs text-gray-600 dark:text-gray-400 mt-10">
        <a className="flex items-center gap-2 hover:underline" href="/about">
          <Image src="/file.svg" alt="File icon" width={14} height={14} />
          About
        </a>
        <a className="flex items-center gap-2 hover:underline" href="/features">
          <Image src="/window.svg" alt="Window icon" width={14} height={14} />
          Features
        </a>
        <a className="flex items-center gap-2 hover:underline" href="/industry">
          <Image src="/globe.svg" alt="Globe icon" width={14} height={14} />
          View public data →
        </a>
      </footer>
    </div>
  );
}
