"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import type { FeatureCollection } from "geojson";
import Image from "next/image";
import Link from "next/link";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface LogEntry {
  transaction_id: string;
  company: string;
  status: string;
  description: string;
}

interface AiInsight {
  colorCode: "red" | "green";
  company: string;
  description: string;
  explanation?: string;
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{
    company: string;
    status: string;
    description: string;
    transaction_id: string;
  } | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [insight, setInsight] = useState<AiInsight | null>(null);

  const pulsingDot = {
    width: 100,
    height: 100,
    data: new Uint8Array(100 * 100 * 4),
    onAdd: function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d")!;
    },
    render: function () {
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
      mapInstance.current!.triggerRepaint();
      return true;
    },
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/logs");
      const data = await res.json();
      setLogs(data);
    };

    const fetchAiInsight = async () => {
      const response = await fetch("/new_geo.geojson");
      const geojson = await response.json();
      const cerebrasResponse = await fetch("/cerebras", {
        method: "POST",
        body: JSON.stringify(geojson.features),
        headers: { "Content-Type": "application/json" },
      });
      const aiResult = await cerebrasResponse.json();
      setInsight(aiResult);
    };

    fetchLogs();
    fetchAiInsight();
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
    map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

    map.on("load", async () => {
      const response = await fetch("/eco_transfer_partners_50.geojson");
      const geojson: FeatureCollection = await response.json();

      map.addSource("transaction-points", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "transaction-point-layer",
        type: "circle",
        source: "transaction-points",
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-radius": 8,
          "circle-color": "#ff3333",
          "circle-opacity": 0.6,
        },
      });

      map.addLayer({
        id: "transaction-line-layer",
        type: "line",
        source: "transaction-points",
        filter: ["==", "$type", "LineString"],
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3B82F6",
          "line-width": 4,
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

      map.on("mouseenter", "transaction-point-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "transaction-point-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("click", "transaction-point-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature || !feature.properties) return;

        const { company, status, description, transaction_id } =
          feature.properties;
        setSelectedFeature({ company, status, description, transaction_id });
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white p-6 sm:p-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
      {/* Map & Logs */}
      <div className="flex flex-col gap-6">
        {/* Map */}
        <div className="relative w-full h-[80vh] rounded-lg border border-gray-200">
          <div className="absolute bottom-6 left-6 z-50 flex items-center">
            <Image
              className="dark:invert"
              src="/veritas.svg"
              alt="Veritas logo"
              width={40}
              height={40}
            />
            <span className="ml-2 text-xl font-semibold tracking-tight">
              Veritas
            </span>
          </div>
          <div
            ref={mapContainer}
            className="absolute inset-0 z-0 rounded-lg overflow-hidden"
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

        {/* Logbook */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold mb-2">Veritas Logbook</h2>
          <p className="mb-4 text-gray-600">
            Here display all the waste activities across the globe
          </p>
          <div className="overflow-y-scroll max-h-[40vh] space-y-4 pr-2">
            {logs.map((entry, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 text-sm leading-snug border border-gray-200 dark:border-neutral-700"
              >
                <div className="font-semibold text-black dark:text-white">
                  {entry.company}
                </div>
                <div className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                  TX ID: {entry.transaction_id}
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {entry.description}
                </p>
                <span className="text-xs mt-1 block italic text-gray-500 dark:text-gray-400">
                  Status: {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="flex flex-col justify-between">
        <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700 h-full">
          <h3 className="text-xl font-semibold mb-2">Live AI Analysis</h3>
          {!insight ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyzing current geolocation data...
            </p>
          ) : (
            <div className="text-sm mt-2">
              <p className="text-lg font-semibold mb-1">{insight.company}</p>
              <p
                className={`mb-2 ${
                  insight.colorCode === "red"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {insight.description}
              </p>
              <p className="text-xs text-gray-500 italic">
                {insight.explanation}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-4">
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
