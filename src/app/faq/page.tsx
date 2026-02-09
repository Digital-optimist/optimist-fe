"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export default function FAQPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-[calc(100vh-5rem)] pt-24 md:pt-28 lg:pt-32 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div ref={contentRef} className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
          <HelpCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900  mb-4">
          FAQ
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
          Frequently asked questions about our products and services.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}
