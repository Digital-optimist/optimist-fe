"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Play } from "lucide-react";
import ASSETS from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface UserExperience {
  id: number;
  name: string;
  date: string;
  quote: string;
  rating: number;
  image: string;
}

// =============================================================================
// Data
// =============================================================================

const userExperiences: UserExperience[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    date: "Mar 20, 2025",
    quote: "Cooling remains steady during extreme heat",
    rating: 4.8,
    image: ASSETS.rohanMehta,
  },
  {
    id: 2,
    name: "Ananya Rao",
    date: "Apr 15, 2025",
    quote: "At an extreme 48°C outdoor temperature, the AC still delivered unwavering cooling.",
    rating: 4.8,
    image: ASSETS.ananyaRao,
  },
  {
    id: 3,
    name: "Kunal Shah",
    date: "May 10, 2025",
    quote: "The airflow stayed smooth and stable without any power dips.",
    rating: 4.8,
    image: ASSETS.kunalShah,
  },
];

// =============================================================================
// Star Rating Component
// =============================================================================

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Image
        src={ASSETS.goldenStar}
        alt="Star"
        width={20}
        height={20}
        className="w-5 h-5 md:w-6 lg:w-10 md:h-6 lg:h-10"
      />
      <span className="font-semibold text-sm md:text-base lg:text-2xl text-gray-900">
        {rating} Rated
      </span>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function UserExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
    if (footerRef.current) {
      gsap.set(footerRef.current, { opacity: 0, y: 20 });
    }
    const cards = carouselRef.current?.querySelectorAll(".experience-card");
    if (cards) {
      gsap.set(cards, { opacity: 0, y: 40 });
    }
  }, []);

  useGSAP(
    () => {
      // Batch all animations into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Header animation
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0
      );

      // Cards stagger animation
      const cards = carouselRef.current?.querySelectorAll(".experience-card");
      if (cards) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
          },
          0.2
        );
      }

      // Footer animation
      tl.to(
        footerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          force3D: true,
        },
        0.5
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#F5F5F5] py-12 md:py-16 lg:py-20 overflow-x-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 md:mb-12 will-change-[transform,opacity]"
        >
          <h2 className="font-display text-2xl md:text-4xl lg:text-[40px] font-bold text-gray-900">
            What users experience in real homes
          </h2>
        </div>

        {/* Experience Cards Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {userExperiences.map((experience) => (
            <div
              key={experience.id}
              className="experience-card flex-shrink-0 w-[306px] md:w-[600px] lg:w-[753px] bg-white rounded-2xl md:rounded-[36px] overflow-hidden border border-black/[0.12] will-change-[transform,opacity]"
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Mobile Layout - Stacked */}
              <div className="md:hidden">
                {/* Image Container */}
                <div className="relative h-[378px] w-full rounded-3xl overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={experience.name}
                    fill
                    className="object-cover"
                    sizes="306px"
                  />
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 44.76%, rgba(0, 0, 0, 1) 104.52%)"
                    }}
                  />

                  {/* Name, Date & Play Button */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-white font-semibold text-xl">
                        {experience.name}
                      </p>
                      <p className="text-white/60 text-base font-medium">
                        {experience.date}
                      </p>
                    </div>
                    <button className="w-[54px] h-[54px] bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play
                        className="w-6 h-6 text-gray-900 ml-1"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="p-4 flex flex-col gap-6">
                  <p className="text-gray-900 font-semibold text-base leading-relaxed">
                    "{experience.quote}"
                  </p>
                  <StarRating rating={experience.rating} />
                </div>
              </div>

              {/* Desktop Layout - Side by Side */}
              <div className="hidden md:flex h-[311px]">
                {/* Image Container */}
                <div className="relative w-[280px] lg:w-[311px] flex-shrink-0 rounded-[32px] overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={experience.name}
                    fill
                    className="object-cover"
                    sizes="311px"
                  />
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 44.76%, rgba(0, 0, 0, 1) 104.52%)"
                    }}
                  />

                  {/* Name, Date & Play Button */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-white font-semibold text-base">
                        {experience.name}
                      </p>
                      <p className="text-white/60 text-sm font-medium">
                        {experience.date}
                      </p>
                    </div>
                    <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play
                        className="w-5 h-5 text-gray-900 ml-0.5"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                  <p className="text-gray-900 font-normal italic text-2xl lg:text-[32px] leading-normal">
                    "{experience.quote}"
                  </p>
                  <StarRating rating={experience.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <p
          ref={footerRef}
          className="text-center mt-8 md:mt-12 text-base md:text-lg lg:text-xl font-medium text-gray-900 will-change-[transform,opacity]"
        >
          These outcomes are noticed during everyday use,{" "}
          <span className="text-[#3478F6]">not just on day one</span>
        </p>
      </div>
    </section>
  );
}
