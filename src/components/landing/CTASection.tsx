"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Single animation - this is already just one ScrollTrigger, just optimize it
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true, // Only animate once for better performance
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-4 md:py-6 overflow-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Card with Video Background */}
        <div
          ref={cardRef}
          className="relative rounded-[24px] md:rounded-[32px] overflow-hidden"
        >
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/TreeCool.mp4" type="video/mp4" />
          </video>

          {/* Dark Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              {/* Left Content */}
              <div className="flex-1">
                {/* Headline */}
                <h2 className="font-display text-[32px] leading-[36px] md:text-[48px] md:leading-[52px] lg:text-[56px] lg:leading-[60px] font-bold text-optimist-headline mb-4 md:mb-6">
                  <span className="md:hidden">
                    Cools more.
                    <br />
                    Uses less.
                  </span>
                  <span className="hidden md:inline">
                    Cools more. Uses less.
                  </span>
                </h2>

                {/* Badges */}
                <div className="flex items-center gap-4 md:gap-6">
                  {/* ISEER Badge */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <Image
                      src="/5StarRating.png"
                      alt="5 Star Rating"
                      width={40}
                      height={40}
                      className="w-8 h-8 md:w-10 md:h-10"
                    />
                    <div>
                      <p className="hero-badge-title text-white">
                        Highest ISEER
                      </p>
                      <p className="hero-badge-subtitle text-white/70">
                        In India
                      </p>
                    </div>
                  </div>

                  {/* User Rating Badge */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <Image
                      src="/GoldenStar.png"
                      alt="Star Rating"
                      width={32}
                      height={32}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                    <div>
                      <p className="hero-badge-title text-white">4.8 rated</p>
                      <p className="hero-badge-subtitle text-white/70">
                        by early users
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Button */}
                <div className="mt-6 md:hidden">
                  <Link
                    href="/products"
                    className="btn-buy-now inline-flex items-center justify-center w-full py-3 rounded-full text-white font-semibold text-sm"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>

              {/* Desktop Button - Right Side */}
              <div className="hidden md:block">
                <Link
                  href="/products"
                  className="btn-buy-now inline-flex items-center justify-center px-10 py-4 rounded-full text-white font-semibold text-base"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
