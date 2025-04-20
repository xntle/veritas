import Image from "next/image";
import dynamic from "next/dynamic";
import VeritasMap from "./mapbox";
import Dashboard from "./dashboard";
// const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white  p-6 sm:p-12">
      {/* Interactive Map */}
      <section className="mb-4">
        <VeritasMap />
      </section>
      <section>
        <Dashboard />
      </section>
    </div>
  );
}
