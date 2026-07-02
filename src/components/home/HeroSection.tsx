"use client";

import { m } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { useApp } from "@/components/home/useApp";
import { cn } from "@/lib/cn";
import type { HomeHeroContent } from "@/lib/shopify";

const heroAc = "/figma/hero-ac.svg";
const heroSwoosh = "/figma/hero-swoosh.svg";
const heroDecor = "/figma/hero-decor.svg";
const fanFloatingIcon = "/figma/fan-floating-icon.svg";
const tempFloatingIcon = "/figma/temp-floating-icon.svg";
const freezeFloatingIcon = "/figma/freeze-floating-icon.svg";
const iconFast = "/figma/icon-fast.svg";
const iconAuto = "/figma/icon-auto.svg";

interface HeroSectionProps {
  hero: HomeHeroContent | null;
}

// optimist-website HERO, driven by the `hp_herosection` metaobject (falls back
// to the reference's static copy when absent). Scroll-condense padding is
// reproduced via `isScrollHead`; entrance animations via Framer.
export function HeroSection({ hero }: HeroSectionProps) {
  const { isScrollHead } = useApp();

  const headingLine1 = hero?.headingLine1 ?? "Say hello to your";
  const title = hero?.title ?? "Built for 50°C summers,\nnot 24°C showrooms.";
  const subtitle =
    hero?.subtitle ??
    "Indian summers are one giant, constant\nheatwave. Optimist is engineered for\nextremes, without breaking down.";
  const features = hero?.features ?? [];

  return (
    <section
      className={cn(
        "relative mx-auto pt-8 w-full max-w-[1440px] px-5",
        isScrollHead ? "md:pt-24" : "md:pt-16",
      )}
    >
      <div className="mx-auto max-w-[1080px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSwoosh}
          alt=""
          aria-hidden
          className={cn(
            "absolute left-0 right-0 w-full",
            isScrollHead
              ? "top-25 md:top-31 2xl:top-19"
              : "top-25 md:top-23 2xl:top-11",
          )}
        />

        <div className="w-full flex flex-col">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent(0.12)}
            className="flex w-full flex-col items-center gap-2"
          >
            <m.p
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl leading-[110%] font-solar font-medium text-center"
            >
              {headingLine1}
            </m.p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <m.img
              variants={fadeUp}
              src={heroDecor}
              alt={hero?.headingLine2 ?? "optimist"}
              className="pointer-events-none h-10 sm:h-16 md:h-20"
            />
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center mt-2 md:mt-0"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-[#F8F7F3] opacity-10"
              style={{ filter: "blur(155.81px)" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fanFloatingIcon}
              alt=""
              aria-hidden
              className="absolute -top-12 -left-6 sm:-top-28 sm:-left-8 md:-top-36 md:-left-10 w-18 sm:w-20 md:w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tempFloatingIcon}
              alt=""
              aria-hidden
              className="absolute -top-27 -right-6 sm:-top-40 sm:right-20 md:-top-52 md:right-28 w-14 sm:w-20 md:w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={freezeFloatingIcon}
              alt=""
              aria-hidden
              className="absolute -top-6 -right-8 sm:-top-16 sm:-right-12 md:-top-20 md:-right-16 w-18 sm:w-20 md:w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroAc}
              alt="Optimist AC"
              className="relative z-10 h-fit w-full max-w-[893px] px-4 sm:px-0"
            />
          </m.div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent(0.12)}
            className="mt-8 sm:mt-12 md:mt-16 lg:mt-22 flex flex-col md:flex-row items-start justify-between gap-6 md:gap-14"
          >
            <m.div
              variants={fadeUp}
              className="flex flex-col gap-[9px] w-full md:max-w-[440px]"
            >
              <p className="text-center md:text-left text-[28px] md:text-[36px] lg:text-[40px] leading-[110%] font-solar font-medium whitespace-pre-line">
                {title}
              </p>

              <p className="text-center md:text-left text-sm sm:text-base leading-[160%] poppins-light text-[#6A6A6A] whitespace-pre-line">
                {subtitle}
              </p>
            </m.div>

            <m.div
              variants={fadeUp}
              className="rounded-[16px] border border-[#E9E9E9] bg-white w-full flex-1"
            >
              {features.length >= 3 ? (
                <div className="grid grid-cols-3 divide-x divide-[#E9E9E9]">
                  {features.slice(0, 3).map((feature, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center md:items-start gap-[19px] px-2 py-4 md:p-[30px]"
                    >
                      {feature.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={feature.iconUrl}
                          alt={feature.iconAlt ?? feature.title}
                          className="h-7 md:h-12 w-auto max-w-[80px] md:max-w-[120px] shrink-0 object-contain object-left"
                        />
                      ) : null}
                      <div className="min-w-0 text-center md:text-left">
                        <p className="text-lg md:text-[21px] leading-none font-solar font-normal">
                          {feature.title}
                        </p>
                        <p className="mt-2.5 text-sm md:text-base leading-[130%] poppins-light text-[#6A6A6A]">
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 divide-x divide-[#E9E9E9]">
                  <div className="flex flex-col items-center md:items-start gap-[19px] px-2 py-4 md:p-[30px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={iconFast}
                      alt=""
                      aria-hidden
                      className="h-7 md:h-12 w-fit shrink-0"
                    />
                    <div className="min-w-0 text-center md:text-left">
                      <p className="text-lg md:text-[21px] leading-none font-solar font-normal">
                        Fastest cooling
                      </p>
                      <p className="mt-2.5 text-sm md:text-base leading-[130%] poppins-light text-[#6A6A6A] md:whitespace-pre-line">
                        even at 50°C outside
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-start gap-[19px] px-2 py-4 md:p-[30px]">
                    <p className="py-1 text-2xl md:text-[40px] leading-none font-solar font-medium text-[#3478F6]">
                      25–35%
                    </p>
                    <div className="min-w-0 text-center md:text-left">
                      <p className="text-lg md:text-[21px] leading-none font-solar font-normal">
                        Lower bills
                      </p>
                      <p className="mt-2.5 text-sm md:text-base leading-[130%] poppins-light text-[#6A6A6A] md:whitespace-pre-line">
                        Not one-time, every time.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-start gap-[19px] px-2 py-4 md:p-[30px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={iconAuto}
                      alt=""
                      aria-hidden
                      className="h-7 md:h-12 w-fit shrink-0"
                    />
                    <div className="min-w-0 text-center md:text-left">
                      <p className="text-lg md:text-[21px] leading-none font-solar font-normal">
                        Real Intelligence
                      </p>
                      <p className="mt-2.5 text-sm md:text-base leading-[130%] poppins-light text-[#6A6A6A] md:whitespace-pre-line">{`Anytime,\nanywhere.`}</p>
                    </div>
                  </div>
                </div>
              )}
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
