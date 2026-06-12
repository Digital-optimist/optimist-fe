"use client";

import Image from "next/image";
import { m } from "framer-motion";
import {
  fadeUp,
  fadeRight,
  staggerParent,
  viewportOnce,
} from "@/lib/motion-variants";
import { SectionHeader } from "@/components/home/SectionHeader";
import type { HomeAppFeaturesContent, HomeFeatureCard } from "@/lib/shopify";

function FeatureCard({ card }: { card: HomeFeatureCard }) {
  // Title carries an inline newline in the metaobject ("Control your Bills\nSave
  // even more!") — split so the headline keeps its two-line shape.
  const [line1, ...rest] = card.title.split("\n");
  const line2 = rest.join(" ");

  return (
    <m.div
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-[20px] border border-black/[0.08] bg-white p-6"
    >
      {card.iconUrl ? (
        <Image
          src={card.iconUrl}
          alt={card.iconAlt ?? line1}
          width={44}
          height={44}
          className="h-10 w-10 flex-shrink-0 object-contain"
        />
      ) : null}
      <div>
        <h3 className="font-display text-[18px] font-medium leading-[1.25] text-optimist-black">
          {line1}
          {line2 ? (
            <>
              <br />
              {line2}
            </>
          ) : null}
        </h3>
        {card.subtitle ? (
          <p className="mt-1.5 text-[14px] leading-[1.4] text-black/50">
            {card.subtitle}
          </p>
        ) : null}
      </div>
    </m.div>
  );
}

interface AppFeaturesSectionProps {
  content: HomeAppFeaturesContent | null;
}

export function AppFeaturesSection({ content }: AppFeaturesSectionProps) {
  if (!content) return null;

  const { title, subtitle, description, mainImageUrl, mainImageAlt, features } =
    content;

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20 lg:py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Centered header */}
        <SectionHeader
          eyebrow={subtitle}
          title={title}
          description={description || undefined}
          className="mx-auto max-w-[680px]"
          descriptionClassName="max-w-[560px]"
        />

        {/* Two-column: 2x3 feature grid (left) + phone mockup (right) */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 sm:mt-14 lg:grid-cols-[1fr_minmax(360px,460px)]">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent(0.08)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {features.map((card, i) => (
              <FeatureCard key={i} card={card} />
            ))}
          </m.div>

          {mainImageUrl ? (
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeRight}
              className="relative flex h-full items-center justify-center self-stretch"
            >
              <Image
                src={mainImageUrl}
                alt={mainImageAlt ?? "Optimist app on a smartphone"}
                width={690}
                height={905}
                sizes="(min-width: 1024px) 460px, 80vw"
                className="h-auto w-full max-w-[460px] object-contain"
              />
            </m.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
