"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import type { FeatureCollection } from "geojson";
import Image from "next/image";
import Link from "next/link";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{
    company: string;
    status: string;
    description: string;
    transaction_id: string;
  } | null>(null);

  const [logs, setLogs] = useState([]);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/pg_shipments_10.geojson");
      const geojson = await res.json();
      const entries = geojson.features.map((f: any) => ({
        transaction_id: f.properties.transaction_id,
        company: f.properties.company,
        status: f.properties.status,
        description: f.properties.description,
      }));
      setLogs(entries);
    };

    const fetchInsight = async () => {
      try {
        const res = await fetch("/new_geo.geojson");
        const geojson = await res.json();
        const ai = await fetch("/cerebras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geojson.features),
        });
        const result = await ai.json();
        setInsight(result);
      } catch (err) {
        console.error("❌ AI Insight fetch error", err);
      }
    };

    fetchLogs();
    fetchInsight();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-93.5, 36],
      zoom: 5,
      projection: "globe",
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "top-left"
    );
    map.addControl(new NavigationControl(), "top-right");
    mapInstance.current = map;

    const pulsingDot = {
      width: 100,
      height: 100,
      data: new Uint8Array(100 * 100 * 4),
      onAdd() {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d")!;
      },
      render() {
        const context = this.context;
        const t = (performance.now() % 1000) / 1000;
        const radius = (this.width / 2) * 0.3;
        const outerRadius = (this.width / 2) * 0.7 * t + radius;
        const center = this.width / 2;
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(center, center, outerRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 51, 51, ${1 - t})`;
        context.fill();
        context.beginPath();
        context.arc(center, center, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 51, 51, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 2 * (1 - t);
        context.fill();
        context.stroke();
        this.data = context.getImageData(0, 0, this.width, this.height).data;
        map.triggerRepaint();
        return true;
      },
    };

    map.on("load", async () => {
      const res = await fetch("/pg_shipments_10.geojson");
      const geojson = await res.json();

      const points = geojson.features.filter(
        (f: any) => f.geometry.type === "Point"
      );
      points.sort((a, b) =>
        a.properties.transaction_id.localeCompare(b.properties.transaction_id)
      );

      const coordinates = points.map((f: any) => f.geometry.coordinates);

      map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

      map.addSource("transaction-points", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "transaction-point-layer",
        type: "circle",
        source: "transaction-points",
        paint: {
          "circle-radius": 10,
          "circle-color": "#ff3333",
          "circle-opacity": 0.5,
        },
      });

      map.addSource("transaction-line", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      });

      map.addLayer({
        id: "transaction-line-layer",
        type: "line",
        source: "transaction-line",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ff0000",
          "line-width": 3,
          "line-opacity": 0.8,
        },
      });

      map.addLayer({
        id: "pulsing-point-layer",
        type: "symbol",
        source: "transaction-points",
        layout: {
          "icon-image": "pulsing-dot",
        },
        filter: ["==", ["get", "status"], "In Transit"],
      });

      map.on("click", "transaction-point-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature?.properties) return;
        const { company, status, description, transaction_id } =
          feature.properties;
        setSelectedFeature({ company, status, description, transaction_id });
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-white dark:bg-black text-black dark:text-white font-[family-name:var(--font-geist-sans)] grid gap-4 grid-cols-1 sm:grid-cols-3 sm:grid-rows-1">
      {/* Left Column */}
      <div className="flex flex-col gap-4 sm:h-full">
        <div className="h-[46vh] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 w-full flex flex-col items-center text-center overflow-y-auto">
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
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
            Specializes in hazardous waste transportation with AI-monitored
            routing and QR-code traceability.
          </p>
          <div className="w-full mt-2">
            <h2 className="text-md font-bold mb-2">🧠 Live AI Insight</h2>
            {!insight ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You're doing good, nothing to worry here
              </p>
            ) : (
              <div>
                <p className="text-sm font-semibold mb-1">{insight.company}</p>
                <p
                  className={`text-sm mb-1 ${
                    insight.colorCode === "red"
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {insight.description}
                </p>
                {insight.explanation && (
                  <p className="text-xs italic text-gray-500">
                    {insight.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4">
          <h2 className="text-xl font-bold mb-4">Logbook</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-scroll pr-2">
            {logs.map((entry, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-neutral-800 rounded-md p-3 text-sm leading-snug border border-gray-200 dark:border-neutral-700"
              >
                <div className="font-semibold">{entry.company}</div>
                <div className="text-xs text-gray-500 mt-1">
                  TX ID: {entry.transaction_id}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {entry.description}
                </p>
                <span className="text-xs italic text-gray-400 mt-1 block">
                  Status: {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="sm:col-span-2 flex flex-col gap-4">
        <div className="overflow-hidden flex-1 relative">
          {/* Veritas branding */}
          <div className="absolute bottom-6 left-6 z-50 flex items-center">
            <Image
              className="dark:invert"
              src="/veritas.svg"
              alt="Veritas logo"
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 text-xl font-semibold tracking-tight">
              Veritas
            </span>
          </div>

          {/* Map container */}
          <div
            ref={mapContainer}
            className="absolute inset-0 z-0 rounded-xl overflow-hidden"
          />

          {selectedFeature && (
            <div className="absolute top-6 left-6 z-50 max-w-sm w-full border border-gray-200 p-4 rounded-lg shadow-md bg-white dark:bg-black">
              <h3 className="text-lg font-semibold">
                {selectedFeature.company}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedFeature.description}
              </p>
              <p className="text-xs mt-2 text-gray-500 italic">
                Status: {selectedFeature.status}
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Transaction ID: {selectedFeature.transaction_id}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/scan"
            className="rounded-full bg-blue-600 text-white px-6 py-2 text-sm sm:text-base font-medium shadow hover:bg-blue-700 transition"
          >
            Scan QR
          </Link>
          <Link
            href="/"
            className="rounded-full bg-red-500 text-white px-6 py-2 text-sm sm:text-base font-medium shadow hover:bg-red-600 transition"
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
}
