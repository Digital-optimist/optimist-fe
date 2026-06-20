"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";

import SavingsGraph from "@/components/figma/savings-graph";
import Card from "@/components/home/ui/card";
import { SectionTitle } from "@/components/home/ui/section-title";
import { useApp } from "@/components/home/useApp";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const horizontalDottedLines = "/figma/horizontal-dotted-lines.svg";
const verticalDottedLines = "/figma/vertical-dotted-lines.svg";
const gasLevelIndicator = "/figma/gas-level-indicator.svg";
const modes = "/figma/modes.svg";
const iconWifi = "/figma/icon-wifi.svg";
const acInHall = "/figma/ac-in-hall.svg";
const acFlow = "/figma/ac-flow.svg";
const remote = "/figma/remote.svg";
const phoneApp = "/figma/phone-app.svg";
const phoneAppBg = "/figma/phone-app-bg.svg";
const warrantyMark = "/newHomepage/Vector (21).webp";

// Ported verbatim from optimist-website's BENEFITS bento grid.
export function BenefitsSection() {
  const { isMobile } = useApp();

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 md:pt-50">
      <div className="mx-auto max-w-[1080px]">
        <SectionTitle
          eyebrow="For a country whose energy bills go as high as its temperatures."
          title={`Built for Indian heat.\nDesigned for real savings.`}
        />

        <m.div
          className="mt-8 md:mt-14 w-full grid auto-rows-auto gap-6 md:gap-10 grid-cols-2 md:grid-cols-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.07)}
        >
          <Card
            variants={fadeUp}
            className="col-span-2 md:col-span-6 relative h-[320px] sm:h-[400px] md:h-[480px]"
          >
            <img
              src={acInHall}
              alt="Optimist AC cooling a living room"
              className="size-full object-cover scale-115 md:scale-100"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 font-solar font-medium">
              <p className="text-[28px] md:text-[32px] leading-[120%] whitespace-pre-line">{`Promises cooling.\nDelivers it. Even at`}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-[28px] sm:text-[36px] md:text-[40px] leading-none text-[#3478F6]">
                  50°C.
                </p>
                <p className="text-right text-xs sm:text-sm leading-[120%] font-poppins font-light text-[#999999]">
                  Tested at Government approved labs.
                </p>
              </div>
            </div>
          </Card>

          <Card
            variants={fadeUp}
            className="col-span-2 md:col-span-6 relative flex h-[340px] sm:h-[400px] md:h-[480px] flex-col p-5 sm:p-8 md:p-10"
          >
            <p className="font-solar font-medium">
              <span className="text-[28px] sm:text-[36px] md:text-[40px] leading-none text-[#08A22C]">
                ₹8,000 saved
              </span>
              <br />
              <span className="text-[28px] md:text-[32px] leading-[120%]">
                in a single season.
              </span>
            </p>
            <div className="mt-3.5 relative flex-1">
              <img
                src={horizontalDottedLines}
                alt=""
                className="inset-0 left-0"
              />
              <img
                src={verticalDottedLines}
                alt=""
                className="absolute inset-0 left-0"
              />
              <p className="absolute top-4 text-base sm:text-lg md:text-xl font-light">
                <span className="text-[#3478F6] font-bold">35% Lower</span>{" "}
                electricity bills
              </p>
              <SavingsGraph className="absolute top-4 sm:top-5.5 left-0 w-full h-full z-10" />
            </div>
            <div className="mt-4 sm:mt-5 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-4 h-1 rounded-[20px] bg-[#3478F6]" />
                <span className="text-xs sm:text-sm leading-[140%] font-semibold text-[#212121]">
                  Optimist
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-1 rounded-[20px] bg-[#E9E9E9]" />
                <span className="text-xs sm:text-sm leading-[140%] text-[#212121]">
                  Typical 5 Star AC
                </span>
              </div>
            </div>
          </Card>

          <Card
            variants={fadeUp}
            className="col-span-2 md:col-span-9 relative p-5 sm:p-8 md:p-10 pb-5 sm:pb-7 md:pb-8.5 flex h-[280px] sm:h-[320px] md:h-[350px] flex-col bg-[#EBEBEB]"
          >
            <img
              src={acFlow}
              alt=""
              aria-hidden
              className="absolute md:top-0 md:right-0 size-full md:w-auto object-contain opacity-50 md:opacity-100"
            />
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                <img
                  src={modes}
                  alt="modes"
                  className="h-10 sm:h-12 md:h-15 w-fit"
                />
                <div className="flex flex-col font-solar font-medium">
                  <p className="text-[24px] sm:text-[32px] md:text-[40px] leading-[120%] text-[#3478F6]">
                    Cold, fast.
                  </p>
                  <p className="text-[28px] md:text-[32px] leading-[120%] whitespace-pre-line">{`1.9 ton cooling from\na 1.4 ton AC.`}</p>
                </div>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-light">
                <span className="text-[#3478F6] font-bold">135%</span> capacity
                boost
              </p>
            </div>
          </Card>

          <Card
            variants={fadeUp}
            className="col-span-2 md:col-span-3 relative h-[240px] md:h-[350px]"
          >
            <img
              src={gasLevelIndicator}
              alt=""
              className="absolute left-[calc(50%-5px)] -translate-x-1/2"
            />
            <div className="mt-[162px] md:mt-[157px] mx-5 md:ml-[30px] flex flex-col items-center md:items-start justify-center gap-x-2 font-solar font-medium">
              <p className="text-[24px] sm:text-[32px] md:text-[40px] leading-[120%] text-[#3478F6] md:whitespace-pre-line">{`Gas-level\nindicator.`}</p>
              <p className="text-[24px] md:text-[32px] leading-[120%] md:whitespace-pre-line">{`1st time in an\nAC. Ever.`}</p>
            </div>
          </Card>

          <Card variants={fadeUp} className="col-span-2 md:col-span-4">
            <div className="relative  h-[300px] sm:h-[400px] md:h-[480px]">
              <img
                src={remote}
                alt="Optimist AC remote with minimal buttons"
                className="size-full object-contain object-right md:object-center"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 font-solar font-medium">
                <p className="text-[24px] md:text-[32px] leading-[120%] whitespace-pre-line">{`No unnecessary\nbuttons.`}</p>
                <p className="text-[24px] md:text-[40px] leading-[120%] text-[#3478F6]">
                  All the control.
                </p>
              </div>
            </div>
          </Card>

          <m.div
            variants={fadeUp}
            className={cn(
              isMobile
                ? "col-span-2 grid grid-cols-2 gap-x-6"
                : "md:col-span-3 md:space-y-10",
            )}
          >
            <Card className="md:h-60 p-5 sm:p-8 md:p-[30px] bg-[#FFFCDC]">
              <img src={iconWifi} alt="" aria-hidden className="h-10 w-auto" />
              <div className="mt-[30px]">
                <p className="text-[20px] sm:text-[24px] md:text-[27px] leading-[120%] font-solar font-medium">{`WiFi & Smart home ready.`}</p>
              </div>
            </Card>

            <Card className="relative pt-5 sm:pt-[20px] md:pt-[25px] pb-2.5 text-center text-white bg-[linear-gradient(44.96deg,#1265FF_30.07%,#69CDEB_99.77%,#4466FF_136.67%)]">
              <img
                src={warrantyMark}
                alt=""
                aria-hidden
                className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 h-[80px] sm:h-[90px] md:h-[106px]"
              />
              <div className="relative">
                <p className="text-3xl sm:text-4xl md:text-5xl leading-[120%] font-solar font-bold">
                  5 Year
                </p>
                <p className="-mt-px text-sm sm:text-base leading-[120%] font-medium whitespace-pre-line">{`Comprehensive\nwarranty.`}</p>
              </div>

              <Card className="mx-2.5 mt-[20px] sm:mt-[25px] pt-[11px] pb-[7px] text-center">
                <p className="text-lg sm:text-[20px] leading-none font-solar font-bold text-[#212121]">
                  10 year
                </p>
                <p className="font-poppins text-sm sm:text-base font-normal text-[#6A6A6A]">
                  Compressor warranty.
                </p>
              </Card>
            </Card>
          </m.div>

          <Card
            variants={fadeUp}
            className="col-span-2 md:col-span-5 relative p-5 sm:p-8 md:p-10 h-[280px] sm:h-[320px] md:h-auto"
          >
            <img
              src={phoneAppBg}
              alt=""
              aria-hidden
              className="absolute bottom-0 left-0 w-full h-full object-cover"
            />
            <img
              src={phoneApp}
              alt="Optimist app controlling the AC from a phone"
              className="absolute bottom-0 left-1/2 -translate-x-1/3 md:left-0 md:translate-x-1/5 h-[90%] md:h-auto"
            />
            <div className="font-solar font-medium relative z-10">
              <p className="text-[24px] md:text-[40px] leading-none text-[#3478F6]">
                One power app.
              </p>
              <p className="text-[24px] md:text-[32px] leading-[120%] whitespace-pre-line">{`Keep check, in\none tap.`}</p>
            </div>
          </Card>
        </m.div>
      </div>
    </section>
  );
}
