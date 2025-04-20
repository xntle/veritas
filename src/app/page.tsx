import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center mt-[-20] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-black dark:bg-black dark:text-white">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start text-center sm:text-left max-w-3xl">
        <Image
          className="dark:invert"
          src="/veritas.svg"
          alt="Veritas logo"
          width={100}
          height={100}
          priority
        />

        <h1 className="text-3xl sm:text-5xl mt-[-2] font-bold tracking-tight">
          Industrial Waste Audits are broken!
        </h1>
        <p className="text-base sm:text-lg mt-[-2] text-gray-700 dark:text-gray-300">
          <strong>Veritas</strong> reveals how companies manage hazardous waste.
          Our AI and blockchain-backed tools help industries stay{" "}
          <strong>compliant</strong> and
          <strong> transparent</strong>, helping people stay informed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-medium text-sm sm:text-base h-12 px-6"
            href="/home"
          >
            Start Viewing
          </a>
          <a
            className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 font-medium text-sm sm:text-base h-12 px-6"
            href="/how"
          >
            See How It Works
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <a className="flex items-center gap-2 hover:underline" href="/about">
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          About
        </a>
        <a className="flex items-center gap-2 hover:underline" href="/features">
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Features
        </a>
        <a
          className="flex items-center gap-2 hover:underline"
          href="/industry"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Join the movement (for companies) →
        </a>
      </footer>
    </div>
  );
}
