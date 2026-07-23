"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { m } from "framer-motion";
import Instagram from "@/components/figma/instagram-icon";
import Twitter from "@/components/figma/twitter-icon";
import Youtube from "@/components/figma/youtube-icon";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const footerBg = "/figma/footer-bg.svg";
const logoMark = "/figma/optimist-mark.svg";
const heroDecor = "/figma/hero-decor.svg";

// B2B footer links (from the design). Primary links point at real routes; the
// commercial-specific ones (Contact Sales / Support) reuse the contact page.
const footerNavItems = [
  { id: "about", title: "About Us", href: "/about" },
  { id: "contact-sales", title: "Contact Sales", href: "/contact-us" },
  { id: "support-feedback", title: "Support / Feedback", href: "/contact-us" },
];

const policyItems = [
  { id: "privacy", title: "Privacy Policy", href: "/privacy-policy" },
  { id: "terms", title: "Terms & Conditions", href: "/terms" },
];

const socials = [
  { id: "youtube", icon: <Youtube />, href: "https://www.youtube.com/@optimistAC" },
  {
    id: "instagram",
    icon: <Instagram />,
    href: "https://www.instagram.com/optimist.ac/",
  },
  { id: "twitter", icon: <Twitter />, href: "https://twitter.com/optimist_AC" },
];

// B2B-adapted footer. Same structure + styling as the site-wide HomeFooter
// (frosted background art, big ABC Solar Display headline, nav + socials +
// policy links), with the commercial copy shown in the design.
export function BusinessFooter() {
  return (
    <footer
      className="relative overflow-hidden text-[#212121]"
      style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
    >
      {/* Figma footer bg is 1440×500 fading white→mint top→bottom. Keep it
          ≥ its native size and bottom-anchored, and give the footer the
          design's 500px height (74px top padding) so the gradient fades in
          from the white section above instead of starting with a hard edge. */}
      <img
        src={footerBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 w-full min-w-[1440px] max-w-none -translate-x-1/2 select-none"
      />
      <div className="relative max-w-[1440px] mx-auto pt-10 md:pt-[74px] pb-8 sm:pb-12 md:pb-16 px-4">
        <m.div
          className="mx-auto h-fit w-full max-w-[1080px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.08)}
        >
          <m.div variants={fadeUp} className="flex items-center gap-1.5">
            <img
              src={logoMark}
              alt="logo"
              aria-hidden
              className="h-8 sm:h-12 md:h-15 w-auto"
            />
            <img
              src={heroDecor}
              alt="optimist"
              aria-hidden
              className="h-[26px] sm:h-[42px] md:h-[49px] w-auto"
            />
          </m.div>

          <m.div
            variants={fadeUp}
            className="mt-10 md:mt-10 w-full flex flex-col md:flex-row justify-between md:items-end gap-y-10"
          >
            <p className="text-[32px] sm:text-[48px] md:text-[64px] leading-none font-solar font-medium whitespace-pre-line">{`Let’s make your buildings\nmore efficient`}</p>

            <div className="flex flex-col items-start gap-3 md:gap-4 md:items-end md:justify-end">
              {footerNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm sm:text-base md:text-[21px] leading-none hover:text-[#3478F6] transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </m.div>

          <m.div
            variants={fadeUp}
            className="mt-12 md:mt-15 w-full flex flex-col-reverse md:flex-row justify-between md:items-end gap-y-10"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <ul className="flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 sm:size-10 flex items-center justify-center bg-white hover:bg-gray-50 border border-[#E9E9E9] rounded-full shadow-[0_2px_8px_0_#0000001A] cursor-pointer"
                  >
                    {s.icon}
                  </a>
                ))}
              </ul>
              <p className="text-sm sm:text-base leading-none font-light text-[#999999]">
                © 2026 Optimist. All Rights Reserved
              </p>
            </div>

            {/* Figma: stacked, right-aligned, 16px #999 */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8 md:flex-col md:items-end md:gap-4">
              {policyItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="font-[Poppins] text-sm sm:text-base leading-none text-[#999999] transition-colors hover:text-[#212121]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </m.div>
        </m.div>
      </div>
    </footer>
  );
}
