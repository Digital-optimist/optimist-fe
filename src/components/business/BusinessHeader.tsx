"use client";

import { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { X, Calculator } from "lucide-react";
import { useApp } from "@/components/home/useApp";
import { cn } from "@/lib/cn";

const LOGO_MARK = "/figma/optimist-mark.svg";

// Blue→cyan CTA gradient, matching the site-wide GradientButton exactly. Kept
// as a class string here so the "Request a proposal" CTA can be a real <a>
// (native smooth-scroll to the lead form) rather than a <button>.
const CTA_GRADIENT =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[50px] bg-[linear-gradient(44.96deg,#1265FF_30.07%,#69CDEB_99.77%,#4466FF_136.67%)] font-medium text-white transition-all hover:opacity-90";

// In-page anchor targets (see the section ids on BusinessPageClient). Kept as
// hash links so they work with the site-wide smooth-scroll; each target carries
// a `scroll-mt` offset so the sticky pill doesn't cover the heading.
const navItems = [
  { id: "solutions", href: "#solutions", title: "Solutions" },
  { id: "support", href: "#support", title: "AMC & Support" },
];

// 3-line menu glyph, copied from HomeHeader so the hamburger reads identically
// to the rest of the site.
const ListIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.1875 3.5H11.8125M2.1875 7H11.8125M2.1875 10.5H11.8125"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// B2B-adapted header. Structurally + visually identical to the site-wide
// HomeHeader (relative → frosted sticky pill on scroll via `isScrollHead`,
// Poppins, centred logo), but with the commercial nav, a calculator shortcut
// and a "Request a proposal" CTA that jumps to the lead form.
//   • Desktop (md+): nav links left · centred logo · calculator + CTA right.
//   • Mobile: hamburger left · centred logo · CTA right. The hamburger opens a
//     frosted dropdown of the nav links.
export function BusinessHeader() {
  const { isScrollHead } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header
      className={cn(
        "relative transition-[background-color,box-shadow] duration-300 ease-out",
        isMenuOpen && "z-50",
        isScrollHead &&
          "max-w-[1160px] mx-2.5 md:mx-auto sticky top-2.5 z-50 bg-white/70 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-lg rounded-3xl",
      )}
      style={{
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
        ...(isScrollHead
          ? {
              border: "0px solid",
              borderImageSource:
                "linear-gradient(90.56deg, #ffffff -0.15%, rgba(255, 255, 255, 0) 17.81%, rgba(255, 255, 255, 0) 22.75%, rgba(255, 255, 255, 0) 86.13%, #ffffff 100.15%)",
              borderImageSlice: 1,
            }
          : {}),
      }}
    >
      <m.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "mx-auto w-full max-w-[1160px] flex items-center gap-3 sm:gap-6 md:gap-8",
          isScrollHead
            ? "h-15 sm:h-18 md:h-20 px-3 md:px-9.5"
            : "pt-9 md:pt-14 h-fit px-6 md:px-10",
        )}
      >
        {/* Left: desktop nav links / mobile menu button */}
        <div className="flex flex-1 items-center justify-start gap-6 md:gap-8">
          <nav className="hidden md:flex items-center gap-6 md:gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm sm:text-base font-light text-[#6A6A6A] transition-colors hover:text-[#212121]"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden flex h-9 w-[102px] items-center justify-center gap-2 rounded-full border border-black/[0.15] text-sm font-light text-[#6A6A6A] transition-colors hover:bg-black/[0.04] hover:text-[#212121]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <m.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </m.span>
              ) : (
                <m.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <ListIcon />
                </m.span>
              )}
            </AnimatePresence>
            <span className="leading-none">Menu</span>
          </button>
        </div>

        {/* Center: logo — jumps to the top of the business page */}
        <Link
          href="/business"
          aria-label="Optimist for business"
          className="shrink-0"
          onClick={scrollToTop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_MARK}
            alt="Optimist"
            className={cn(
              "w-fit cursor-pointer transition-[height] duration-300 ease-out",
              isScrollHead ? "h-9 md:h-10" : "h-10 md:h-16",
            )}
          />
        </Link>

        {/* Right: calculator shortcut + "Request a proposal" CTA */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <a
            href="#savings-calculator"
            aria-label="Jump to the savings calculator"
            className="hidden sm:flex h-10 w-13 items-center justify-center rounded-full border border-[#E9E9E9] bg-white text-[#212121] transition-colors hover:bg-black/[0.03]"
          >
            <Calculator className="h-5 w-5" strokeWidth={1.75} />
          </a>

          {/* Full label from sm up; a compact one on phones so the bar
              (Menu · logo · CTA) breathes instead of overflowing. */}
          <a
            href="#lead-form"
            className={cn(CTA_GRADIENT, "h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-base")}
          >
            <span className="sm:hidden">Get proposal</span>
            <span className="hidden sm:inline">Request a proposal</span>
          </a>
        </div>
      </m.div>

      {/* Mobile collapsing menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute left-3 right-3 top-full z-50 mt-2 space-y-1 rounded-2xl border border-black/[0.06] bg-white/95 p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-lg"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={closeMenu}
                className="block rounded-lg px-4 py-3 text-base font-light text-[#6A6A6A] transition-colors hover:bg-black/[0.04] hover:text-[#212121]"
              >
                {item.title}
              </a>
            ))}

            <div className="my-1.5 h-px bg-black/10" />

            <a
              href="#savings-calculator"
              onClick={closeMenu}
              className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-light text-[#6A6A6A] transition-colors hover:bg-black/[0.04] hover:text-[#212121]"
            >
              <Calculator className="h-5 w-5" strokeWidth={1.5} />
              Savings calculator
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
