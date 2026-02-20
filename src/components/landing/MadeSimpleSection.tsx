"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useWaitlist } from "@/contexts/WaitlistContext";

const LEFT_CARD_MOBILE = "/images/Frame 2085662956.png";
const LEFT_CARD_DESKTOP = "/images/Frame 20856629561.png";
const RIGHT_CARD_MOBILE = "/images/Frame 2085662536.png";
const RIGHT_CARD_DESKTOP = "/images/Frame 20856625361.png";

export function MadeSimpleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  useLayoutEffect(() => {
    if (leftCardRef.current) {
      gsap.set(leftCardRef.current, { opacity: 0, x: -40 });
    }
    if (rightCardRef.current) {
      gsap.set(rightCardRef.current, { opacity: 0, x: 40 });
    }
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(
        leftCardRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      tl.to(
        rightCardRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.1,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-4 md:py-6 overflow-x-hidden"
      style={{
        background:
          "linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(236, 236, 236, 0.2), rgba(236, 236, 236, 0.2))",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          {/* Left Card - Blue gradient with headline */}
          <div
            ref={leftCardRef}
            className="relative rounded-[32px] md:rounded-[40px] overflow-hidden will-change-[transform,opacity]"
          >
            {/* Desktop Background */}
            <div className="hidden lg:block relative w-full h-full">
              <Image
                src={LEFT_CARD_DESKTOP}
                alt=""
                fill
                className="object-cover"
                sizes="33vw"
                aria-hidden="true"
              />
            </div>

            {/* Mobile Background */}
            <div
              className="lg:hidden relative w-full"
              style={{ aspectRatio: "341/409" }}
            >
              <Image
                src={LEFT_CARD_MOBILE}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                aria-hidden="true"
              />
            </div>

            {/* Text overlay */}
            <div className="absolute inset-0 z-10 p-6 md:p-8 lg:p-10 pt-8 md:pt-10 lg:pt-12">
              <h2 className="font-display text-[36px] leading-[1.1] sm:text-[40px] md:text-[44px] lg:text-[54px] font-bold text-white whitespace-nowrap">
                Made minimal.
                <br />
                Nothing more,
                <br />
                nothing less.
              </h2>
            </div>
          </div>

          {/* Right Card - Remote section (full image + CTA overlay) */}
          <div
            ref={rightCardRef}
            className="relative  overflow-hidden will-change-[transform,opacity]"
          >
            {/* Desktop */}
            <div
              className="hidden md:block relative w-full"
              style={{ aspectRatio: "900/580" }}
            >
              <Image
                src={RIGHT_CARD_DESKTOP}
                alt="The Optimist Remote - Designed just right. Chill like regular AC's can't imagine."
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {/* CTA overlay - positioned to match Figma (left:31px, ~30% from top) */}
              <div
                className="absolute z-10"
                style={{ left: "3.4%", top: "30%" }}
              >
                <button
                  onClick={openModal}
                  className="btn-buy-now inline-flex items-center justify-center w-fit px-8 md:px-10 py-3 md:py-3.5 rounded-full text-[#FFFCDC] font-semibold text-sm md:text-base"
                >
                  Join the Waitlist
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div
              className="md:hidden relative w-full"
              style={{ aspectRatio: "341/647" }}
            >
              <Image
                src={RIGHT_CARD_MOBILE}
                alt="The Optimist Remote - Designed just right. Chill like regular AC's can't imagine."
                fill
                className="object-cover"
                sizes="100vw"
              />
              {/* CTA overlay - positioned at bottom matching Figma */}
              <div
                className="absolute z-10"
                style={{ left: "4.4%", bottom: "4.3%" }}
              >
                <button
                  onClick={openModal}
                  className="btn-buy-now inline-flex items-center justify-center w-fit px-8 py-3.5 rounded-full text-[#FFFCDC] font-semibold text-base"
                >
                  Join the Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
