"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { ChevronsRight } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import Card from "@/components/home/ui/card";
import { SectionTitle } from "@/components/home/ui/section-title";
import { useApp } from "@/components/home/useApp";

const logoMark = "/figma/optimist-mark.svg";
const heroDecor = "/figma/hero-decor.svg";
const teamVector = "/figma/team-vector.svg";
const madeInIndia = "/figma/made-in-india.svg";
const optimistTeam = "/figma/optimist-team.svg";

// Ported verbatim from optimist-website's MEET THE OPTIMIST FAMILY section.
export function MeetFamilySection() {
  const { isMobile } = useApp();

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 md:pt-50">
      <div className="mx-auto max-w-[1080px]">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="w-full flex flex-col sm:flex-row justify-between gap-4"
        >
          <m.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-[20px] leading-[160%] font-poppins font-normal text-[#3478F6]"
          >
            Meet the Optimist family.
          </m.p>
          <m.div
            variants={fadeUp}
            className="hidden md:flex items-center gap-2 hover:[&>svg]:stroke-[#6A6A6A] cursor-pointer"
          >
            <p className="text-base sm:text-lg md:text-xl leading-[160%] font-medium">
              Get to know the team
            </p>
            <ChevronsRight className="size-5 sm:size-6 stroke-[#BABABA]" />
          </m.div>
        </m.div>

        <div className="mt-5 flex flex-col lg:flex-row justify-between gap-6 lg:gap-10">
          <SectionTitle
            title={`Built by people who\nlike their summers a\nlot cooler.`}
            className="text-start w-fit [&>h2]:mt-0"
          />
          <Card className="mt-0 lg:mt-3 p-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div className="h-[165px] w-full md:w-[333px] relative bg-[#F9FBFF] border-b sm:border-b-0 sm:border-e border-[#E9E9E9] sm:rounded-e-3xl">
              <img
                src={madeInIndia}
                alt="Made in India"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[280px] md:max-w-none"
              />
            </div>
            <div className="px-5 sm:pr-8 md:pr-10 pb-6 sm:pb-0 flex md:flex-col justify-between gap-x-3">
              <p className="text-center sm:text-end text-3xl sm:text-[28px] md:text-[32px] leading-none md:leading-[140%] font-solar font-bold text-nowrap">
                2+ Years
              </p>
              <p className="md:text-end text-sm md:text-base leading-[140%] md:leading-[160%] font-light text-[#6A6A6A] md:whitespace-pre-line">{`of engineering\nresearch before a\nsingle unit was built.`}</p>
            </div>
          </Card>
        </div>

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="mt-6 md:mt-10 h-auto md:h-[246px] w-full flex flex-col md:flex-row justify-between border border-[#E9E9E9] rounded-3xl overflow-hidden"
        >
          <m.div
            variants={fadeUp}
            className="w-full md:w-[280px] py-5 sm:py-6 md:py-[30px] px-5 sm:px-8 md:px-10 flex flex-col gap-4 sm:gap-5 md:gap-6 bg-[#FFFCDC] border-b md:border-b-0 md:border-r border-[#E9E9E9]"
          >
            <p className="text-sm sm:text-base leading-[160%] font-bold">
              🎯 The goal
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-[130%] -tracking-[2%] font-light md:whitespace-pre-line">{`A product that${!isMobile ? "\n" : " "}actually works as\nhard as you do, in${!isMobile ? "\n" : " "}the climate you\nactually live in.`}</p>
          </m.div>

          <m.div
            variants={fadeUp}
            className="w-full md:w-[279px] relative border-b md:border-b-0 md:border-r border-[#E9E9E9] min-h-[150px] md:min-h-0 overflow-hidden"
          >
            <img
              src={teamVector}
              className="absolute inset-0 opacity-40 mx-auto -mt-24 w-full"
            />
            <div className="relative h-full flex flex-col items-center justify-center gap-2 sm:gap-3 py-6 md:py-0">
              <img src={logoMark} alt="logo" className="w-7 sm:w-8 md:w-9 h-auto" />
              <img
                src={heroDecor}
                alt="optimist"
                className="h-8 sm:h-9 md:h-10 w-auto"
              />
            </div>
          </m.div>

          <m.div variants={fadeUp} className="w-fit">
            <img src={optimistTeam} alt="The Optimist team" className="w-full h-fit" />
          </m.div>
        </m.div>

        <div className="mt-6 flex items-center justify-center gap-2 md:hidden hover:[&>svg]:stroke-[#6A6A6A] cursor-pointer">
          <p className="text-base sm:text-lg md:text-xl leading-[160%] font-medium">
            Get to know the team
          </p>
          <ChevronsRight className="size-5 sm:size-6 stroke-[#BABABA]" />
        </div>
      </div>
    </section>
  );
}
