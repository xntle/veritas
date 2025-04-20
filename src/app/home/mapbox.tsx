"use client";

import { useEffect, useRef } from "react";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";

// Transaction data with info
const transactionData = [
  {
    from: {
      name: "Dow Chemical Plant",
      coordinates: [-94.6405, 29.3702],
    },
    to: {
      name: "CleanHarbors Logistics",
      coordinates: [-95.3698, 29.7604],
    },
    status: "Delivered",
    note: "300lb plastic barrel transported safely",
  },
  {
    from: {
      name: "CleanHarbors Logistics",
      coordinates: [-95.3698, 29.7604],
    },
    to: {
      name: "EPA Regional Lab",
      coordinates: [-90.1994, 38.627],
    },
    status: "In Transit",
    note: "Hazardous container en route to EPA Lab",
  },
  {
    from: {
      name: "EPA Regional Lab",
      coordinates: [-90.1994, 38.627],
    },
    to: {
      name: "Veolia Disposal Facility",
      coordinates: [-88.9331, 40.6331],
    },
    status: "Awaiting Processing",
    note: "Sludge awaiting chemical breakdown",
  },
];

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function VeritasMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const addedLayers = useRef<Set<string>>(new Set());

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

    map.on("load", () => {
      const allFeatures = transactionData.flatMap(
        ({ from, to, status, note }, index) => [
          {
            type: "Feature",
            properties: {
              name: from.name,
              status,
              description: `#${index + 1} - ${note} at ${from.name}`,
            },
            geometry: {
              type: "Point",
              coordinates: from.coordinates,
            },
          },
          {
            type: "Feature",
            properties: {
              name: to.name,
              status,
              description: `#${index + 1} - ${note} received at ${to.name}`,
            },
            geometry: {
              type: "Point",
              coordinates: to.coordinates,
            },
          },
        ]
      );

      // Add points as a single layer
      map.addSource("transaction-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: allFeatures,
        },
      });

      map.addLayer({
        id: "transaction-point-layer",
        type: "circle",
        source: "transaction-points",
        paint: {
          "circle-radius": 8,
          "circle-color": "#2e759d",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Add popup on hover
      let popup: mapboxgl.Popup | null = null;

      map.on("mouseenter", "transaction-point-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "transaction-point-layer", () => {
        map.getCanvas().style.cursor = "";
        if (popup) popup.remove();
        popup = null;
      });

      map.on("mousemove", "transaction-point-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature || !feature.properties) return;

        const { name, description } = feature.properties;
        const coordinates = (feature.geometry as any).coordinates;

        if (popup) popup.remove();

        popup = new mapboxgl.Popup({ closeButton: false })
          .setLngLat(coordinates)
          .setHTML(`<strong>${name}</strong><br/><span>${description}</span>`)
          .addTo(map);
      });

      // Add transaction lines
      transactionData.forEach(({ from, to }, index) => {
        const sourceId = `line-${index}`;
        const lineId = `line-${index}-layer`;

        if (!addedLayers.current.has(lineId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [from.coordinates, to.coordinates],
              },
              properties: {},
            },
          });

          map.addLayer({
            id: lineId,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#2e759d",
              "line-width": 4,
              "line-opacity": 0.8,
            },
          });

          addedLayers.current.add(lineId);
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[90vh] rounded-lg border border-gray-200"
    />
  );
}
