"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Future Section - "The Future We See" with team image and vision statement
// =============================================================================

// Four pillars of the future
const features = [
  {
    icon: ASSETS.shieldSlash,
    title: "Energy-efficient design",
    description:
      "World-class efficiency that reduces consumption from day one.",
  },
  {
    icon: ASSETS.leafIcon,
    title: "Sustained performance",
    description: "Consistent cooling at extreme temperatures, year after year.",
  },
  {
    icon: ASSETS.hourglass,
    title: "Complete transparency",
    description:
      "Real-time visibility into energy use, gas levels, and system health.",
  },
  {
    icon: ASSETS.hourglass,
    title: "Long-term value",
    description: "Built to perform for years. Designed to cost less over time.",
  },
];

export function FutureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

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

      // Title animation
      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Image animation
      tl.from(
        imageRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0.2,
      );

      // Card animation
      tl.from(
        cardRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0.3,
      );

      // Features animation
      if (featuresRef.current) {
        const featureItems =
          featuresRef.current.querySelectorAll(".feature-item");
        tl.from(
          featureItems,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.5,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-hidden max-w-[100vw]"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 overflow-hidden">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[40px] text-black text-center tracking-[1.6px] mb-8 md:mb-12 lg:mb-16 will-change-[transform,opacity]"
        >
          What&apos;s <span className="text-[#3478F6]">Ahead</span>
        </h2>

        {/* Container for overlapping image and card */}
        <div className="relative w-full overflow-hidden">
          {/* Team Image - overlaps the blue card */}
          <div
            ref={imageRef}
            className="relative z-10 w-[92%] max-w-[1172px] mx-auto aspect-[1172/498] rounded-[20px] md:rounded-[28px] lg:rounded-[32px] overflow-hidden will-change-[transform,opacity]"
          >
            <Image
              src={ASSETS.futureTeam}
              alt="Optimist team members in a collaborative workspace"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1172px"
              priority
            />
          </div>

          {/* Blue Gradient Card - positioned to be overlapped by image */}
          <div
            ref={cardRef}
            className="relative w-full md:max-w-[1360px] mx-auto rounded-[20px] md:rounded-[28px] lg:rounded-[32px] overflow-hidden will-change-[transform,opacity] -mt-[40px] md:-mt-[60px] lg:-mt-[74px]"
            style={{
              background:
                "linear-gradient(180deg, #3478F6 0%, #1E4690 129.18%)",
            }}
          >
            {/* Extra padding at top to account for the overlapping image */}
            <div className="px-4 md:px-12 lg:px-16 pt-[60px] md:pt-[80px] lg:pt-[114px] pb-10 md:pb-16 lg:pb-[114px]">
              {/* Vision Statement */}
              <p className="font-medium italic md:not-italic text-[24px] md:text-[30px] lg:text-[36px] text-white text-center leading-[1.4] max-w-full md:max-w-[900px] mx-auto mb-10 md:mb-16 lg:mb-[50px]">
                We see a future where cooling becomes a true partner to energy
                saving.
              </p>

              {/* Features Grid */}
              <div
                ref={featuresRef}
                className="relative w-full overflow-hidden"
              >
                {/* Mobile 2x2 Grid */}
                <div className="md:hidden w-full">
                  {/* Top Row */}
                  <div className="grid grid-cols-2 gap-x-4 pb-6">
                    {features.slice(0, 2).map((feature, index) => (
                      <div
                        key={index}
                        className="feature-item flex flex-col items-center gap-3 min-w-0"
                      >
                        {/* Icon */}
                        <div className="w-8 h-8 relative">
                          <Image
                            src={feature.icon}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-1 text-center text-white w-full">
                          <p className="font-semibold text-[14px] leading-normal break-words">
                            {feature.title}
                          </p>
                          <p className="font-normal text-[12px] leading-normal text-[#FFFFFF99] break-words">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Horizontal Divider */}
                  <div className="w-full h-[1px] bg-white/30 my-2" />

                  {/* Bottom Row */}
                  <div className="grid grid-cols-2 gap-x-4 pt-6">
                    {features.slice(2, 4).map((feature, index) => (
                      <div
                        key={index + 2}
                        className="feature-item flex flex-col items-center gap-3 min-w-0"
                      >
                        {/* Icon */}
                        <div className="w-8 h-8 relative">
                          <Image
                            src={feature.icon}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-1 text-center text-white w-full">
                          <p className="font-semibold text-[14px] leading-normal break-words">
                            {feature.title}
                          </p>
                          <p className="font-normal text-[12px] leading-normal text-[#FFFFFF99] break-words">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Row Layout */}
                <div className="hidden md:grid md:grid-cols-4 md:px-6 lg:px-12 items-start">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="relative flex items-start justify-center"
                    >
                      {/* Vertical Divider - positioned at the left edge of each item except first */}
                      {index > 0 && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-[80px] bg-white/30" />
                      )}

                      {/* Feature Item */}
                      <div className="feature-item flex flex-col items-center gap-4 px-4 lg:px-6">
                        {/* Icon */}
                        <div className="w-10 h-10 relative">
                          <Image
                            src={feature.icon}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-2 text-center text-white">
                          <p className="font-semibold text-[18px] lg:text-[20px] leading-normal">
                            {feature.title}
                          </p>
                          <p className="font-normal text-[#FFFFFF99] text-[14px] lg:text-[16px] leading-normal max-w-[180px]">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FutureSection;
