import { QrCode, Brain, Blocks, LayoutDashboard, History } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PartnerMarquee from "@/components/carousel";

export default function How() {
  const steps = [
    {
      title: "Waste Logged via QR",
      description:
        "Each waste event is logged instantly by scanning a Veritas-generated QR code at the point of disposal, pickup, or handling. This captures metadata like time, location, material type, and handler.",
      Icon: QrCode,
    },
    {
      title: "AI Validates the Record",
      description:
        "Veritas AI cross-checks the data for errors, missing values, or unusual entries. It flags issues and offers suggestions for material classification or next steps.",
      Icon: Brain,
    },
    {
      title: "Blockchain Entry Created",
      description:
        "Once validated, the log is hashed and stored on the blockchain for tamper-proof verification. This guarantees transparency and builds trust.",
      Icon: Blocks,
    },
    {
      title: "Public Dashboard Updated",
      description:
        "The record appears in real time on the Veritas map, company profile, and live waste feed — making transparency visible to all.",
      Icon: LayoutDashboard,
    },
    {
      title: "Full Audit Trail Accessible",
      description:
        "Each company’s logs build a permanent history, exportable for compliance or ESG reporting. Public scores reflect real-time transparency.",
      Icon: History,
    },
  ];

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
          How Veritas Works
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
          Veritas transforms waste accountability into a seamless, secure, and
          transparent process — one QR scan at a time.
        </p>

        <section className="space-y-8 w-full">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="min-w-[48px] ">
                <step.Icon size={36} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-medium text-sm sm:text-base h-12 px-6"
            href="/"
          >
            ← Back
          </Link>
          <Link
            className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 font-medium text-sm sm:text-base h-12 px-6"
            href="/home"
          >
            View Public Logs
          </Link>
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
