"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { ChevronsRight } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const MADE_IN_INDIA = "/newHomepage/Frame%201437256413.webp";
const FACTORY_BG = "/newHomepage/Frame%201437256414.webp";
const OPTIMIST_LOCKUP = "/newHomepage/Blue_Vertical%20Lockup%20+%20R%201.webp";
const TEAM_PHOTO = "/newHomepage/future-team%201.webp";

export function MeetFamilySection() {
  return (
    <section className="relative overflow-hidden bg-white py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Eyebrow + "Get to know the fam" link */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="flex items-center justify-between gap-4"
        >
          <p className="text-[20px] leading-[30px] font-medium text-optimist-blue-hero">
            Meet the Optimist family
          </p>
          <Link
            href="/about"
            className="group flex items-center gap-1.5 text-[20px] leading-[30px] font-[500] text-[#212121] transition-opacity hover:opacity-70"
          >
            Get to know the fam
            <ChevronsRight className="h-5 w-5 transition-transform text-[#BABABA] group-hover:translate-x-0.5" />
          </Link>
        </m.div>

        {/* Title (left) + Made-in-India / 7+ years card (right) */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="mt-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-2"
        >
          <m.h2
            variants={fadeUp}
            className="max-w-[520px] font-display text-[48px] leading-[56px] font-medium text-[#212121]"
          >
            Built by people who were tired of the same old summer.
          </m.h2>

          <m.div
            variants={fadeUp}
            className="flex items-center justify-between gap-6 rounded-[24px] border border-black/[0.07] bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)]"
          >
            <Image
              src={MADE_IN_INDIA}
              alt="Proudly made in India"
              width={300}
              height={150}
              className="h-auto w-[180px] flex-shrink-0 object-contain sm:w-[210px]"
            />
            <div className="text-right">
              <p className="font-display text-[30px] font-semibold leading-none text-optimist-black">
                7+ Years
              </p>
              <p className="ml-auto mt-2 max-w-[190px] text-[15px] leading-[1.4] text-black/55">
                of Engineering research before a single unit was built
              </p>
            </div>
          </m.div>
        </m.div>

        {/* Bottom strip: goal (cream) + logo (factory bg) + team photo */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-6 grid grid-cols-1 overflow-hidden rounded-[24px] border border-black/[0.07] md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr]"
        >
          {/* The goal */}
          <div className="flex flex-col bg-[#FBF6DB] p-8">
            <p className="flex items-center gap-2 font-display text-[18px] font-semibold text-optimist-black">
              <span aria-hidden="true">🎯</span> The goal
            </p>
            <p className="mt-4 text-[20px] font-medium leading-[1.4] text-optimist-black">
              A product that actually works as hard as you do, in the climate
              you actually live in.
            </p>
          </div>

          {/* Optimist lockup over faint factory backdrop */}
          <div className="relative flex min-h-[240px] items-center justify-center bg-white p-8">
            <Image
              src={FACTORY_BG}
              alt=""
              aria-hidden="true"
              fill
              sizes="300px"
              className="pointer-events-none select-none object-cover"
            />
            <Image
              src={OPTIMIST_LOCKUP}
              alt="Optimist"
              width={320}
              height={140}
              className="relative z-10 h-auto w-[62%] max-w-[240px] object-contain"
            />
          </div>

          {/* Team photo */}
          <div className="relative min-h-[240px]">
            <Image
              src={TEAM_PHOTO}
              alt="The Optimist team"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}
