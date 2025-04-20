"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import type { FeatureCollection } from "geojson";
import Image from "next/image";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MapPanel() {
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

      // Outer ring
      context.beginPath();
      context.arc(center, center, outerRadius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 51, 51, ${1 - t})`;
      context.fill();

      // Inner circle
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

    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "top-left"
    );
    map.addControl(new NavigationControl(), "top-right");
    mapInstance.current = map;
    map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

    map.on("load", async () => {
      const response = await fetch(
        "/stretched_transaction_points_final.geojson"
      );
      const geojson: FeatureCollection = await response.json();

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
        layout: {
          visibility: "visible",
        },
      });

      const coordinates = geojson.features.map(
        (feature: any) => feature.geometry.coordinates
      );

      // Add source for line
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

      // Add line layer
      map.addLayer({
        id: "transaction-line-layer",
        type: "line",
        source: "transaction-line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0000", // blue
          "line-width": 3,
          "line-opacity": 0.8,
        },
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
      map.addLayer({
        id: "pulsing-point-layer",
        type: "symbol",
        source: "transaction-points",
        layout: {
          "icon-image": "pulsing-dot",
        },
        filter: ["==", ["get", "status"], "In Transit"], // 🔁 Optional: show only some
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[46vh]">
      {/* Bottom-left Veritas brand */}
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

      {/* Map container */}
      <div
        ref={mapContainer}
        className="absolute inset-0 z-0 rounded-xl overflow-hidden"
      />

      {/* Info card shown when point is selected */}
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
