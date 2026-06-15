"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import Card from "@/components/home/ui/card";
import { SectionTitle } from "@/components/home/ui/section-title";
import { useApp } from "@/components/home/useApp";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import type { HomeAppFeaturesContent } from "@/lib/shopify";

const thermometer = "/figma/temp.svg";
const iconStar = "/figma/icon-star.svg";
const iconSettings = "/figma/icon-settings.svg";
const iconFilter = "/figma/icon-filter.svg";
const calendar = "/figma/calendar.svg";
const companionPhoneApp = "/figma/companion-phone-app.svg";

const controls = [
  {
    img: thermometer,
    title: "Live energy tracking.",
    description: "Track energy \nconsumption, down to\nevery unit.",
  },
  {
    img: iconStar,
    title: "Intelligent diagnostics.",
    description: "Know what’s working,\nand what needs fixing,\neasily.",
  },
  {
    img: iconSettings,
    title: "Control from anywhere.",
    description: "Schedule your cooling: walk into pre-cooled rooms.",
  },
  {
    img: thermometer,
    title: "First ever gas-level indicator.",
    description: "Refill gas only when\nyou need to. ",
  },
  {
    img: iconFilter,
    title: "Filter health\ntracker.",
    description: "So you can breathe\neasy, all the time.",
  },
  {
    img: calendar,
    title: "Projected monthly bills.",
    description: "No bill shocks. Just\nreal numbers.",
  },
];

interface AppFeaturesSectionProps {
  content: HomeAppFeaturesContent | null;
}

// Ported verbatim from optimist-website's ALL CONTROLS IN YOUR HAND section,
// driven by the `hp_appfeatures` metaobject (falls back to the reference's
// static copy/assets when absent).
export function AppFeaturesSection({ content }: AppFeaturesSectionProps) {
  const { isMobile } = useApp();

  const controlCards = content?.features?.length
    ? content.features.map((f) => ({
        img: f.iconUrl ?? "",
        title: f.title,
        description: f.subtitle,
      }))
    : controls;
  const phoneImg = content?.mainImageUrl ?? companionPhoneApp;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 md:pt-50">
      <div className="mx-auto max-w-[1080px]">
        <SectionTitle
          eyebrow={content?.subtitle ?? "One app with multiple features."}
          title={content?.title ?? "All useful. Nothing wasteful."}
          description={
            content?.description ??
            `Schedule cooling from the office, track your energy bills, and know your gas\nlevels before they're ever a problem — all from one app.`
          }
        />

        <div className="mt-8 md:mt-14 flex flex-col-reverse md:flex-row">
          <m.div
            className="relative -top-14 md:top-0 w-full grid grid-cols-2 gap-4 sm:gap-x-6 md:gap-x-10 gap-y-4 sm:gap-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent(0.06)}
          >
            {controlCards.map((control) => (
              <Card
                key={control.title}
                variants={fadeUp}
                className="h-auto min-h-[120px] md:h-[220px] md:w-60 p-5 sm:p-6 md:p-[30px] md:pb-1 flex flex-col gap-3 sm:gap-4"
              >
                <img
                  src={control.img}
                  alt=""
                  aria-hidden
                  className="h-8 sm:h-10 w-fit"
                />
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <p className="text-base sm:text-lg md:text-xl leading-none font-solar font-medium whitespace-pre-line">
                    {control.title}
                  </p>
                  <p className="text-sm sm:text-base font-light text-[#6A6A6A] md:whitespace-pre-line">
                    {control.description}
                  </p>
                </div>
              </Card>
            ))}
          </m.div>

          <div className="relative w-full h-full">
            {isMobile ? (
              <img
                src={phoneImg}
                alt="Optimist companion app on a phone"
                className="size-full scale-110 object-contain"
              />
            ) : (
              <img
                src={phoneImg}
                alt=""
                className="absolute top-22 left-3 -right-14 scale-125"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
