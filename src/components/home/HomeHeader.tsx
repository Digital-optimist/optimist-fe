"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { GradientButton } from "@/components/home/ui/gradient-button";
import { useApp } from "@/components/home/useApp";
import { useGetItNow } from "@/components/home/useGetItNow";
import PincodeModal from "@/components/ui/PincodeModal";
import { cn } from "@/lib/cn";

const LOGO_MARK = "/figma/optimist-mark.svg";

const navItems = [
  // { id: "product", href: "/products", title: "Product" },
  { id: "about-us", href: "/about", title: "About Us" },
];

// optimist-website Header (relative → sticky frosted pill on scroll, via
// `isScrollHead`), with the previous build's actions wired back: nav → real
// routes, logo → /home, and "Get it now" → the shared pincode → buyNow flow.
export function HomeHeader() {
  const { isScrollHead } = useApp();
  const {
    showPincodeModal,
    isBuyNowLoading,
    handleGetItNow,
    handleConfirmed,
    closeModal,
  } = useGetItNow();

  return (
    <>
      <header
        className={cn(
          "relative",
          isScrollHead &&
            "max-w-[1160px] mx-2.5 md:mx-auto sticky top-2.5 z-50 bg-white/70 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-lg rounded-3xl",
        )}
        style={
          isScrollHead
            ? {
                border: "0px solid",
                borderImageSource:
                  "linear-gradient(90.56deg, #ffffff -0.15%, rgba(255, 255, 255, 0) 17.81%, rgba(255, 255, 255, 0) 22.75%, rgba(255, 255, 255, 0) 86.13%, #ffffff 100.15%)",
                borderImageSlice: 1,
              }
            : undefined
        }
      >
        <m.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "mx-auto h-15 sm:h-18 md:h-20 w-full max-w-[1160px] flex items-center justify-between gap-4 sm:gap-6 md:gap-8",
            isScrollHead
              ? "px-2 md:px-9.5"
              : "pt-[22px] md:pt-14 h-fit px-5 md:px-10",
          )}
        >
          <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-sm sm:text-base font-light text-[#6A6A6A] transition-colors hover:text-[#212121]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <Link
            href="/home"
            aria-label="Optimist home"
            className="shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_MARK}
              alt="Optimist"
              className={cn(
                "h-10 sm:h-12 md:h-22 w-fit lg:-ml-8 cursor-pointer",
                isScrollHead && "h-10",
              )}
            />
          </Link>

          <GradientButton
            onClick={handleGetItNow}
            disabled={isBuyNowLoading}
            className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base"
          >
            {isBuyNowLoading ? "Opening…" : "Get it now"}
          </GradientButton>
        </m.div>
      </header>

      <PincodeModal
        isOpen={showPincodeModal}
        onClose={closeModal}
        onConfirm={handleConfirmed}
        confirmLabel="Proceed to Checkout →"
        loadingLabel="Opening checkout…"
        isConfirmLoading={isBuyNowLoading}
      />
    </>
  );
}
