"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { GradientButton } from "@/components/home/ui/gradient-button";
import { SectionTitle } from "@/components/home/ui/section-title";
import { useGetItNow } from "@/components/home/useGetItNow";
import { ASSETS } from "@/lib/assets";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";
import type { DisplayVariant } from "@/contexts/ProductsContext";
import type { HomeProductDisplayContent } from "@/lib/shopify";

const thermometer = "/figma/temp.svg";
const calendar = "/figma/calendar.svg";
const umbrella = "/figma/umbrella.svg";

// No-cost EMI is shown over a 12-month tenure.
const EMI_TENURE_MONTHS = 12;
const inr = (n: number) => n.toLocaleString("en-IN");

interface ProductDisplaySectionProps {
  content: HomeProductDisplayContent | null;
}

// optimist-website "Buy your Optimist" section. Copy comes from the
// `hp_product_display` metaobject. Shows the purchasable sizes (1.4 & 1.5 Ton)
// as side-by-side cards: the AC product render sits on top, overlapping the
// price card; tonnage from `variant.name`, live price/EMI from Shopify, and the
// shared buyNow CTA.
export function ProductDisplaySection({ content }: ProductDisplaySectionProps) {
  const { variant, getVariantByTonnage, isBuyNowLoading, buyVariant } =
    useGetItNow();

  // Both sizes come straight from Shopify now (1.4 is the flagship `variant`;
  // 1.5 resolves via getVariantByTonnage) — no hardcoded prices. Render a card
  // per size that actually exists.
  const cards = [getVariantByTonnage("1.4") ?? variant, getVariantByTonnage("1.5")]
    .filter((v): v is DisplayVariant => Boolean(v))
    .map((v) => ({
      key: v.tonnage,
      name: v.name,
      price: v.price,
      onBuy: () => buyVariant(v),
    }));

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 md:pt-50">
      <div className="mx-auto max-w-[1080px]">
        <SectionTitle
          eyebrow={
            content?.subtitle ??
            "Designed right for India. Cools 120 to 300 sft rooms"
          }
          title={content?.title ?? "Buy your Optimist."}
        />

        <div className="mt-6 md:mt-10">
          <div className="relative">
            {/* AC product render, centred over the top of the price card */}
            <m.img
              src={ASSETS.acHeroDesktop}
              alt="Optimist 1.4 Ton 5 Star Inverter Split AC"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-auto block w-full max-w-[420px] sm:max-w-[540px] md:max-w-[620px] object-contain px-4"
            />

            {/* Price cards (two sizes), tucked under the AC */}
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerParent(0.12)}
              className="relative -mt-[40px] sm:-mt-[80px] md:-mt-[100px] overflow-hidden rounded-[24px] rounded-b-none border border-[#E9E9E9] bg-white pt-[52px] sm:pt-[100px] md:pt-[124px] pb-6 sm:pb-8 md:pb-10"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0 md:divide-x divide-[#E9E9E9]">
                {cards.map((card) => {
                  const [tonValue, tonUnit = "Ton"] = card.name.split(/\s+/);
                  const emiMonthly = Math.round(card.price / EMI_TENURE_MONTHS);
                  return (
                    <m.div
                      key={card.key}
                      variants={fadeUp}
                      className="flex flex-col gap-5 px-6 sm:px-8 md:px-10"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-[20px] sm:text-[24px] md:text-[28px] leading-none font-solar font-medium">
                          <span className="text-[48px] sm:text-[64px] md:text-[80px]">
                            {tonValue}{" "}
                          </span>
                          {tonUnit}
                        </p>
                        <p className="text-[17px] sm:text-[19px] md:text-[21px] leading-[140%] font-light text-[#6A6A6A]">
                          5 Star Inverter Split AC
                        </p>
                      </div>

                      <div>
                        <p className="text-[22px] sm:text-[25px] md:text-[27px] leading-none font-solar font-medium">
                          From ₹{inr(emiMonthly)}/mo
                        </p>
                        <p className="mt-1 text-sm sm:text-base leading-[140%] font-light text-[#6A6A6A]">
                          with no-cost EMI & instant savings or{" "}
                          <span className="font-medium">₹{inr(card.price)}</span>
                        </p>
                        <GradientButton
                          onClick={card.onBuy}
                          disabled={isBuyNowLoading}
                          className="mt-4 md:mt-5 h-12 sm:h-14 md:h-15 w-full text-[17px] sm:text-[19px] md:text-[21px]"
                        >
                          {isBuyNowLoading ? "Opening checkout…" : "Get it now"}
                        </GradientButton>
                      </div>
                    </m.div>
                  );
                })}
              </div>
            </m.div>
          </div>

          <div
            className={cn(
              "h-full mx-auto py-2 flex items-start justify-between border border-t-0 border-[#E9E9E9] rounded-3xl rounded-t-none divide-x divide-[#E9E9E9]",
              "md:mt-0 md:py-5 md:h-[100px] md:w-full md:items-center md:gap-0",
            )}
          >
            <div className="flex-1 px-1.5 md:px-10 py-2 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5">
              <img
                src={thermometer}
                alt=""
                aria-hidden
                className="h-8 sm:h-10 w-fit shrink-0"
              />
              <div className="text-center md:text-left">
                <p className="text-sm sm:text-base leading-[140%] font-light whitespace-pre-line">
                  <span className="font-bold">30 Days Return</span>
                  <br />
                  No Question Asked
                </p>
              </div>
            </div>
            <div className="flex-1 px-1.5 md:px-10 py-2 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5">
              <img
                src={calendar}
                alt=""
                aria-hidden
                className="h-8 sm:h-10 w-fit shrink-0"
              />
              <div className="text-center md:text-left">
                <p className="text-sm sm:text-base leading-[140%] font-light whitespace-pre-line">
                  <span className="font-bold">48 Hours</span> Delivery &
                  <br />
                  Installation
                </p>
              </div>
            </div>
            <div className="flex-1 px-1.5 md:px-10 py-2 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5">
              <img
                src={umbrella}
                alt=""
                aria-hidden
                className="h-8 sm:h-10 w-fit shrink-0"
              />
              <div className="text-center md:text-left">
                <p className="text-sm sm:text-base leading-[140%] font-light whitespace-pre-line">
                  <span className="font-bold">5-year</span>
                  <br />
                  warranty period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
