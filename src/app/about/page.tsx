import Image from "next/image";

export default function About() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-black dark:bg-black dark:text-white">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start text-center sm:text-left max-w-3xl">
        <Image
          className="dark:invert"
          src="/veritas.svg"
          alt="Veritas logo"
          width={100}
          height={100}
          priority
        />

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          About Veritas
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
          Veritas is a blockchain-powered platform designed to tackle hazardous
          waste mismanagement at scale. From cradle-to-grave tracking to ESG
          reporting, we make waste visible — and verifiable.
        </p>

        <section className="space-y-8 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Accountability for 35M Tons of Waste
            </h2>
            <p>
              The U.S. generates over <strong>35 million tons</strong> of
              hazardous waste annually. Despite regulations, over 1,300
              Superfund sites still pose a threat. Veritas uses blockchain to
              log each event across the waste lifecycle — creating a real-time,
              tamper-proof chain of custody that protects public health.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">
              Addressing PFAS and Plastic Pollution
            </h2>
            <p>
              PFAS, found in 45% of tap water, and plastics, which often leak
              into ecosystems, demand better oversight. With QR-based
              traceability, Veritas ensures these pollutants are tracked,
              validated, and disposed of properly — preventing contamination
              before it starts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">
              Real-Time, Immutable Oversight
            </h2>
            <p>
              Unlike error-prone paper audits, Veritas provides a digital
              passport for waste. Real-time alerts flag any route deviation, and
              stakeholders — from companies to regulators — can access live,
              immutable records to ensure compliance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Real ROI & ESG Value</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                3M’s $10.3B PFAS settlement underscores the cost of
                non-compliance.
              </li>
              <li>
                Blockchain tracking reduces fines, streamlines ops, and improves
                brand trust.
              </li>
              <li>
                Boost ESG scores and gain favorable insurance or investment
                terms.
              </li>
            </ul>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-medium text-sm sm:text-base h-12 px-6"
            href="/how"
          >
            See How It Works
          </a>
          <a
            className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 font-medium text-sm sm:text-base h-12 px-6"
            href="/industry"
          >
            Join the Platform
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <a className="flex items-center gap-2 hover:underline" href="/how">
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
