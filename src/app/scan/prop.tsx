"use client";

import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type QRScannerProps = {
  onScanSuccess: (decodedText: string) => void;
};

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const scannerId = "qr-reader";
  const qrRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (typeof window === "undefined" || !navigator?.mediaDevices) {
          console.error("Not in a browser or camera not supported");
          return;
        }

        const html5QrCode = new Html5Qrcode(scannerId);
        qrRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) {
          console.error("No cameras found.");
          return;
        }

        await html5QrCode.start(
          cameras[0].id,
          {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.0,
            disableFlip: true,
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            html5QrCode.stop().catch(console.error);
          },
          (errorMessage) => {
            if (errorMessage.toLowerCase().includes("stitch")) {
              console.warn("Stitch error: retrying...");
            } else {
              console.warn("Scan error:", errorMessage);
            }
          }
        );
      } catch (err) {
        console.error("Scanner initialization failed:", err);
      }
    };

    const delay = setTimeout(startScanner, 500);

    return () => {
      clearTimeout(delay);
      qrRef.current?.stop().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
    <div id={scannerId} className="w-full max-w-md mx-auto rounded-md shadow" />
  );
};

export default QRScanner;
