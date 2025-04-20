import Image from "next/image";
import dynamic from "next/dynamic";
import VeritasMap from "./mapbox";
import Dashboard from "./dashboard";
// const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-[family-name:var(--font-geist-sans)] p-6 sm:p-12">
      {/* Interactive Map */}
      <section>
        <div className="flex flex-row justify-center items-center ">
          <Image
            className="dark:invert"
            src="/veritas.svg"
            alt="Veritas logo"
            width={100}
            height={100}
            priority
          />

          <h1 className="text-3xl sm:text-5xl mt-[-2] font-bold tracking-tight">
            Veritas
          </h1>
        </div>
      </section>
      <section className="mb-16">
        <VeritasMap />
      </section>
      <section>
        <Dashboard />
      </section>
    </div>
  );
}
