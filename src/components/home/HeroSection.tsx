"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import type { HomeHeroContent } from "@/lib/shopify";

// Local design assets (public/newHomepage). Spaces are percent-encoded so the
// next/image srcset stays valid.
const BG_GRID = "/newHomepage/Background%20pattern.webp";
const BG_AURORA = "/newHomepage/Group%2031.webp";
const BADGE_FAN = "/newHomepage/Frame%2029.webp";
const BADGE_THERMO = "/newHomepage/Frame%201437256373.webp";
const BADGE_SNOW = "/newHomepage/Frame%201437256372%20(1).webp";

const HEADLINE_DELAYS = { line1: 0.15, line2: 0.28 } as const;

// A floating decorative badge: fades/zooms in once, then gently bobs forever.
function FloatingBadge({
  src,
  className,
  delay = 0,
  drift = 12,
  duration = 5,
}: {
  src: string;
  className: string;
  delay?: number;
  drift?: number;
  duration?: number;
}) {
  return (
    <m.div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 hidden lg:block ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, y: [0, -drift, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <Image
        src={src}
        alt=""
        width={180}
        height={180}
        className="h-[134px] w-[134px] xl:h-[156px] xl:w-[156px]"
      />
    </m.div>
  );
}

function FeatureCard({ features }: { features: HomeHeroContent["features"] }) {
  if (!features.length) return null;
  return (
    <m.div
      variants={fadeUp}
      className="rounded-[20px] border border-black/[0.07] bg-white/50 backdrop-blur-sm"
    >
      <div className="grid grid-cols-3 divide-x divide-black/[0.07]">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col gap-2 px-7 py-8">
            {feature.iconUrl ? (
              <Image
                src={feature.iconUrl}
                alt={feature.iconAlt ?? feature.title}
                width={160}
                height={44}
                className="h-[40px] w-auto object-contain object-left"
              />
            ) : (
              <div className="h-[40px]" />
            )}
            <h3 className="mt-3 text-[19px] font-semibold leading-tight text-optimist-black">
              {feature.title}
            </h3>
            <p className="text-[15px] leading-snug text-black/50">
              {feature.subtitle}
            </p>
          </div>
        ))}
      </div>
    </m.div>
  );
}

interface HeroSectionProps {
  hero: HomeHeroContent | null;
}

export function HeroSection({ hero }: HeroSectionProps) {
  const headingLine1 = hero?.headingLine1 ?? "Say hello to your";
  const headingLine2 = hero?.headingLine2 ?? "optimist";
  const title =
    hero?.title ?? "Built for 50°C summers, not 24°C showrooms.";
  const subtitle = hero?.subtitle ?? "";
  const features = hero?.features ?? [];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background: faint grid pattern across the top */}
      <Image
        src={BG_GRID}
        alt=""
        aria-hidden="true"
        width={1456}
        height={922}
        priority
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-auto w-full select-none"
      />

      {/* ---- Upper hero: headline + badges + AC ---- */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-[150px] lg:px-10">
        {/* Floating decorative badges */}
        <FloatingBadge src={BADGE_FAN} className="left-[7%] top-[150px]" delay={0.3} drift={14} duration={5.5} />
        <FloatingBadge src={BADGE_THERMO} className="right-[9%] top-[78px]" delay={0.45} drift={10} duration={6} />
        <FloatingBadge src={BADGE_SNOW} className="right-[2%] top-[240px]" delay={0.6} drift={16} duration={5} />

        {/* Headline */}
        <div className="text-center">
          <m.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: HEADLINE_DELAYS.line1 }}
            className="font-display font-semibold leading-[1.02] text-optimist-black text-[clamp(40px,5vw,72px)]"
          >
            {headingLine1}
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: HEADLINE_DELAYS.line2 }}
            className="font-display font-semibold leading-[0.95] text-optimist-blue-hero text-[clamp(56px,7.2vw,104px)]"
          >
            {headingLine2}
          </m.p>
        </div>

        {/* AC product image (LCP) with the coloured aurora radiating from behind
            it. The aurora is a downward-V: its vertex sits behind the AC and the
            blue/green/yellow wings flare out full-bleed to both edges. */}
        <div className="relative mt-2">
          <Image
            src={BG_AURORA}
            alt=""
            aria-hidden="true"
            width={1440}
            height={402}
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[104vw] max-w-none -translate-x-1/2 -translate-y-[80%] select-none"
          />
          <div className="hero-ac-enter relative z-10 flex justify-center">
            <Image
              src={ASSETS.acHeroDesktop}
              alt="Optimist AC - India's highest ISEER rated air conditioner"
              width={1050}
              height={700}
              priority
              sizes="(min-width: 1024px) 920px, 90vw"
              className="h-auto w-full max-w-[920px] object-contain"
              style={{ width: "clamp(560px, 56vw, 920px)" }}
            />
          </div>
        </div>
      </div>

      {/* ---- Lower block: title + feature card ---- */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.12)}
        className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-10 px-6 pb-[110px] pt-[56px] lg:grid-cols-[460px_1fr] lg:gap-16 lg:px-10"
      >
        <m.div variants={fadeUp}>
          <h2 className="font-display text-[clamp(28px,2.9vw,40px)] font-semibold leading-[1.16] text-optimist-black">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-5 max-w-[440px] text-[18px] leading-[1.6] text-black/55">
              {subtitle}
            </p>
          ) : null}
        </m.div>

        <FeatureCard features={features} />
      </m.div>
    </section>
  );
}
