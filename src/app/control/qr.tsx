"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScannerPanel() {
  const [result, setResult] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const qrCodeRegionId = "qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            try {
              setResult(decodedText);
              scanner.stop().then(() => {
                scanner.clear();
                setScanning(false);
              });
            } catch (error) {
              console.error("Error processing QR code", error);
            }
          },
          (errorMessage) => {
            console.warn("QR code scan error", errorMessage);
          }
        )
        .catch((err) => {
          console.error("QR scanner failed to start", err);
        });

      return () => {
        scanner.stop().catch(() => {});
      };
    }
  }, [scanning]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4 text-center">
      <h2 className="text-xl font-bold mb-4">📷 QR Code Scanner</h2>
      {!scanning && (
        <button
          onClick={() => setScanning(true)}
          className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-full text-sm hover:opacity-80 transition"
        >
          Start Scan
        </button>
      )}

      {scanning && (
        <div className="mt-4">
          <div
            id={qrCodeRegionId}
            className="mx-auto w-full max-w-xs h-64 border rounded-md"
          />
          <button
            onClick={() => {
              scannerRef.current?.stop().then(() => {
                scannerRef.current?.clear();
                setScanning(false);
              });
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700"
          >
            Stop Scan
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 text-left max-h-64 overflow-auto p-2 bg-gray-100 rounded text-sm text-gray-800 dark:text-gray-200">
          <pre>{JSON.stringify(JSON.parse(result), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
