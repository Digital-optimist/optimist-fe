"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { GradientButton } from "@/components/home/ui/gradient-button";
import { useApp } from "@/components/home/useApp";
import { useGetItNow } from "@/components/home/useGetItNow";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/cn";

const LOGO_MARK = "/figma/optimist-mark.svg";

// Desktop nav (left of the centred logo). Home is intentionally desktop-omitted
// (the logo is the home affordance there); it only appears in the mobile menu.
const navItems = [
  { id: "product", href: "/products", title: "Product" },
  { id: "about-us", href: "/about", title: "About Us" },
];

// Mobile menu links — mirrors the global layout `Navigation` (Home / Product /
// About Us) so /home's collapsed menu matches the rest of the site.
const mobileNavItems = [
  { id: "home", href: "/home", title: "Home" },
  ...navItems,
];

// 3-line menu glyph, copied from the layout `Navigation` so the hamburger
// reads identically to the / route.
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

// optimist-website Header (relative → sticky frosted pill on scroll, via
// `isScrollHead`).
//   • Desktop (md+): nav links left · centred logo · Login + "Get it now" right.
//   • Mobile: hamburger left · centred logo · "Get it now" right. The hamburger
//     opens a frosted dropdown of Home / Product / About Us / Login.
export function HomeHeader() {
  const { isScrollHead } = useApp();
  const { isBuyNowLoading, handleGetItNow } = useGetItNow();
  const { isAuthenticated, customer } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Login when logged out; the customer's name → /account when logged in.
  const accountHref = isAuthenticated ? "/account" : "/login";
  const accountLabel = isAuthenticated
    ? customer?.firstName || "Account"
    : "Login";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const closeMenu = () => setIsMenuOpen(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header
      className={cn(
        // Fade the frosted-pill background/shadow in as it appears on scroll.
        "relative transition-[background-color,box-shadow] duration-300 ease-out",
        // Lift the whole header above the hero (which is `relative z-10`) while
        // the mobile menu is open, so the dropdown isn't painted underneath it.
        isMenuOpen && "z-50",
        isScrollHead &&
          "max-w-[1160px] mx-2.5 md:mx-auto sticky top-2.5 z-50 bg-white/70 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-lg rounded-3xl",
      )}
      // Poppins is pinned here so the navbar reads identically on every route
      // (the /home page is already Poppins; other pages default to ABC Solar).
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
            ? // Compact fixed-height pill on scroll.
              "h-15 sm:h-18 md:h-20 px-3 md:px-9.5"
            : // At the top the bar grows to fit the logo (h-fit) so it never
              // overflows — the fixed heights above were clipping it.
              "pt-[22px] md:pt-14 h-fit px-6 md:px-10",
        )}
      >
        {/* Left: desktop nav links / mobile hamburger. Both side groups are
            flex-1 so they take equal width and the logo sits at the true
            viewport centre on every breakpoint. */}
        <div className="flex flex-1 items-center justify-start gap-6 md:gap-8">
          <nav className="hidden md:flex items-center gap-6 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "text-sm sm:text-base transition-colors",
                  isActive(item.href)
                    ? "font-medium text-[#212121]"
                    : "font-light text-[#6A6A6A] hover:text-[#212121]",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger (left) — circular bordered button, matching the
              / route */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden flex items-center justify-center rounded-full border border-black/[0.15] p-2.5 text-[#6A6A6A] transition-colors hover:bg-black/[0.04] hover:text-[#212121]"
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
          </button>
        </div>

        {/* Center: logo. On mobile the wide "Get it now" makes a viewport-centred
            logo look pulled right, so it's nudged left a touch to sit at the
            optical centre (desktop keeps the true flex centre). */}
        <Link
          href="/home"
          aria-label="Optimist home"
          className="shrink-0 -translate-x-6 md:translate-x-0"
          onClick={scrollToTop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_MARK}
            alt="Optimist"
            // Sized to sit inside the bar/pill (the old md:h-22 overflowed the
            // frosted pill on scroll).
            className={cn(
              "w-fit cursor-pointer transition-[height] duration-300 ease-out",
              isScrollHead ? "h-9 md:h-10" : "h-10 md:h-16",
            )}
          />
        </Link>

        {/* Right: "Get it now" CTA + (desktop) Login. Gap mirrors the left nav
            (`gap-6 md:gap-8`) so Login↔"Get it now" matches Product↔"About Us". */}
        <div className="flex flex-1 items-center justify-end gap-6 md:gap-8">
          <Link
            href={accountHref}
            className="hidden md:flex items-center gap-2 text-sm sm:text-base font-light text-[#212121] transition-colors hover:text-[#1265FF]"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
            <span className="max-w-[120px] truncate">{accountLabel}</span>
          </Link>

          <GradientButton
            onClick={handleGetItNow}
            disabled={isBuyNowLoading}
            className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base"
          >
            {isBuyNowLoading ? "Opening…" : "Get it now"}
          </GradientButton>
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
            {mobileNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-base transition-colors",
                    active
                      ? "bg-black/[0.05] font-medium text-[#212121]"
                      : "font-light text-[#6A6A6A] hover:bg-black/[0.04] hover:text-[#212121]",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}

            <div className="my-1.5 h-px bg-black/10" />

            <Link
              href={accountHref}
              onClick={closeMenu}
              className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-light text-[#6A6A6A] transition-colors hover:bg-black/[0.04] hover:text-[#212121]"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
              {accountLabel}
            </Link>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
