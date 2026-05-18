"use client";

import { memo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls, type Variants } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { viewportOnce } from "@/lib/motion-variants";

interface FeaturedLogo {
  src: string;
  alt: string;
}

const FEATURED_LOGOS: FeaturedLogo[] = [
  { src: ASSETS.featuredAngelone, alt: "AngelOne" },
  { src: ASSETS.featuredNews18, alt: "News18" },
  { src: ASSETS.featuredPti, alt: "Press Trust of India" },
  { src: ASSETS.featuredInc42, alt: "Inc42" },
  { src: ASSETS.featuredRediff, alt: "Rediff" },
  { src: ASSETS.featuredEntrackr, alt: "Entrackr" },
  { src: ASSETS.featuredEntrepreneur, alt: "Entrepreneur" },
];

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const trackReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

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

export const AsFeaturedSection = memo(function AsFeaturedSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeControls = useAnimationControls();

  // Kick off the infinite marquee once we know the track width.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    if (totalWidth <= 0) return;

    marqueeControls.start({
      x: [0, -totalWidth],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" },
      },
    });
  }, [marqueeControls]);

  return (
    <section
      className="w-full py-8 md:py-12 lg:py-16 bg-[#FAFAFA] overflow-hidden"
      aria-label="As featured on"
    >
      <div className="w-full max-w-[1440px] mx-auto">
        <motion.p
          className="font-display font-semibold text-xl sm:text-2xl md:text-[32px] lg:text-[36px] text-black text-center tracking-wide md:tracking-normal mb-6 md:mb-10 px-4 md:px-6 lg:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={headerReveal}
        >
          As featured on
        </motion.p>

        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={trackReveal}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-[60px] sm:w-[120px] md:w-[200px] lg:w-[289px] z-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #FAFAFA 20%, rgba(250,250,250,0) 100%)",
            }}
          />

          <div
            className="absolute right-0 top-0 bottom-0 w-[60px] sm:w-[120px] md:w-[200px] lg:w-[289px] z-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to left, #FAFAFA 20%, rgba(250,250,250,0) 100%)",
            }}
          />

          <motion.div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center will-change-transform"
            animate={marqueeControls}
          >
            {[...FEATURED_LOGOS, ...FEATURED_LOGOS].map((logo, index) => (
              <LogoCard key={`${logo.alt}-${index}`} logo={logo} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});
