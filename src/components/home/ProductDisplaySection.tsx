"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { formatPrice } from "@/lib/shopify";
import { ASSETS } from "@/lib/assets";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import type { HomeProductDisplayContent } from "@/lib/shopify";
import PincodeModal from "@/components/ui/PincodeModal";
import { useGetItNow } from "@/components/home/useGetItNow";

const BG_GRID = "/newHomepage/Background%20pattern.webp";

// No-cost EMI is shown over a 12-month tenure (see /home build decisions).
const EMI_TENURE_MONTHS = 12;

interface ProductDisplaySectionProps {
  content: HomeProductDisplayContent | null;
}

export function ProductDisplaySection({ content }: ProductDisplaySectionProps) {
  const {
    variant,
    showPincodeModal,
    isBuyNowLoading,
    handleGetItNow,
    handleConfirmed,
    closeModal,
  } = useGetItNow();

  const price = variant?.price ?? 0;
  const emiMonthly = price ? Math.round(price / EMI_TENURE_MONTHS) : 0;

  const [tonValue, tonUnit = "Ton"] = (variant?.name ?? "1.4 Ton").split(/\s+/);

  const subtitle = content?.subtitle ?? "Designed right for India.";
  const title = content?.title ?? "Buy your Optimist";
  const features = content?.features ?? [];

  return (
    <section className="relative overflow-hidden bg-white py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Heading */}
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
            {subtitle}
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-3 font-display text-[48px] leading-[56px] font-medium text-[#212121]"
          >
            {title}
          </m.h2>
        </m.div>

        {/* AC + price card */}
        <div className="relative mt-8">
          {/* AC product image, overlapping the top of the card */}
          <m.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex justify-center"
          >
            <Image
              src={ASSETS.acHeroDesktop}
              alt="Optimist 1.4 Ton 5 Star Inverter Split AC"
              width={900}
              height={600}
              sizes="(min-width: 1024px) 700px, 80vw"
              className="h-auto w-full max-w-[700px] object-contain"
            />
          </m.div>

          {/* Card */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent(0.1)}
            className="relative -mt-[120px] overflow-hidden rounded-[28px] border border-black/[0.06] bg-white px-9 pb-9 pt-[150px] shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)]"
          >
            {/* Faint grid behind the product imagery */}
            <Image
              src={BG_GRID}
              alt=""
              aria-hidden="true"
              width={1100}
              height={500}
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-auto w-full select-none opacity-40"
            />

            <div className="relative z-10 grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
              {/* Tonnage */}
              <m.div variants={fadeUp}>
                <p className="font-display font-semibold leading-none text-optimist-black">
                  <span className="text-[76px]">{tonValue}</span>{" "}
                  <span className="text-[32px]">{tonUnit}</span>
                </p>
                <p className="mt-3 text-[18px] text-black/55">
                  Cools upto 400 sq. ft.
                </p>
              </m.div>

              {/* Price + CTA */}
              <m.div variants={fadeUp} className="lg:text-right">
                <p className="font-display text-[30px] font-semibold leading-none text-optimist-black">
                  From {formatPrice(String(emiMonthly))}/mo
                </p>
                <p className="mt-2 text-[15px] text-black/55">
                  with no-cost EMI &amp; instant savings or{" "}
                  <span className="font-semibold text-optimist-black">
                    {formatPrice(String(price))}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={handleGetItNow}
                  className="mt-5 inline-flex h-[58px] w-full items-center justify-center rounded-full text-[18px] font-semibold text-white shadow-[0_10px_28px_-8px_rgba(52,120,246,0.6)] transition-transform duration-200 hover:-translate-y-0.5 lg:w-[460px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #2563EB 0%, #4DA2FF 100%)",
                  }}
                >
                  Get it now
                </button>
              </m.div>
            </div>
          </m.div>
        </div>

        {/* Feature strip */}
        {features.length > 0 && (
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mt-5 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white"
          >
            <div className="grid grid-cols-1 divide-y divide-black/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center justify-center gap-4 px-7 py-6">
                  {feature.iconUrl ? (
                    <Image
                      src={feature.iconUrl}
                      alt={feature.iconAlt ?? feature.title}
                      width={48}
                      height={48}
                      className="h-10 w-10 flex-shrink-0 object-contain"
                    />
                  ) : null}
                  <div className="leading-tight">
                    <p className="text-[16px] font-semibold text-optimist-black">
                      {feature.title.trim()}
                    </p>
                    <p className="text-[15px] text-black/50">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </m.div>
        )}
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
