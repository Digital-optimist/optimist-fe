"use client";

import { memo, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface FeaturedLogo {
  src: string;
  alt: string;
}

// =============================================================================
// Constants
// =============================================================================

const FEATURED_LOGOS: FeaturedLogo[] = [
  { src: ASSETS.featuredAngelone, alt: "AngelOne" },
  { src: ASSETS.featuredNews18, alt: "News18" },
  { src: ASSETS.featuredPti, alt: "Press Trust of India" },
  { src: ASSETS.featuredInc42, alt: "Inc42" },
  { src: ASSETS.featuredRediff, alt: "Rediff" },
  { src: ASSETS.featuredEntrackr, alt: "Entrackr" },
  { src: ASSETS.featuredEntrepreneur, alt: "Entrepreneur" },
];

// =============================================================================
// Logo Card Component
// =============================================================================

const LogoCard = memo(function LogoCard({ logo }: { logo: FeaturedLogo }) {
  return (
    <div className="bg-[rgba(0,0,0,0.04)] rounded-xl md:rounded-[20px] shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] flex items-center justify-center overflow-hidden">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={160}
        height={160}
        className="w-[70%] h-[70%] object-contain"
        draggable={false}
      />
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const AsFeaturedSection = memo(function AsFeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
    }
    if (trackRef.current) {
      gsap.set(trackRef.current, { opacity: 0 });
    }
  }, []);

  useGSAP(
    () => {
      if (!trackRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      tl.to(
        trackRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.2,
      );

      const track = trackRef.current;
      const totalWidth = track.scrollWidth / 2;

      gsap.to(track, {
        x: -totalWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: number) => {
            return x % totalWidth;
          }),
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-8 md:py-12 lg:py-16 bg-[#00000005] overflow-hidden"
      aria-label="As featured on"
    >
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Header */}
        <p
          ref={headerRef}
          className="font-display font-semibold text-xl sm:text-2xl md:text-[32px] lg:text-[36px] text-black text-center mb-6 md:mb-10 px-4 md:px-6 lg:px-12"
        >
          As featured on
        </p>

        {/* Marquee Container */}
        <div className="relative">
          {/* Left fade gradient */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[60px] sm:w-[120px] md:w-[200px] lg:w-[289px] z-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(255,255,255) 20%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Right fade gradient */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[60px] sm:w-[120px] md:w-[200px] lg:w-[289px] z-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgb(255,255,255) 20%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Scrolling Track */}
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center will-change-transform"
          >
            {/* Double the logos for seamless infinite loop */}
            {[...FEATURED_LOGOS, ...FEATURED_LOGOS].map((logo, index) => (
              <LogoCard key={`${logo.alt}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
