"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const scannerId = "qr-reader";
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [message, setMessage] = useState<string>("");

  const handleScan = async (text: string) => {
    try {
      const parsed = JSON.parse(text);
      setScannedData(parsed);
      setMessage("Sending data to blockchain...");

      const token = localStorage.getItem("veritas_token");
      if (!token) {
        setMessage("❌ No auth token found in localStorage.");
        return;
      }

      const {
        materialId,
        description,
        metadata,
        location,
        destination,
        newHolder,
      } = parsed;

      if (!materialId || !location || !destination || !newHolder) {
        setMessage("❌ Missing required fields in QR JSON.");
        return;
      }

      // 1. Register material
      const registerRes = await fetch("/api/materials/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          materialId,
          description,
          metadata,
          location: {
            type: "Point",
            coordinates: location,
          },
        }),
      });
      // 2. Transfer material
      const transferRes = await fetch("/api/materials/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          materialId,
          newHolder,
          from: { type: "Point", coordinates: location },
          to: { type: "Point", coordinates: destination },
          description: `Departed ${location.join(
            ", "
          )} en route to ${destination.join(", ")}`,
        }),
      });
      if (!transferRes.ok) {
        const errorText = await transferRes.text();
        setMessage("❌ Transfer failed: " + errorText);
        return;
      }

      setMessage("✅ Material registered and transferred successfully!");
    } catch (err: any) {
      console.error("Invalid QR JSON or request error:", err);
      setScannedData({ error: "Invalid QR content", raw: text });
      setMessage("❌ Invalid JSON or API request error.");
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (typeof window === "undefined" || !navigator?.mediaDevices) return;

        const html5QrCode = new Html5Qrcode(scannerId);
        qrRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) return;

        await html5QrCode.start(
          cameras[0].id,
          {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.0,
            disableFlip: true,
          },
          (decodedText) => {
            handleScan(decodedText);
            html5QrCode.stop().catch(console.error);
          },
          (error) => {
            console.warn("Scan error:", error);
          }
        );
      } catch (err) {
        console.error("Scanner failed:", err);
      }
    };

    const delay = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      clearTimeout(delay);
      qrRef.current?.stop().catch(console.error);
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Scan QR Code</h1>
      <div
        id={scannerId}
        className="w-full max-w-md mx-auto rounded shadow-md"
      />

      {message && (
        <div className="text-sm font-medium text-center text-gray-600 dark:text-gray-400">
          {message}
        </div>
      )}

      {scannedData && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Scanned Transfer</h2>
          <pre className="text-sm text-gray-800 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(scannedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
