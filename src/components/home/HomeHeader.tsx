"use client";

import Link from "next/link";
import { m } from "framer-motion";
import PincodeModal from "@/components/ui/PincodeModal";
import { useGetItNow } from "@/components/home/useGetItNow";

// Blue palm-tree mark used as the centered logo. Inlined (rather than the
// cream-filled /icons/palm-tree-mask.svg) so it can render in brand blue on
// the light header without a CSS-mask hack.
export function PalmLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 235 329.943"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M143.192 127.487C162.058 153.564 173.286 182.66 179.421 220.911L150.952 225.562C145.544 191.913 135.845 166.517 119.404 143.947C118.506 142.705 116.591 143.143 116.3 144.628C105.387 205.085 108.128 269.462 125.563 329.943H95.6392C79.8045 270.509 77.04 207.836 86.4973 148.256C86.7398 146.625 84.7998 145.578 83.6116 146.747C70.8807 158.97 57.3496 176.111 46.9951 195.881L21.4606 182.417C34.8462 156.827 54.1487 132.844 73.3784 117.115C74.6394 116.068 73.8876 113.998 72.2629 114.047C48.5956 114.68 29.3174 121.571 11.8822 129.508L0 103.115C21.6061 93.3998 47.2861 84.3666 79.8045 85.1214C81.3564 85.1701 82.1809 83.2222 81.0169 82.1509C71.6567 73.3855 60.2595 66.7141 46.6314 61.9175L56.1371 34.5745C75.9246 41.5137 92.5111 52.0565 105.654 65.9837C106.527 66.9089 108.031 66.6167 108.491 65.4237C117.318 42.3659 128.23 20.4038 141.155 0L165.501 15.5585C155.996 30.6301 147.63 46.6025 140.5 63.2567C139.846 64.7663 141.495 66.2515 142.925 65.448C162.689 54.3452 189.339 43.7051 226.658 35.4754L232.842 63.7193C195.158 72.0707 169.891 82.7839 151.946 93.7163C150.661 94.4954 150.952 96.4433 152.407 96.8572C181.603 105.209 209.659 120.28 235 141.536L216.498 163.717C200.081 149.961 175.783 133.696 145.059 124.809C143.483 124.371 142.222 126.172 143.192 127.487Z"
        fill="#3478F6"
      />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Product", href: "/products" },
  { label: "About Us", href: "/about" },
];

export function HomeHeader() {
  const {
    showPincodeModal,
    isBuyNowLoading,
    handleGetItNow,
    handleConfirmed,
    closeModal,
  } = useGetItNow();

  return (
    <>
      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Floating, centered pill that hovers over the hero */}
        <div className="mx-auto max-w-[1360px] px-4 pt-4 sm:px-6 sm:pt-5">
          <nav className="relative flex h-[76px] items-center justify-between rounded-[32px] border border-white/70 bg-white/70 px-6 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.28)] backdrop-blur-xl backdrop-saturate-150 sm:px-8">
            {/* Left: primary links */}
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[16px] font-medium text-optimist-black/85 transition-colors hover:text-optimist-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Center: palm logo */}
            <Link
              href="/home"
              aria-label="Optimist home"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <PalmLogo className="h-[42px] w-auto" />
            </Link>

            {/* Right: primary CTA */}
            <button
              type="button"
              onClick={handleGetItNow}
              className="rounded-full px-7 py-3 text-[16px] font-semibold text-white shadow-[0_6px_18px_rgba(52,120,246,0.4)] transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(180deg, #5B93FF 0%, #2F6FE8 100%)",
              }}
            >
              Get it now
            </button>
          </nav>
        </div>
      </m.header>

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
