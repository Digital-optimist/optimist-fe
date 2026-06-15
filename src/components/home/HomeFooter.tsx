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

const footerNavItems = [
  { id: "about", title: "About Us", href: "/about" },
  { id: "contact", title: "Contact Sales", href: "/contact-us" },
  { id: "support-feedback", title: "Support / Feedback", href: "/contact-us" },
];

const policyItems = [
  { id: "privacy", title: "Privacy Policy", href: "/privacy-policy" },
  { id: "terms", title: "Terms & Conditions", href: "/terms" },
];

const socials = [
  {
    id: "youtube",
    icon: <Youtube />,
    href: "https://www.youtube.com/@optimistAC",
  },
  {
    id: "instagram",
    icon: <Instagram />,
    href: "https://www.instagram.com/optimist.ac/",
  },
  { id: "twitter", icon: <Twitter />, href: "https://twitter.com/optimist_AC" },
];

// Ported from optimist-website's FOOTER, with the previous build's navigation
// actions restored: nav + policy links point at real routes.
export function HomeFooter() {
  return (
    <footer id="about" className="relative">
      <img src={footerBg} alt="bg" className="absolute bottom-0 w-full" />
      <div className="relative max-w-[1440px] mx-auto pb-8 sm:pb-12 md:pb-16 px-4">
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
              className="h-10 sm:h-12 md:h-15 w-auto"
            />
            <img
              src={heroDecor}
              alt="optimist"
              aria-hidden
              className="h-9 sm:h-[42px] md:h-[49px] w-auto"
            />
          </m.div>

          <m.div
            variants={fadeUp}
            className="mt-6 sm:mt-8 md:mt-10 w-full flex flex-col md:flex-row justify-between md:items-end gap-y-8"
          >
            <p className="text-[32px] sm:text-[48px] md:text-[64px] leading-none font-solar font-medium whitespace-pre-line">{`Be the coolest\nhome on the block`}</p>

            <div className="flex items-start gap-4 md:flex-col md:items-end md:justify-end">
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
            className="mt-8 sm:mt-10 md:mt-15 w-full flex flex-col-reverse md:flex-row justify-between md:items-end gap-y-8"
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

            <div className="flex items-start gap-4 md:flex-col md:items-end">
              {policyItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="font-[Poppins] text-sm sm:text-base leading-[1.5em] text-[#6A6A6A] transition-colors hover:text-[#212121]"
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
