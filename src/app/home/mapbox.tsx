"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import type { FeatureCollection } from "geojson";
import Image from "next/image";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function VeritasMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{
    company: string;
    status: string;
    description: string;
    transaction_id: string;
  } | null>(null);

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
    if (!mapContainer.current || mapInstance.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-93.5, 36],
      zoom: 5,
      projection: "globe",
      attributionControl: false,
    });
    let dashOffset = 0;

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

      // 🔴 Points layer
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

      // 🔵 Line layer
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

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[85vh] rounded-lg border border-gray-200">
      <div className="flex flex-row items-center absolute bottom-6 left-6 z-50">
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

      <div
        ref={mapContainer}
        className="absolute inset-0 z-0 rounded-lg overflow-hidden"
      />

      {selectedFeature && (
        <div className="absolute top-6 left-6 z-50 max-w-sm w-full border border-gray-200 p-4 rounded-lg shadow-md bg-white dark:bg-black">
          <h3 className="text-lg font-semibold">{selectedFeature.company}</h3>
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
  );
}
