"use client";

import { memo, useRef, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

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

const TESTIMONIALS: ExpertTestimonial[] = [
  {
    id: "veena",
    name: "Veena Srinivasan",
    company: "WELL Labs",
    quote:
      "As urban temperatures soar, we need cooling solutions that help us cope but without the associated climate footprint. Optimist\u2019s AC addresses this critical gap in the market and I am looking forward to getting mine soon!",
    image: "/images/04_Veena Srinivasan.jpg.jpeg",
  },
  {
    id: "shreya",
    name: "Shreya Mishra",
    company: "Solar Square",
    quote:
      "Solving hard problems requires deep conviction. I\u2019m a firm believer in Optimist\u2019s mission to drive real progress. Ashish and Pranav have the right mindset to build something meaningful, and I\u2019m excited to have a ring-side view of their journey.",
    image: "/images/05_Shreya.jpeg",
  },
  {
    id: "vishnu",
    name: "Vishnu Rajeev",
    company: "",
    quote:
      "Optimist is quietly redefining what premium and sustainable should mean \u2014 not just for India, but globally. Ashish and Pranav combine execution speed with deep integrity and a genuine commitment to climate adaptation and the planet. Founders like these don\u2019t just build products \u2014 they build movements.",
    image: "/images/07_Vishnu.jpeg",
  },
  {
    id: "arjun",
    name: "Arjun Gupta",
    company: "Smart Joules",
    quote:
      "Most run away from solving hard problems. Some care more about the consequences of success rather than the probability or pathway. Such is the story of Ashish and his team at Optimist, who are taking a crack at one of the most important global issues with a first principles approach.",
    image: "/images/10_Arjun Gupta.jpg.jpeg",
  },
  {
    id: "tarun",
    name: "Tarun Mehta",
    company: "Ather",
    quote:
      "With a changing environment, cooling at scale is becoming a fundamental need for our society. It\u2019s a hard engineering and manufacturing challenge and we need more teams willing to take on the toughest engineering challenges. I\u2019m backing Optimist because they have the technical depth and the long-term vision needed to solve hard problems that actually matter for our future.",
    image: "/images/15_Tarun.png",
  },
];

const ROW_2_ORDER = [2, 4, 0, 3, 1];

// =============================================================================
// Desktop Card — 634×218 horizontal card with large photo left + text right
// =============================================================================

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
        <p className="text-black line-clamp-5">
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

export const ExpertTestimonialsSection = memo(
  function ExpertTestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const desktopTrackRef = useRef<HTMLDivElement>(null);
    const mobileTrack1Ref = useRef<HTMLDivElement>(null);
    const mobileTrack2Ref = useRef<HTMLDivElement>(null);
    const tweensRef = useRef<gsap.core.Tween[]>([]);

    useLayoutEffect(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 30 });
      }
      [desktopTrackRef, mobileTrack1Ref, mobileTrack2Ref].forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { opacity: 0 });
      });
    }, []);

    useGSAP(
      () => {
        tweensRef.current = [];

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

        [desktopTrackRef, mobileTrack1Ref, mobileTrack2Ref].forEach((ref) => {
          if (ref.current) {
            tl.to(
              ref.current,
              { opacity: 1, duration: 0.8, ease: "power3.out" },
              0.2,
            );
          }
        });

        const setupRightwardMarquee = (
          track: HTMLDivElement,
          duration: number,
        ) => {
          const totalWidth = track.scrollWidth / 2;
          gsap.set(track, { x: -totalWidth });
          const tween = gsap.to(track, {
            x: 0,
            duration,
            ease: "none",
            repeat: -1,
            paused: false,
          });
          tweensRef.current.push(tween);
        };

        const setupLeftwardMarquee = (
          track: HTMLDivElement,
          duration: number,
        ) => {
          const totalWidth = track.scrollWidth / 2;
          gsap.set(track, { x: 0 });
          const tween = gsap.to(track, {
            x: -totalWidth,
            duration,
            ease: "none",
            repeat: -1,
            paused: false,
          });
          tweensRef.current.push(tween);
        };

        if (desktopTrackRef.current) {
          setupRightwardMarquee(desktopTrackRef.current, 60);
        }
        if (mobileTrack1Ref.current) {
          setupRightwardMarquee(mobileTrack1Ref.current, 45);
        }
        if (mobileTrack2Ref.current) {
          setupLeftwardMarquee(mobileTrack2Ref.current, 60);
        }

        // Control animation based on viewport visibility
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => tweensRef.current.forEach((t) => t.play()),
            onLeave: () => tweensRef.current.forEach((t) => t.pause()),
            onEnterBack: () => tweensRef.current.forEach((t) => t.play()),
            onLeaveBack: () => tweensRef.current.forEach((t) => t.pause()),
          },
        });
      },
      { scope: sectionRef },
    );

    const handleMouseEnter = useCallback(() => {
      tweensRef.current.forEach((t) => t.pause());
    }, []);

    const handleMouseLeave = useCallback(() => {
      tweensRef.current.forEach((t) => t.play());
    }, []);

    const row2Items = ROW_2_ORDER.map((i) => TESTIMONIALS[i]);

    return (
      <section
        ref={sectionRef}
        className="w-full py-10 md:py-14 lg:py-16 bg-[#f5f5f5] overflow-hidden"
        aria-label="Industry experts testimonials"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-10 md:mb-14 lg:mb-16 will-change-[transform,opacity]"
        >
          <h2 className="font-display font-semibold text-[32px] lg:text-[40px] text-center text-black leading-tight">
            <span className="text-[#3478F6]">Industry Experts </span>
            Agree too
          </h2>
        </div>

        {/* Desktop Single-Row Marquee (lg+) */}
        <div className="hidden lg:block relative">
          <div
            ref={desktopTrackRef}
            className="flex gap-6 items-stretch will-change-transform"
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <DesktopCard key={`dt-${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Mobile Two-Row Marquee (<lg) */}
        <div className="lg:hidden flex flex-col gap-3 relative">
          {/* Row 1 */}
          <div
            ref={mobileTrack1Ref}
            className="flex gap-3 items-stretch will-change-transform"
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <MobileCard key={`mt1-${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
          {/* Row 2 (different order for visual variety) */}
          <div
            ref={mobileTrack2Ref}
            className="flex gap-3 items-stretch will-change-transform"
          >
            {[...row2Items, ...row2Items].map((t, i) => (
              <MobileCard key={`mt2-${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
    );
  },
);
