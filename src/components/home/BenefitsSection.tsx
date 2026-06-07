"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

// Design assets (public/newHomepage). Spaces percent-encoded for valid srcset.
const ROOM_AC = "/newHomepage/Group%204.webp";
const CHART_CURVES = "/newHomepage/Group%201437256195.webp";
const CHART_GRID_V = "/newHomepage/Frame%201437256345.webp";
const CHART_GRID_H = "/newHomepage/Frame%201437256346.webp";
const SNOWFLAKE = "/newHomepage/5VQXQI.webp";
const AC_AIRFLOW = "/newHomepage/image%201179.webp";
const GAS_GAUGE = "/newHomepage/image%201190.webp";
const REMOTE = "/newHomepage/remote%201.webp";
const WIFI = "/newHomepage/Vector%20(20).webp";
const SHIELD = "/newHomepage/Vector%20(21).webp";
const PHONE = "/newHomepage/Untitled%202%201.webp";
const BEDSHEET = "/newHomepage/image%201181.webp";

const CARD = "relative overflow-hidden rounded-[24px] bg-[#F4F5F7]";

export function BenefitsSection() {
  return (
    <section className="relative bg-white py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
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
            className="text-[20px] leading-[30px] font-medium text-optimist-blue-hero"
          >
            Multiple benefits to multiply your savings
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-3 font-display text-[48px] leading-[56px] font-medium text-[#212121]"
          >
            Built for India.
            <br />
            Designed for efficiency
          </m.h2>
        </m.div>

        {/* Bento grid */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.08)}
          className="mt-12 flex flex-col gap-5"
        >
          {/* ---- Row 1 ---- */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Still cooling at 50°C */}
            <m.div variants={fadeUp} className={`${CARD} min-h-[380px]`}>
              <Image
                src={ROOM_AC}
                alt="Optimist AC mounted on a wall, cooling a living room"
                fill
                sizes="(min-width: 1024px) 540px, 100vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="font-display text-[26px] font-semibold leading-[1.18] text-optimist-black">
                  Still cooling
                  <br />
                  when India hits
                </p>
                <div className="mt-1 flex items-end gap-3">
                  <span className="font-display text-[36px] font-semibold leading-none text-optimist-black">
                    50°C.
                  </span>
                  <span className="pb-1 text-[13px] text-black/45">
                    Tested at Government Approved Lab
                  </span>
                </div>
              </div>
            </m.div>

            {/* ₹18,000 saved chart */}
            <m.div variants={fadeUp} className={`${CARD} min-h-[380px]`}>
              <div className="flex h-full flex-col p-8">
                <p className="font-display text-[28px] font-semibold leading-[1.15]">
                  <span className="text-[#16A34A]">₹18,000</span>{" "}
                  <span className="text-optimist-black">saved</span>
                  <br />
                  <span className="text-optimist-black">
                    in a single season.
                  </span>
                </p>
                <p className="mt-3 text-[16px]">
                  <span className="font-semibold text-optimist-blue-hero">
                    35% Lower
                  </span>{" "}
                  <span className="text-black/55">electricity bills</span>
                </p>

                {/* Chart */}
                <div className="relative mt-auto w-full">
                  <Image
                    src={CHART_GRID_V}
                    alt=""
                    aria-hidden="true"
                    width={445}
                    height={250}
                    className="absolute inset-0 h-full w-full opacity-70"
                  />
                  <Image
                    src={CHART_GRID_H}
                    alt=""
                    aria-hidden="true"
                    width={445}
                    height={250}
                    className="absolute inset-0 h-full w-full opacity-70"
                  />
                  <Image
                    src={CHART_CURVES}
                    alt="Cumulative savings: Optimist vs a typical 5-star AC"
                    width={445}
                    height={250}
                    className="relative h-auto w-full"
                  />
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center gap-6 text-[13px]">
                  <span className="flex items-center gap-2 font-semibold text-optimist-black">
                    <span className="inline-block h-[3px] w-4 rounded-full bg-optimist-blue-hero" />
                    Optimist
                  </span>
                  <span className="flex items-center gap-2 text-black/45">
                    <span className="inline-block h-[3px] w-4 rounded-full bg-black/20" />
                    Typical 5 Star AC
                  </span>
                </div>
              </div>
            </m.div>
          </div>

          {/* ---- Row 2 ---- */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3.3fr_1fr]">
            {/* Turbo+ Cooling */}
            <m.div
              variants={fadeUp}
              className={`relative overflow-hidden rounded-[24px] min-h-[290px] bg-[#EBEBEB]`}
            >
              <Image
                src={AC_AIRFLOW}
                alt="Optimist AC pushing a strong stream of cool air"
                width={690}
                height={360}
                sizes="(min-width: 1024px) 460px, 60vw"
                className="absolute right-0 top-1/2 w-[58%] -translate-y-1/2 object-contain"
              />
              <div className="relative flex h-full flex-col p-8">
                <Image
                  src={SNOWFLAKE}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className="h-9 w-9"
                />
                <h3 className="mt-4 font-display text-[28px] font-semibold leading-tight text-optimist-blue-hero">
                  Turbo+ Cooling
                </h3>
                <p className="mt-1 text-[20px] leading-snug text-optimist-black">
                  2 Ton cooling from
                  <br />a 1.5 Ton AC.
                </p>
                <p className="mt-auto text-[15px]">
                  <span className="font-semibold text-optimist-blue-hero">
                    135%
                  </span>{" "}
                  <span className="text-black/55">capacity boost</span>
                </p>
              </div>
            </m.div>

            {/* Gas levels */}
            <m.div variants={fadeUp} className={`${CARD} min-h-[290px]`}>
              <div className="flex h-full flex-col justify-center p-7">
                <Image
                  src={GAS_GAUGE}
                  alt="Gas level indicator gauge"
                  width={220}
                  height={150}
                  className="h-auto w-[78%] self-center"
                />
                <p className="mt-5 font-display text-[24px] font-semibold leading-tight">
                  <span className="text-optimist-blue-hero">Gas levels</span>
                  <br />
                  <span className="text-optimist-black">Always in check.</span>
                </p>
              </div>
            </m.div>
          </div>

          {/* ---- Row 3 ---- */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[4fr_3fr_5fr]">
            {/* Remote — Total control */}
            <m.div variants={fadeUp} className={`${CARD} min-h-[390px]`}>
              <Image
                src={REMOTE}
                alt="Optimist AC remote with minimal buttons"
                width={420}
                height={460}
                sizes="(min-width: 1024px) 300px, 80vw"
                className="absolute right-0 top-0 h-auto w-[82%] object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="font-display text-[24px] font-semibold leading-[1.2] text-optimist-black">
                  Less buttons.
                  <br />
                  Zero confusion.
                  <br />
                  <span className="text-optimist-blue-hero">
                    Total control.
                  </span>
                </p>
              </div>
            </m.div>

            {/* Middle column: WiFi + Warranty stacked */}
            <div className="flex flex-col gap-5">
              {/* WiFi & Smart Home */}
              <m.div
                variants={fadeUp}
                className="relative flex flex-1 flex-col overflow-hidden rounded-[24px] bg-[#FBF6DB] p-7"
              >
                <Image
                  src={WIFI}
                  alt=""
                  aria-hidden="true"
                  width={51}
                  height={40}
                  className="h-9 w-auto self-start object-contain"
                />
                <h4 className="mt-4 font-display text-[20px] font-semibold leading-tight text-optimist-black">
                  WiFi &amp; Smart
                  <br />
                  Home Ready
                </h4>
                <p className="mt-1 text-[14px] text-black/45">
                  Alexa &amp; Google
                </p>
              </m.div>

              {/* 5 Year Warranty */}
              <m.div
                variants={fadeUp}
                className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-[24px] p-6 text-white"
                style={{
                  background:
                    "linear-gradient(180deg, #56A8FF 0%, #2F6FE8 55%, #1768F0 100%)",
                }}
              >
                <div className="relative flex w-full flex-col items-center">
                  <Image
                    src={SHIELD}
                    alt=""
                    aria-hidden="true"
                    width={110}
                    height={130}
                    className="h-[92px] w-auto opacity-95"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 text-center">
                    <span className="font-display text-[22px] font-semibold leading-none">
                      <span className="text-[34px]">5</span> Year
                    </span>
                    <span className="mt-1 text-[11px] font-medium leading-tight">
                      Comprehensive
                      <br />
                      Warranty
                    </span>
                  </div>
                </div>
                <div className="w-full rounded-[14px] bg-white px-3 py-2.5 text-center text-optimist-black">
                  <span className="block text-[15px] font-semibold leading-none">
                    10 years
                  </span>
                  <span className="block text-[12px] text-black/50">
                    Compressor Warranty
                  </span>
                </div>
              </m.div>
            </div>

            {/* One tap away — app */}
            <m.div variants={fadeUp} className={`${CARD} min-h-[390px]`}>
              <Image
                src={BEDSHEET}
                alt=""
                aria-hidden="true"
                width={430}
                height={300}
                className="pointer-events-none absolute bottom-0 left-0 h-auto w-full object-contain"
              />
              <Image
                src={PHONE}
                alt="Optimist app controlling the AC from a phone"
                width={400}
                height={420}
                sizes="(min-width: 1024px) 260px, 60vw"
                className="absolute -bottom-2 right-5 h-auto w-[58%] object-contain"
              />
              <div className="absolute inset-x-0 top-0 p-7">
                <p className="font-display text-[24px] font-semibold leading-[1.2]">
                  <span className="text-optimist-blue-hero">One tap away</span>
                  <br />
                  <span className="text-optimist-black">
                    Always in your
                    <br />
                    pocket.
                  </span>
                </p>
              </div>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
