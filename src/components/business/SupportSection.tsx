"use client";

/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

// Figma node 1:524 — "Support beyond installation." Eight 240×220 cards
// (p-30, 40px icon, 16px gap, title ABC Solar 20, body Poppins 16/1.5),
// 4-across with 40px column / 20px row gaps. The last card is the yellow
// "Customized AMC" card (title only). The Multi-site icon is composed in the
// design (blue rounded square + keypad glyph), mirrored here in CSS.
interface Program {
  icon: ReactNode;
  title: string;
  sub?: string;
  yellow?: boolean;
}

const icon = (src: string, className = "h-10 w-11") => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={src}
    alt=""
    aria-hidden
    className={cn("object-contain object-left", className)}
  />
);

const programs: Program[] = [
  {
    icon: icon("/business/support-wrench.svg"),
    title: "Preventive Maintenance Visits",
    sub: "Scheduled. Proactive. On your calendar.",
  },
  {
    icon: icon("/business/support-inspect.svg"),
    title: "Indoor & Outdoor Unit Inspection",
    sub: "Both sides, every time.",
  },
  {
    icon: icon("/business/support-spark.svg"),
    title: "Filter Cleaning & Servicing",
    sub: "Always clean. Always performing.",
  },
  {
    icon: icon("/business/support-snow.svg"),
    title: "Refrigerant Pressure Checks",
    sub: "Gas levels monitored across your fleet.",
  },
  {
    icon: icon("/business/support-spark.svg"),
    title: "Electrical & Safety Inspections",
    sub: "Peace of mind, built into every visit.",
  },
  {
    icon: icon("/business/support-alert.svg"),
    title: "Priority Support Covered Visits",
    sub: "When something needs attention, we're first on the line.",
  },
  {
    // Composed: 36px blue-bordered rounded square with the keypad glyph
    icon: (
      <span className="flex size-9 items-center justify-center rounded-[5px] border-[2.5px] border-[#3478F6]">
        {icon("/business/support-keypad.svg", "h-[14px] w-[22px]")}
      </span>
    ),
    title: "Multi-site Support Options",
    sub: "One programme across every location.",
  },
  {
    icon: icon("/business/support-gear.svg"),
    title: "Customized AMC for Commercial Deployments",
    yellow: true,
  },
];

export function SupportSection() {
  return (
    <section id="support" className="scroll-mt-28 bg-white py-14 md:py-[100px]">
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10">
        {/* Header */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="text-center"
        >
          <m.p
            variants={fadeUp}
            className="text-lg font-medium leading-[1.6] text-[#3478F6] md:text-[20px]"
          >
            Commercial Support &amp; AMC Programs
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-2 font-solar text-[32px] font-medium leading-[1.2] text-[#212121] sm:text-[40px] md:text-[48px]"
          >
            Support beyond installation.
          </m.h2>
          <m.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-[710px] text-sm leading-[1.6] text-[#6A6A6A] md:text-[16px]"
          >
            A commercial fleet needs more than a warranty. Optimist&apos;s AMC
            programme keeps every unit performing at its best &mdash; so your
            team never has to think about it.
          </m.p>
        </m.div>

        {/* Cards — Figma: 240×220, 4-across, 40px column gap, 20px row gap */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.06)}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:mt-14 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-5"
        >
          {programs.map((p) => (
            <m.div
              key={p.title}
              variants={fadeUp}
              className={cn(
                "flex min-h-[200px] flex-col gap-4 rounded-[24px] border border-[#E9E9E9] p-[30px] backdrop-blur-[12px] lg:min-h-[220px]",
                p.yellow ? "bg-[#FFFCDC]" : "bg-white",
              )}
            >
              <div className="flex h-10 items-center">{p.icon}</div>
              <div className="flex flex-col gap-2">
                <h3
                  className={cn(
                    "font-solar text-[20px] font-medium leading-[1.2] text-[#212121]",
                    !p.yellow && "lg:leading-none",
                  )}
                >
                  {p.title}
                </h3>
                {p.sub && (
                  <p className="text-[15px] leading-[1.5] text-[#6A6A6A] md:text-[16px]">
                    {p.sub}
                  </p>
                )}
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
