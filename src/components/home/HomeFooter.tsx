"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact-us", label: "Contact Sales" },
  { href: "/contact-us", label: "Support / Feedback" },
];

const POLICY_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

// Same social URLs the global site footer uses. Design shows an X icon in the
// third slot; per product decision we keep LinkedIn (the real account).
const SOCIAL_LINKS = [
  {
    href: "http://www.youtube.com/@optimistAC",
    icon: Youtube,
    label: "YouTube",
  },
  {
    href: "https://www.instagram.com/optimist.ac?igsh=ajZtaG1xN3ZhZ3Jl&utm_source=qr",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/company/optimist-ac/",
    icon: Linkedin,
    label: "LinkedIn",
  },
];

export function HomeFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Soft pastel gradient: blue tint left, green tint right, white middle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(176,212,238,0.6) 0%, rgba(255,255,255,0) 34%, rgba(255,255,255,0) 60%, rgba(197,233,210,0.6) 100%), #ffffff",
        }}
      />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.08)}
        className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-12 px-6 pb-10 pt-[120px] md:flex-row md:justify-between md:gap-10 md:px-12"
      >
        {/* Left: logo + headline + socials + copyright */}
        <div className="flex flex-col">
          <m.div variants={fadeUp}>
            <Image
              src="/icons/logo-nav.svg"
              alt="Optimist"
              width={180}
              height={36}
              className="h-auto w-[170px]"
            />
          </m.div>

          <m.h2
            variants={fadeUp}
            className="mt-10 font-display leading-[64px] text-[64px] font-[500] text-[#212121]"
          >
            Be the coolest
            <br />
            home on the block
          </m.h2>

          <m.div variants={fadeUp} className="mt-auto pt-16">
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-optimist-blue-hero shadow-[0_8px_20px_-12px_rgba(15,23,42,0.4)] transition-transform hover:-translate-y-0.5"
                >
                  <social.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-[16px] text-black/40">
              © 2026 Optimist. All Rights Reserved
            </p>
          </m.div>
        </div>

        {/* Right: nav links (top) + policy links (bottom), right-aligned */}
        <m.div
          variants={fadeUp}
          className="flex flex-col justify-between gap-16 text-right"
        >
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[20px] font-[400] text-[#212121] transition-opacity hover:opacity-60 md:text-[21px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[18px] text-black/40 transition-colors hover:text-black/70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </m.div>
      </m.div>
    </footer>
  );
}
