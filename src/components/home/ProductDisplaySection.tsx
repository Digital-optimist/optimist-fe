"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { GradientButton } from "@/components/home/ui/gradient-button";
import { SectionTitle } from "@/components/home/ui/section-title";
import { useGetItNow } from "@/components/home/useGetItNow";
import PincodeModal from "@/components/ui/PincodeModal";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";
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
// `hp_product_display` metaobject. Per the catalogue we show ONLY the single
// real 1.4-ton variant (as before): tonnage from `variant.name`, live price/EMI
// from Shopify, and the shared pincode → buyNow CTA.
export function ProductDisplaySection({ content }: ProductDisplaySectionProps) {
  const {
    variant,
    showPincodeModal,
    isBuyNowLoading,
    handleGetItNow,
    handleConfirmed,
    closeModal,
  } = useGetItNow();

  const price = variant?.price ?? 40000;
  const emiMonthly = Math.round(price / EMI_TENURE_MONTHS);
  const [tonValue, tonUnit = "Ton"] = (variant?.name ?? "1.4 Ton").split(/\s+/);

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
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent(0.12)}
            className="overflow-hidden rounded-[24px] rounded-b-none border border-[#E9E9E9] bg-white p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10"
          >
            <m.div variants={fadeUp} className="flex flex-col gap-1">
              <p className="text-[20px] sm:text-[24px] md:text-[28px] leading-none font-solar font-medium">
                <span className="text-[48px] sm:text-[64px] md:text-[80px]">
                  {tonValue}{" "}
                </span>
                {tonUnit}
              </p>
              <p className="text-[17px] sm:text-[19px] md:text-[21px] leading-[140%] font-light text-[#6A6A6A]">
                Cools upto 400 sq. ft.
              </p>
            </m.div>

            <m.div
              variants={fadeUp}
              className="w-full md:w-auto md:text-right"
            >
              <p className="text-[22px] sm:text-[25px] md:text-[27px] leading-none font-solar font-medium">
                From ₹{inr(emiMonthly)}/mo
              </p>
              <p className="mt-1 text-sm sm:text-base leading-[140%] font-light text-[#6A6A6A]">
                with no-cost EMI & instant savings or{" "}
                <span className="font-medium">₹{inr(price)}</span>
              </p>
              <GradientButton
                onClick={handleGetItNow}
                disabled={isBuyNowLoading}
                className="mt-4 md:mt-5 h-12 sm:h-14 md:h-15 w-full md:w-[320px] text-[17px] sm:text-[19px] md:text-[21px]"
              >
                {isBuyNowLoading ? "Opening checkout…" : "Get it now"}
              </GradientButton>
            </m.div>
          </m.div>

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

      <PincodeModal
        isOpen={showPincodeModal}
        onClose={closeModal}
        onConfirm={handleConfirmed}
        confirmLabel="Proceed to Checkout →"
        loadingLabel="Opening checkout…"
        isConfirmLoading={isBuyNowLoading}
      />
    </section>
  );
}
