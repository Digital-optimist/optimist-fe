"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const FAMILY_PHOTO = "/business/testimonial-family.jpg";
const PATTERN = "/business/testimonial-pattern.svg";

// Figma node 1:585 — "Real People. Real Summers." Left 48px title, right
// intro paragraph, then three 333px columns: two stacked quote cards, a photo
// card, and the dark #0E0E0E "45+" stat card washed with the giant palm-mark
// pattern. Rating chip: mint #AEFFD8, rounded 10, ABC Solar Bold 14.
// (The mock repeats the same Krishnakanth card twice — the second card
// carries a different customer instead.)

function RatingRow({ name, city }: { name: string; city: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 items-center rounded-[10px] bg-[#AEFFD8] px-2 font-solar text-[14px] font-bold leading-none text-[#212121]">
        4.8
      </span>
      <span className="flex items-center gap-1 whitespace-nowrap">
        <span className="font-solar text-[16px] font-medium leading-none text-[#212121]">
          {name}
        </span>
        <span className="text-[14px] leading-[1.4] text-[#6A6A6A]">
          , {city}
        </span>
      </span>
    </div>
  );
}

function QuoteCard({
  name,
  city,
  quote,
}: {
  name: string;
  city: string;
  quote: string;
}) {
  return (
    <div className="flex flex-1 flex-col rounded-[24px] border border-[#E9E9E9] bg-white px-10 pt-7 pb-8 lg:min-h-[188px]">
      <RatingRow name={name} city={city} />
      <p className="mt-4 max-w-[253px] text-[20px] leading-[1.2] text-[#212121] md:text-[24px]">
        {quote}
      </p>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10 py-14 md:py-[100px]">
      {/* Header — title left, intro right (Figma: intro top-aligned with title) */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.1)}
        className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10"
      >
        <div>
          <m.p
            variants={fadeUp}
            className="text-lg font-medium leading-[1.6] text-[#3478F6] md:text-[20px]"
          >
            Real People. Real Summers.
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-3 max-w-[521px] font-solar text-[30px] font-medium leading-[1.2] text-[#212121] sm:text-[38px] md:mt-5 md:text-[48px]"
          >
            We could tell you how good it is. But they&apos;ll do it better.
          </m.h2>
        </div>
        <m.p
          variants={fadeUp}
          className="max-w-[427px] text-sm leading-[1.6] text-[#6A6A6A] md:shrink-0 md:basis-[427px] md:pt-[52px] md:text-[16px]"
        >
          From bankers in Gurgaon to engineers in Hyderabad &mdash; here&apos;s
          what a summer with Optimist actually feels like.
        </m.p>
      </m.div>

      {/* Cards — Figma: three 333px columns, 40px gaps, 417px tall */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.08)}
        className="mt-10 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 md:gap-10 lg:grid-cols-3"
      >
        {/* Column 1 — two stacked quote cards */}
        <m.div variants={fadeUp} className="flex flex-col gap-5 md:gap-10">
          <QuoteCard
            name="Krishnakanth"
            city="Hyderabad"
            quote="Walked in after work to a perfectly cool room."
          />
          <QuoteCard
            name="Megha S."
            city="Bengaluru"
            quote="Quiet, fast — and the bills actually dropped."
          />
        </m.div>

        {/* Column 2 — photo testimonial */}
        <m.div
          variants={fadeUp}
          className="flex flex-col rounded-[24px] border border-[#E9E9E9] bg-white p-10 pt-[34px]"
        >
          <div className="h-[200px] w-full overflow-hidden rounded-[16px]">
            <img
              src={FAMILY_PHOTO}
              alt="An Optimist customer family at home"
              className="size-full object-cover"
            />
          </div>
          <div className="mt-[15px]">
            <RatingRow name="Rahul Jain" city="Delhi" />
          </div>
          <p className="mt-4 max-w-[253px] text-[20px] leading-[1.2] text-[#212121] md:text-[24px]">
            Best decision our family made this summer.
          </p>
        </m.div>

        {/* Column 3 — dark stat card with the palm-mark pattern */}
        <m.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-[24px] bg-[#0E0E0E] p-10 text-white md:col-span-2 lg:col-span-1 lg:min-h-[417px]"
        >
          <img
            src={PATTERN}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-[-60%] left-[calc(50%+9px)] h-[1317px] w-[942px] max-w-none -translate-x-1/2 select-none"
          />
          <div className="relative">
            <p className="text-[16px] leading-[1.4]">Already supporting</p>
            <p className="mt-2 font-solar text-[56px] font-medium leading-none text-[#AEFFD8] md:text-[67px]">
              45+
            </p>
            <p className="mt-6 font-solar text-[21px] font-medium leading-[1.2]">
              Commercial project
            </p>
            <p className="mt-4 max-w-[253px] text-[18px] leading-[1.4] md:text-[21px]">
              Across offices, hotels, education and healthcare - louder than
              dry patch.
            </p>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
