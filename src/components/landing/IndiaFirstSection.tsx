"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function IndiaFirstSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Batch all animations into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Left card animation
      tl.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0
      );

      // Flower image animation
      tl.fromTo(
        flowerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.1
      );

      // Badges staggered animation
      const badgeCards = badgesRef.current?.querySelectorAll(".badge-card");
      if (badgeCards) {
        tl.fromTo(
          badgeCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          },
          0.2
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-4 md:py-6 overflow-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop: 2-column grid, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 md:gap-6">
          {/* Left Column - Dark Product Card */}
          <div
            ref={leftCardRef}
            className="relative bg-optimist-black rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[420px] md:min-h-[520px] lg:min-h-[620px]"
          >
            {/* Content */}
            <div className="relative z-10 p-6 md:p-10 lg:p-12">
              {/* Headline */}
              <h2 className="font-display text-[32px] leading-[36px] md:text-[48px] md:leading-[52px] lg:text-[56px] lg:leading-[60px] font-bold mb-4 md:mb-6">
                <span className="text-optimist-blue-hero">
                  Built-in gas level
                  <br />
                  indicator.
                </span>
              </h2>
              <p className="font-display text-[24px] leading-[28px] md:text-[32px] md:leading-[36px] lg:text-[40px] lg:leading-[44px] font-bold text-optimist-headline mb-6 md:mb-8">
                See when service is needed.
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3 md:gap-4">
                <Link
                  href="/products"
                  className="btn-buy-now hero-btn-mobile md:hero-btn-desktop inline-flex items-center justify-center text-white"
                >
                  Buy Now
                </Link>
                <Link
                  href="#why-optimist"
                  className="btn-why-optimist hero-btn-mobile md:hero-btn-desktop inline-flex items-center justify-center text-white"
                >
                  Why Optimist ?
                </Link>
              </div>
            </div>

            {/* AC Image - Positioned at bottom right */}
            <div className="absolute bottom-0 right-[-5%] md:right-[-3%] w-[90%] md:w-[80%] lg:w-[75%]">
              <Image
                src="/ACTilted.png"
                alt="Optimist AC Unit"
                width={800}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Right Column - Flower + Badge Cards */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Flower Image */}
            <div
              ref={flowerRef}
              className="relative bg-white border border-gray-200 rounded-[24px] md:rounded-[32px] overflow-hidden flex-1 min-h-[240px] md:min-h-[300px] lg:min-h-[340px] flex items-center justify-center"
            >
              <Image
                src="/Flower.png"
                alt="Optimist Tree"
                width={400}
                height={400}
                className="object-contain w-[70%] h-auto"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Badge Cards Container */}
            <div ref={badgesRef} className="flex flex-col gap-3 md:gap-4">
              {/* India's 1st Badge Card */}
              <div
                className="badge-card relative rounded-[20px] md:rounded-[24px] overflow-hidden px-5 py-4 md:px-6 md:py-5"
                style={{
                  background:
                    "linear-gradient(135deg, #3478F6 0%, #5BA8E8 50%, #69CDEB 75%, #89D8F0 100%)",
                }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <Image
                    src="/5StarRating.png"
                    alt="5 Star Rating"
                    width={56}
                    height={56}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                  <div>
                    <p className="font-display text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-tight">
                      India&apos;s 1st
                    </p>
                    <p className="text-sm md:text-base text-white/90 font-medium">
                      Highest ISEER
                    </p>
                  </div>
                </div>
              </div>

              {/* 4.8 Rated Badge Card */}
              <div
                className="badge-card relative rounded-[20px] md:rounded-[24px] overflow-hidden px-5 py-4 md:px-6 md:py-5"
                style={{
                  background:
                    "linear-gradient(135deg, #3478F6 0%, #5BA8E8 50%, #69CDEB 75%, #89D8F0 100%)",
                }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <Image
                    src="/GoldenStar.png"
                    alt="Star Rating"
                    width={44}
                    height={44}
                    className="w-10 h-10 md:w-11 md:h-11"
                  />
                  <div>
                    <p className="font-display text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-tight">
                      4.8 rated
                    </p>
                    <p className="text-sm md:text-base text-white/90 font-medium">
                      By those who switched, and stayed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
