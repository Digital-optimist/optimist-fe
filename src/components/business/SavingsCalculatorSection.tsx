"use client";

import { useMemo, useState } from "react";
import { m } from "framer-motion";
import { IndianRupee, Target } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { Slider } from "./Slider";

// ---------------------------------------------------------------------------
// PLACEHOLDER economics model, CALIBRATED TO THE FIGMA MOCK: at the design's
// default inputs (Hotel/Resort · 15 units · 12 hrs · ₹8) it reproduces the
// mock's headline numbers exactly — 6,593 units/yr, ₹1,51,840/yr, ₹7.6 lacs
// (5 yr) and 33.2 T CO₂. The mock's numbers are not mutually consistent
// (₹1,51,840 ≠ 6,593 units × ₹8), so each metric carries its own coefficient.
// Swap this block for the real savings formula when the business model lands.
const DAYS_PER_YEAR = 365;
const SAVED_UNITS_PER_AC_HOUR = 0.10035; // → 6,593 units/yr at defaults
const MONEY_UNITS_PER_AC_HOUR = 13 / 45; // → ₹1,51,840/yr at defaults
const CO2_KG_PER_SAVED_UNIT = 1.0071; // → 33.2 T over 5 yr at defaults
const YEARS = 5;

// Duty multipliers are relative to Hotel/Resort (the design's selected chip,
// calibration base = 1). Placeholder values pending the real model.
const SPACE_TYPES = [
  { id: "hotel", label: "Hotel/Resort", duty: 1.0 },
  { id: "office", label: "Office Space", duty: 0.9 },
  { id: "education", label: "Education Facility", duty: 0.7 },
  { id: "healthcare", label: "Healthcare Building", duty: 1.2 },
] as const;

type SpaceId = (typeof SPACE_TYPES)[number]["id"];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
// Headline figure — "₹7.6 lacs", stepping up to crores for large fleets.
const inrBig = (n: number) =>
  n >= 1e7
    ? `₹${(n / 1e7).toFixed(2)} Cr`
    : n >= 1e5
      ? `₹${(n / 1e5).toFixed(1)} lacs`
      : inr(n);

// Question label + value box row shared by the three slider groups.
// Figma: question ABC Solar Medium 20px; box h-40 rounded-8 #E9E9E9 border,
// number Poppins SemiBold 20px #3478F6, unit Poppins SemiBold 12px #4D4D4D.
function SliderHeader({
  question,
  value,
  unit,
}: {
  question: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="font-solar text-[18px] font-medium leading-[1.1] text-[#212121] md:text-[20px] md:leading-none">
        {question}
      </p>
      <div className="flex h-10 shrink-0 items-center rounded-[8px] border border-[#E9E9E9] bg-white px-3">
        <span className="flex items-baseline gap-1">
          <span className="text-[20px] font-semibold leading-none text-[#3478F6]">
            {value}
          </span>
          <span className="text-[12px] font-semibold leading-none text-[#4D4D4D]">
            {unit}
          </span>
        </span>
      </div>
    </div>
  );
}

export function SavingsCalculatorSection() {
  const [space, setSpace] = useState<SpaceId>("hotel");
  const [units, setUnits] = useState(15);
  const [hours, setHours] = useState(12);
  const [tariff, setTariff] = useState(8);

  const result = useMemo(() => {
    const duty = SPACE_TYPES.find((s) => s.id === space)?.duty ?? 1;
    const acHours = units * hours * DAYS_PER_YEAR * duty;
    const savedUnits = acHours * SAVED_UNITS_PER_AC_HOUR;
    const oneYear = acHours * MONEY_UNITS_PER_AC_HOUR * tariff;
    return {
      savedUnits: Math.round(savedUnits),
      oneYear,
      fiveYear: oneYear * YEARS,
      co2T: (savedUnits * YEARS * CO2_KG_PER_SAVED_UNIT) / 1000,
    };
  }, [space, units, hours, tariff]);

  const unitsLabel = result.savedUnits.toLocaleString("en-IN");
  const co2Label = result.co2T.toFixed(1);

  return (
    <section
      id="savings-calculator"
      className="scroll-mt-28 bg-white py-14 md:py-[100px]"
    >
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
            Air conditioning is often one of the largest consumers of electricity
            in a building
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-3 font-solar text-[32px] font-medium leading-[1.2] text-[#212121] sm:text-[40px] md:mt-4 md:text-[48px]"
          >
            How much could your building save?
          </m.h2>
          <m.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-[640px] text-sm leading-[1.6] text-[#6A6A6A] md:text-[16px]"
          >
            Tell us about your space and we&apos;ll show you exactly what
            Optimist could save you &mdash; in units, in rupees, in CO&#8322;.
          </m.p>
        </m.div>

        {/* Card — Figma 1080×626: rounded 24, #E9E9E9 border, 50px padding,
            553px inputs · 50px gap · 377px results panel */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 rounded-[24px] border border-[#E9E9E9] bg-white p-6 sm:p-8 md:mt-12 lg:p-[50px]"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-[50px]">
            {/* Left — inputs (Figma column gap 40px) */}
            <div className="flex flex-1 flex-col gap-8 lg:justify-between lg:gap-10">
              <fieldset>
                <legend className="font-solar text-[20px] font-medium leading-none text-[#212121]">
                  What kind of space are you cooling?
                </legend>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {SPACE_TYPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={space === s.id}
                      onClick={() => setSpace(s.id)}
                      className={cn(
                        "flex h-10 items-center rounded-[8px] border bg-white px-3 text-[14px] font-medium leading-[1.6] transition-colors",
                        space === s.id
                          ? "border-[#3478F6] text-[#3478F6]"
                          : "border-[#E9E9E9] text-[#212121] hover:border-[#3478F6]/40",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* AC units */}
              <div>
                <SliderHeader
                  question="How many AC units are currently installed?"
                  value={String(units)}
                  unit="units"
                />
                <Slider
                  className="mt-2"
                  min={1}
                  max={100}
                  value={units}
                  onChange={setUnits}
                  ariaLabel="Number of AC units installed"
                  ticks={["1", "50", "100"]}
                />
              </div>

              {/* hours */}
              <div>
                <SliderHeader
                  question="On average, how many hours a day do they run?"
                  value={String(hours)}
                  unit="hrs"
                />
                <Slider
                  className="mt-2"
                  min={1}
                  max={20}
                  value={hours}
                  onChange={setHours}
                  ariaLabel="Average hours of daily runtime"
                  ticks={["1", "10", "20"]}
                />
              </div>

              {/* tariff */}
              <div>
                <SliderHeader
                  question="What's your current electricity tariff per unit?"
                  value={`₹${tariff}`}
                  unit="/units"
                />
                <Slider
                  className="mt-2"
                  min={4}
                  max={12}
                  step={0.5}
                  value={tariff}
                  onChange={setTariff}
                  ariaLabel="Electricity tariff per unit"
                  ticks={["₹4", "₹8", "₹12"]}
                />
              </div>
            </div>

            {/* Right — results panel (Figma 377×526, rounded 24, 20px padding,
                white washed with soft green blobs) */}
            <div className="relative flex flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#F6FCF8_0%,#EAF7EF_100%)] p-5 lg:min-h-[526px] lg:w-[377px] lg:shrink-0">
              {/* Green glow blobs approximating the Figma blurred ellipses */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 h-64 w-[130%] -translate-x-1/2 rounded-full bg-[#0BA02C]/15 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-[#0BA02C]/10 blur-3xl" />
              </div>

              <div className="relative flex flex-1 flex-col">
                <p className="mt-6 text-center font-solar text-[20px] font-medium leading-none text-[#212121]">
                  Est. 5 year Total Savings
                </p>
                <p className="mt-3 text-center font-solar text-[44px] font-medium leading-none text-[#08A22C] md:text-[52px] lg:text-[60px]">
                  {inrBig(result.fiveYear)}
                </p>

                {/* Stat rows — hairline-divided, 12px/20px padding */}
                <div className="mt-[30px]">
                  <div className="flex items-center justify-between gap-3 border-b border-[#E9E9E9] px-3 py-5">
                    <span className="flex items-center gap-2 text-[14px] leading-[1.3] text-[#6A6A6A]">
                      <IndianRupee
                        className="size-4 shrink-0 text-[#3478F6]"
                        strokeWidth={2}
                      />
                      1 Year Savings
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-solar text-[16px] font-medium leading-none text-[#212121]">
                      {inr(result.oneYear)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-[#E9E9E9] px-3 py-5">
                    <span className="flex items-center gap-2 text-[14px] leading-[1.3] text-[#6A6A6A]">
                      <Target
                        className="size-4 shrink-0 text-[#3478F6]"
                        strokeWidth={2}
                      />
                      Est. Carbon Reduction (5yr)
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-solar text-[16px] font-medium leading-none text-[#212121]">
                      {co2Label} T
                    </span>
                  </div>
                </div>

                {/* Highlight cards — stacked block: yellow (#FFFEEE) on top,
                    green (#EFFFE4) below, shared collapsed border. The mock
                    repeats the units line twice; the second card carries the
                    CO₂ stat instead so the pair reads meaningfully. */}
                <div className="mt-[30px]">
                  <div className="-mb-px flex items-start gap-3 rounded-t-[8px] border border-[#E9E9E9] bg-[#FFFEEE] px-3 py-5">
                    <span aria-hidden className="text-[20px] leading-none">
                      ⚡
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-[12px] leading-tight text-[#212121]">
                        <span className="font-bold text-[#3478F6]">
                          {unitsLabel} units
                        </span>{" "}
                        of electricity saved every year
                      </p>
                      <p className="text-[10px] leading-none text-[#6A6A6A]">
                        enough to power a small office for months.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-b-[8px] border border-[#E9E9E9] bg-[#EFFFE4] px-3 py-5">
                    <span aria-hidden className="text-[20px] leading-none">
                      ⚡
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-[12px] leading-tight text-[#212121]">
                        <span className="font-bold text-[#3478F6]">
                          {co2Label} T of CO₂
                        </span>{" "}
                        avoided over the next 5 years
                      </p>
                      <p className="text-[10px] leading-none text-[#6A6A6A]">
                        the work of a small forest, done by your ACs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA — black pill, Poppins SemiBold 12px */}
                <a
                  href="#lead-form"
                  className="mt-[26px] flex h-10 w-full items-center justify-center rounded-[50px] bg-[#212121] px-6 text-[12px] font-semibold leading-none text-white transition-opacity hover:opacity-90 lg:mt-auto"
                >
                  Get a detailed savings report
                </a>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
