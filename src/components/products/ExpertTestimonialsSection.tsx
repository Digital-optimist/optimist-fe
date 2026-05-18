"use client";

import { memo, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationControls,
  useInView,
  type Variants,
} from "framer-motion";

type MarqueeControls = ReturnType<typeof useAnimationControls>;
import type { ExpertTestimonialItem } from "@/lib/shopify";
import { viewportOnce } from "@/lib/motion-variants";

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

// =============================================================================
// Types & Data
// =============================================================================

interface ExpertTestimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  image: string;
}

const DesktopCard = memo(function DesktopCard({
  testimonial,
}: {
  testimonial: ExpertTestimonial;
}) {
  return (
    <div className="w-[580px] xl:w-[634px] shrink-0 bg-white border border-black/[0.12] rounded-[20px] overflow-hidden flex">
      {/* Photo side */}
      <div className="w-[220px] xl:w-[265px] relative shrink-0 rounded-[20px] overflow-hidden self-stretch">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 265px, 220px"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 44.76%, rgb(0,0,0) 104.52%)",
          }}
        />
      </div>
      {/* Text side */}
      <div className="flex-1 flex flex-col justify-between px-6 xl:px-8 py-6 xl:py-7">
        <p className="text-[15px] xl:text-[17px] text-black leading-[1.55]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="flex flex-col gap-1 mt-5">
          <span className="font-semibold text-sm xl:text-base text-black">
            {testimonial.name}
          </span>
          {testimonial.company && (
            <span className="text-sm xl:text-base text-black/56">
              {testimonial.company}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// Mobile Card — compact horizontal card matching mobile Figma
// =============================================================================

const MobileCard = memo(function MobileCard({
  testimonial,
}: {
  testimonial: ExpertTestimonial;
}) {
  return (
    <div className="bg-white border border-black/[0.12] rounded-[20px] flex items-stretch gap-2 overflow-hidden pr-3 shrink-0">
      <div className="w-[92px] sm:w-[99px] rounded-[14px] overflow-hidden shrink-0 m-[3px] relative">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes="99px"
        />
      </div>
      <div className="flex flex-col justify-between w-[195px] sm:w-[210px] py-3 text-xs leading-[1.5]">
        <p className="text-black line-clamp-4">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="flex flex-col mt-2">
          <span className="font-semibold text-black">{testimonial.name}</span>
          {testimonial.company && (
            <span className="text-black/56">{testimonial.company}</span>
          )}
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

interface ExpertTestimonialsSectionProps {
  experts?: ExpertTestimonialItem[];
}

export const ExpertTestimonialsSection = memo(
  function ExpertTestimonialsSection({
    experts,
  }: ExpertTestimonialsSectionProps) {
    const TESTIMONIALS: ExpertTestimonial[] = useMemo(() => {
      if (experts && experts.length > 0) {
        return experts.map((e, i) => ({
          id: `expert-${i}`,
          name: e.name,
          company: e.profession,
          quote: e.review,
          image: e.imageUrl || "",
        }));
      }
      return [];
    }, [experts]);

    const ROW_2_ORDER = useMemo(() => {
      const len = TESTIMONIALS.length;
      if (len <= 1) return [0];
      return Array.from({ length: len }, (_, i) => (i + 2) % len);
    }, [TESTIMONIALS.length]);

    const sectionRef = useRef<HTMLElement>(null);
    const desktopTrackRef = useRef<HTMLDivElement>(null);
    const mobileTrack1Ref = useRef<HTMLDivElement>(null);
    const mobileTrack2Ref = useRef<HTMLDivElement>(null);
    const isPausedRef = useRef(false);
    const desktopControls = useAnimationControls();
    const mobile1Controls = useAnimationControls();
    const mobile2Controls = useAnimationControls();
    const isInView = useInView(sectionRef, { amount: 0.01, once: false });

    const playRightward = useCallback(
      (controls: MarqueeControls, trackEl: HTMLDivElement, duration: number) => {
        const totalWidth = trackEl.scrollWidth / 2;
        if (totalWidth <= 0) return;
        controls.start({
          x: [-totalWidth, 0],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          },
        });
      },
      [],
    );

    const playLeftward = useCallback(
      (controls: MarqueeControls, trackEl: HTMLDivElement, duration: number) => {
        const totalWidth = trackEl.scrollWidth / 2;
        if (totalWidth <= 0) return;
        controls.start({
          x: [0, -totalWidth],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          },
        });
      },
      [],
    );

    const startAll = useCallback(() => {
      if (desktopTrackRef.current)
        playRightward(desktopControls, desktopTrackRef.current, 60);
      if (mobileTrack1Ref.current)
        playRightward(mobile1Controls, mobileTrack1Ref.current, 45);
      if (mobileTrack2Ref.current)
        playLeftward(mobile2Controls, mobileTrack2Ref.current, 60);
    }, [
      desktopControls,
      mobile1Controls,
      mobile2Controls,
      playRightward,
      playLeftward,
    ]);

    const stopAll = useCallback(() => {
      desktopControls.stop();
      mobile1Controls.stop();
      mobile2Controls.stop();
    }, [desktopControls, mobile1Controls, mobile2Controls]);

    useEffect(() => {
      if (isInView && !isPausedRef.current) startAll();
      else stopAll();
    }, [isInView, startAll, stopAll, TESTIMONIALS]);

    const handleMouseEnter = useCallback(() => {
      isPausedRef.current = true;
      stopAll();
    }, [stopAll]);

    const handleMouseLeave = useCallback(() => {
      isPausedRef.current = false;
      if (isInView) startAll();
    }, [isInView, startAll]);

    const row2Items = ROW_2_ORDER.map((i) => TESTIMONIALS[i]);

    return (
      <section
        ref={sectionRef}
        className="w-full py-10 md:py-14 lg:py-16 bg-[#f5f5f5] overflow-hidden"
        aria-label="Industry experts testimonials"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-10 md:mb-14 lg:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={headerReveal}
        >
          <h2 className="font-display font-semibold text-2xl md:text-4xl lg:text-[40px] text-center text-black leading-tight tracking-wide md:tracking-normal">
            <span className="text-[#3478F6]">Reviewed by </span>
            Industry Experts
          </h2>
        </motion.div>

        <motion.div
          className="hidden lg:block relative"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={trackReveal}
        >
          <motion.div
            ref={desktopTrackRef}
            className="flex gap-6 items-stretch will-change-transform"
            animate={desktopControls}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <DesktopCard key={`dt-${t.id}-${i}`} testimonial={t} />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:hidden flex flex-col gap-6 relative"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={trackReveal}
        >
          <motion.div
            ref={mobileTrack1Ref}
            className="flex gap-6 items-stretch will-change-transform"
            animate={mobile1Controls}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <MobileCard key={`mt1-${t.id}-${i}`} testimonial={t} />
            ))}
          </motion.div>
          <motion.div
            ref={mobileTrack2Ref}
            className="flex gap-6 items-stretch will-change-transform"
            animate={mobile2Controls}
          >
            {[...row2Items, ...row2Items].map((t, i) => (
              <MobileCard key={`mt2-${t.id}-${i}`} testimonial={t} />
            ))}
          </motion.div>
        </motion.div>
      </section>
    );
  },
);
