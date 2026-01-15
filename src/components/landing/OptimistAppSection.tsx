"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// Gauge icon component
function GaugeIcon() {
  return (
    <div className="w-[100px] h-[100px] bg-[#111111] rounded-[24px] flex items-center justify-center flex-shrink-0">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
        {/* Gauge Arc */}
        <div className="relative w-16 h-10 mb-1 flex items-center justify-center">
          <svg
            width="64"
            height="32"
            viewBox="0 0 64 32"
            fill="none"
            className="absolute top-0"
          >
            <path
              d="M 4 28 A 28 28 0 0 1 60 28"
              stroke="#222222"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 4 28 A 28 28 0 0 1 42 5"
              stroke="#3B82F6"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-white text-[14px] font-bold mt-3">24°C</span>
        </div>
        {/* Three Icons below */}
        <div className="flex gap-2 mt-2">
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Bar chart icon for bills feature
function BillsIcon() {
  return (
    <div className="w-[100px] h-[100px] bg-[#111111] rounded-[24px] flex items-center justify-center flex-shrink-0">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
        {/* Bar Chart */}
        <div className="flex items-end gap-1.5 h-10 mb-2">
          <div className="w-2 h-4 bg-[#222222] rounded-full" />
          <div className="w-2 h-8 bg-[#222222] rounded-full" />
          <div className="w-2 h-6 bg-[#222222] rounded-full" />
          <div className="w-2 h-10 bg-[#222222] rounded-full" />
          <div className="w-2 h-5 bg-[#222222] rounded-full" />
          <div className="w-2 h-12 bg-[#10B981] rounded-full" />
        </div>
        {/* Three Icons below */}
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  iconType = "gauge",
  iconPosition = "left",
}: {
  title: string;
  description: string;
  iconType?: "gauge" | "bills";
  iconPosition?: "left" | "right";
}) {
  return (
    <div
      className={`feature-card bg-white/95 backdrop-blur-md rounded-[32px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center gap-6 min-w-[380px] border border-white/20 ${
        iconPosition === "right" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Icon Box */}
      <div className="flex-shrink-0">
        {iconType === "bills" ? <BillsIcon /> : <GaugeIcon />}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[22px] font-bold text-gray-900 leading-tight mb-1 tracking-tight">
          {title}
        </h4>
        <p className="text-[16px] text-gray-400 leading-snug font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}

export function OptimistAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0
      );

      tl.fromTo(
        phoneRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
        0.2
      );

      const cards = featuresRef.current?.querySelectorAll(".feature-card");
      if (cards) {
        tl.fromTo(
          cards,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
          0.4
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-24 overflow-hidden relative"
    >
      {/* Background Arcs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1000px] opacity-40"
          viewBox="0 0 1600 1000"
          fill="none"
        >
          <ellipse
            cx="800"
            cy="500"
            rx="750"
            ry="450"
            stroke="#94BAFF"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <ellipse
            cx="800"
            cy="500"
            rx="600"
            ry="360"
            stroke="#94BAFF"
            strokeWidth="1"
            opacity="0.2"
          />
          <ellipse
            cx="800"
            cy="500"
            rx="450"
            ry="270"
            stroke="#94BAFF"
            strokeWidth="1"
            strokeDasharray="8 8"
            opacity="0.2"
          />
          {/* Glowing gradients */}
          <defs>
            <radialGradient
              id="bg-glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(800 500) rotate(90) scale(400 600)"
            >
              <stop stopColor="#94BAFF" stopOpacity="0.2" />
              <stop offset="1" stopColor="#94BAFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="1000" fill="url(#bg-glow)" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="font-display text-[64px] font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            Optimist App
          </h2>
          <p className="text-2xl text-gray-400 font-medium">
            Your full-control panel, right in your hand.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative h-[900px]">
          <div ref={featuresRef} className="absolute inset-0">
            {/* Top Left */}
            <div className="absolute z-20" style={{ top: "8%", left: "5%" }}>
              <FeatureCard
                title="Live Energy Meter"
                description="Track. Predict. Save."
                iconType="gauge"
                iconPosition="left"
              />
            </div>

            {/* Top Right */}
            <div className="absolute z-20" style={{ top: "8%", right: "5%" }}>
              <FeatureCard
                title="Gas Level Indicator"
                description="Know before it's an issue."
                iconType="gauge"
                iconPosition="right"
              />
            </div>

            {/* Middle Left */}
            <div className="absolute z-20" style={{ top: "42%", left: "0%" }}>
              <FeatureCard
                title="Projected Monthly Bills"
                description="No surprises. Just real numbers."
                iconType="bills"
                iconPosition="left"
              />
            </div>

            {/* Middle Right */}
            <div className="absolute z-20" style={{ top: "42%", right: "0%" }}>
              <FeatureCard
                title="Intelligence Service Assistance"
                description="Diagnose remotely. Service seamlessly"
                iconType="gauge"
                iconPosition="right"
              />
            </div>

            {/* Bottom Left */}
            <div
              className="absolute z-20"
              style={{ bottom: "10%", left: "10%" }}
            >
              <FeatureCard
                title="Filter Health"
                description="Clean when needed. No more guessing."
                iconType="gauge"
                iconPosition="left"
              />
            </div>

            {/* Bottom Right */}
            <div
              className="absolute z-20"
              style={{ bottom: "10%", right: "10%" }}
            >
              <FeatureCard
                title="Scheduling"
                description="Start or stop automatically, on your time."
                iconType="gauge"
                iconPosition="right"
              />
            </div>
          </div>

          {/* Center Phone */}
          <div
            ref={phoneRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[48%] z-30 pointer-events-none"
          >
            <div className="relative w-[540px]">
              <Image
                src="/Hand.png"
                alt="Optimist App"
                width={540}
                height={880}
                className="w-full h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                priority
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div ref={phoneRef} className="flex justify-center mb-12">
            <div className="relative w-[300px]">
              <Image
                src="/Hand.png"
                alt="Optimist App"
                width={300}
                height={480}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {mobileFeatures.map((f) => (
              <FeatureCard
                key={f.id}
                title={f.title}
                description={f.description}
                iconType={f.iconType}
                iconPosition="left"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const mobileFeatures = [
  {
    id: 1,
    title: "Live Energy Meter",
    description: "Track. Predict. Save.",
    iconType: "gauge" as const,
  },
  {
    id: 2,
    title: "Gas Level Indicator",
    description: "Know before it's an issue.",
    iconType: "gauge" as const,
  },
  {
    id: 3,
    title: "Projected Monthly Bills",
    description: "No surprises. Just real numbers.",
    iconType: "bills" as const,
  },
  {
    id: 4,
    title: "Intelligence Service Assistance",
    description: "Diagnose remotely. Service seamlessly",
    iconType: "gauge" as const,
  },
  {
    id: 5,
    title: "Filter Health",
    description: "Clean when needed. No more guessing.",
    iconType: "gauge" as const,
  },
  {
    id: 6,
    title: "Scheduling",
    description: "Start or stop automatically, on your time.",
    iconType: "gauge" as const,
  },
];
