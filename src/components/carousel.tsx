"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";

const partners = [
  { name: "Chevron", logo: "/logos/chevron.jpeg" },
  { name: "Coca-Cola", logo: "/logos/cocacola.jpeg" },
  { name: "Tyson Foods", logo: "/logos/tysonfoods.png" },
  { name: "Nestlé", logo: "/logos/nestle.png" },
  { name: "Michelin", logo: "/logos/michelin.png" },
  { name: "Unilever", logo: "/logos/unilever.png" },
  { name: "PepsiCo", logo: "/logos/pepsico.png" },
  { name: "P&G", logo: "/logos/pg.png" },
  { name: "Dow", logo: "/logos/dow.png" },
  { name: "3M", logo: "/logos/3m.png" },
  { name: "General Mills", logo: "/logos/generalmills.png" },
  { name: "Danone", logo: "/logos/danone.jpeg" },
];

export default function PartnerMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let offset = 0;
    let animationFrame: number;

    const scroll = () => {
      offset -= 1;
      container.style.transform = `translateX(${offset}px)`;

      if (Math.abs(offset) >= container.scrollWidth / 2) {
        offset = 0;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="overflow-hidden w-full py-10 bg-white dark:bg-black">
      <h2 className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
        Join transparency
      </h2>
      <div className="relative w-full h-16">
        <div
          ref={containerRef}
          className="flex gap-10 whitespace-nowrap will-change-transform"
        >
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-36 h-fixed shrink-0"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                objectFit="contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
