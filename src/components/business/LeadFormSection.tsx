"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { m } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeUp, viewportOnce } from "@/lib/motion-variants";
import { Slider } from "./Slider";

const CHECK_ICON = "/business/why-check.svg";
const FORM_ID = "lead-form-form";

// Figma node 1:625 — one 1080×740 card: left pitch column (377px) with green
// checks, right form column (480px) with 50px inputs, the shared slider and
// project-type chips, and a frosted full-width bottom bar holding the
// disclaimer + gradient CTA. The design labels the property-type select
// "Number of ACs Required" (with value "Office") — corrected to
// "Property Type" since the AC count has its own slider below.
const benefits = [
  "Free fleet energy assessment",
  "Custom proposal within 48 hours",
  "AMC & multi-site support options",
];

const PROPERTY_TYPES = [
  "Office",
  "Hotel/Resort",
  "Education Facility",
  "Healthcare Building",
  "Retail Space",
  "Other",
];

const PROJECT_TYPES = [
  "New Installation",
  "Replacement Project",
  "AMC Requirement",
  "Energy Savings Assessment",
];

const labelClass = "text-[14px] font-medium leading-none text-[#999999]";
// `outline-hidden` (transparent outline) suppresses the browser's native
// focus halo in every browser/OS a11y mode; focus feedback is the brand-blue
// border + a soft matching glow instead.
const inputClass =
  "h-[50px] w-full rounded-[8px] border border-[#E9E9E9] bg-white px-4 text-[14px] font-medium text-[#212121] outline-hidden transition-[border-color,box-shadow] placeholder:font-normal placeholder:text-[#BABABA] focus:border-[#3478F6] focus:shadow-[0_0_0_3px_rgba(52,120,246,0.12)]";

export function LeadFormSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    propertyType: "Office",
    units: 15,
    projectType: "New Installation",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Placeholder submit — not wired to a backend yet; shows an inline
  // confirmation instead of posting anywhere.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="lead-form" className="scroll-mt-28 py-14 md:py-[100px]">
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative flex flex-col overflow-hidden rounded-[24px] border border-[#E9E9E9] bg-white"
        >
          {/* Soft blue wash on the card's left (Figma blurred ellipse) */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[-49px] left-[-285px] h-[791px] w-[534px] rounded-full bg-[linear-gradient(180deg,#69CDEB33_0%,#1265FF22_100%)] blur-[70px]"
          />

          {/* Main content */}
          <div className="relative flex flex-col gap-10 p-6 sm:p-8 lg:flex-row lg:justify-between lg:p-[49px]">
            {/* Left — pitch */}
            <div className="lg:w-[377px] lg:shrink-0">
              <p className="text-lg font-medium leading-[1.6] text-[#3478F6] md:text-[20px]">
                Let&apos;s get started
              </p>
              <h2 className="mt-4 max-w-[377px] font-solar text-[32px] font-medium leading-[1.2] text-[#212121] sm:text-[40px] md:mt-5 md:text-[48px]">
                Let&apos;s evaluate your cooling requirement.
              </h2>
              <p className="mt-5 max-w-[377px] text-sm leading-[1.6] text-[#6A6A6A] md:text-[16px]">
                Whether you&apos;re planning a new project, replacing an
                existing AC fleet, or exploring AMC options, our team can help
                estimate savings and recommend the right solution.
              </p>

              <ul className="mt-6 flex flex-col gap-4">
                {benefits.map((b) => (
                  <li key={b} className="flex h-8 items-center gap-2">
                    <img
                      src={CHECK_ICON}
                      alt=""
                      aria-hidden
                      className="size-8 shrink-0"
                    />
                    <span className="text-[15px] leading-none text-[#212121] md:text-[16px]">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="lg:w-[480px] lg:shrink-0">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="size-14 text-[#08A22C]" />
                  <h3 className="mt-4 font-solar text-2xl font-medium text-[#212121]">
                    Thank you!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-[#6A6A6A]">
                    Our commercial sales team will reach out within 48 hours
                    with your custom proposal. (Demo only &mdash; no data was
                    sent.)
                  </p>
                </div>
              ) : (
                <form
                  id={FORM_ID}
                  onSubmit={onSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={cn(labelClass, "mb-3 block")}>
                        Name
                      </label>
                      <input
                        className={inputClass}
                        placeholder="Anand"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(labelClass, "mb-3 block")}>
                        Company
                      </label>
                      <input
                        className={inputClass}
                        placeholder=""
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(labelClass, "mb-3 block")}>
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(labelClass, "mb-3 block")}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        className={inputClass}
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(labelClass, "mb-3 block")}>
                        City
                      </label>
                      <input
                        className={inputClass}
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(labelClass, "mb-3 block")}>
                        Property Type
                      </label>
                      <div className="relative">
                        <select
                          className={cn(inputClass, "appearance-none pr-10")}
                          value={form.propertyType}
                          onChange={(e) => set("propertyType", e.target.value)}
                        >
                          {PROPERTY_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#6A6A6A]" />
                      </div>
                    </div>
                  </div>

                  {/* AC units slider — same control as the calculator */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className={labelClass}>
                        How many AC units are required?
                      </span>
                      <div className="flex h-10 shrink-0 items-center rounded-[8px] border border-[#E9E9E9] bg-white px-3">
                        <span className="flex items-baseline gap-1">
                          <span className="text-[20px] font-semibold leading-none text-[#3478F6]">
                            {form.units}
                          </span>
                          <span className="text-[12px] font-semibold leading-none text-[#4D4D4D]">
                            units
                          </span>
                        </span>
                      </div>
                    </div>
                    <Slider
                      className="mt-2"
                      min={1}
                      max={100}
                      value={form.units}
                      onChange={(v) => set("units", v)}
                      ariaLabel="Number of AC units required"
                      ticks={["1", "50", "100"]}
                    />
                  </div>

                  {/* Project type chips */}
                  <div>
                    <span className={cn(labelClass, "mb-3 block")}>
                      Project Type
                    </span>
                    {/* 2×2 grid on phones; content-hugging wrap from sm up */}
                    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
                      {PROJECT_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={form.projectType === t}
                          onClick={() => set("projectType", t)}
                          className={cn(
                            "flex min-h-10 items-center justify-center rounded-[8px] border bg-white px-3 py-1.5 text-center text-[14px] font-medium leading-[1.3] transition-colors sm:justify-start sm:py-0 sm:text-left sm:leading-[1.6]",
                            form.projectType === t
                              ? "border-[#3478F6] text-[#3478F6]"
                              : "border-[#E9E9E9] text-[#212121] hover:border-[#3478F6]/40",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Frosted bottom bar — disclaimer left, CTA right */}
          <div className="relative flex flex-col gap-5 border-t-2 border-white bg-white/60 px-6 py-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-[8px] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-[49px] lg:py-10">
            <p className="max-w-[377px] text-[12px] leading-[1.6] text-[#999999]">
              By submitting, you agree to be contacted by Optimist&apos;s
              commercial sales team. This form is a design placeholder &mdash;
              connect it to your CRM/backend before going live.
            </p>
            <button
              type="submit"
              form={FORM_ID}
              disabled={submitted}
              className="flex h-12 w-full items-center justify-center rounded-[50px] bg-[linear-gradient(44.96deg,#1265FF_30.07%,#69CDEB_99.77%,#4466FF_136.67%)] px-6 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 lg:h-[60px] lg:w-[480px] lg:text-[16px]"
            >
              {submitted ? "Submitted — we'll be in touch" : "Get Commercial Proposal"}
            </button>
          </div>
        </m.div>
      </div>
    </section>
  );
}
