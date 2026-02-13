"use client";

import {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Play } from "lucide-react";
import ASSETS from "@/lib/assets";

// Scroll Arrow Icon Component
function ScrollArrowIcon({
  direction = "right",
  size = 20,
}: {
  direction?: "left" | "right";
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const testimonials = [
  {
    id: 1,
    name: "Rohan Mehta",
    location: "Jaipur",
    date: "May 2025",
    quote:
      "We hit 47–48°C outside and the cooling never dropped. Airflow stayed steady through the day. No power dips, no noise spikes.",
    image: ASSETS.rohanMehta,
  },
  {
    id: 2,
    name: "Ananya Rao",
    location: "Bengaluru",
    date: "April 2025",
    quote:
      "What surprised me wasn't just the cooling. Our electricity bill was noticeably lower than last summer, even with longer usage.",
    image: ASSETS.ananyaRao,
  },
  {
    id: 3,
    name: "Kunal Shah",
    location: "Mumbai",
    date: "June 2025",
    quote:
      "The gas level indicator is a small thing, but it changes everything. I finally know when service is actually needed.",
    image: ASSETS.kunalShah,
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update scroll button states based on active index
  useEffect(() => {
    setCanScrollLeft(activeIndex > 0);
    setCanScrollRight(activeIndex < testimonials.length - 1);
  }, [activeIndex]);

  // Detect which card is most centered on scroll
  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    const cards = container.querySelectorAll(".testimonial-card");
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // Navigate to a specific card
  const scrollToCard = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, testimonials.length - 1));
    const cards = carouselRef.current.querySelectorAll(".testimonial-card");
    const card = cards[targetIndex] as HTMLElement | undefined;
    if (!card) return;

    const container = carouselRef.current;
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Center the card in the container
    const scrollOffset =
      cardRect.left -
      containerRect.left -
      (containerRect.width - cardRect.width) / 2 +
      container.scrollLeft;

    container.scrollTo({
      left: Math.max(0, scrollOffset),
      behavior: "smooth",
    });

    setActiveIndex(targetIndex);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left" ? activeIndex - 1 : activeIndex + 1;
    scrollToCard(newIndex);
  };

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
    const cards = carouselRef.current?.querySelectorAll(".testimonial-card");
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
          once: true, // Only animate once for better performance
        },
      });

      // Header animation - use 'to' since initial state is already set
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

      // Cards stagger animation
      const cards = carouselRef.current?.querySelectorAll(".testimonial-card");
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
          0.2, // Start slightly after header
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#F8F8FA] py-8 md:py-12 lg:py-16 overflow-x-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-10 md:mb-14 will-change-[transform,opacity]"
        >
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Real Stories From{" "}
            <span className="text-optimist-blue-primary">India’s Real AC.</span>
          </h2>
        </div>

        {/* Carousel wrapper with hover arrows */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Scroll Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-3 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 
              w-[48px] h-[48px] md:w-[54px] md:h-[54px] lg:w-[60px] lg:h-[60px] 
              rounded-full bg-white border border-black/[0.12]
              flex items-center justify-center 
              transition-all duration-300 ease-out
              ${isHovered && canScrollLeft ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"}
              ${canScrollLeft ? "text-gray-700 hover:text-[#3478F6] hover:border-[#3478F6]/30 hover:shadow-[0_4px_20px_rgba(52,120,246,0.15)] cursor-pointer" : "text-gray-300 cursor-not-allowed"}
            `}
            style={{ boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)" }}
            aria-label="Scroll left"
          >
            <ScrollArrowIcon direction="left" size={22} />
          </button>

          {/* Right Scroll Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-3 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 
              w-[48px] h-[48px] md:w-[54px] md:h-[54px] lg:w-[60px] lg:h-[60px] 
              rounded-full bg-white border border-black/[0.12]
              flex items-center justify-center 
              transition-all duration-300 ease-out
              ${isHovered && canScrollRight ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3 pointer-events-none"}
              ${canScrollRight ? "text-gray-700 hover:text-[#3478F6] hover:border-[#3478F6]/30 hover:shadow-[0_4px_20px_rgba(52,120,246,0.15)] cursor-pointer" : "text-gray-300 cursor-not-allowed"}
            `}
            style={{ boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)" }}
            aria-label="Scroll right"
          >
            <ScrollArrowIcon direction="right" size={22} />
          </button>

          {/* Testimonials Carousel */}
          <div
            ref={carouselRef}
            onScroll={updateScrollState}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:snap-none"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="testimonial-card flex-shrink-0 w-[85%] md:w-[600px] lg:w-[700px] bg-white rounded-[24px] overflow-hidden shadow-sm snap-center md:snap-align-none"
              >
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden">
                  {/* Video Thumbnail */}
                  <div className="relative aspect-[4/5] rounded-[24px]">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-[24px]"
                      sizes="85vw"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Name & Location */}
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-semibold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-white/70 text-sm">
                        {testimonial.location} · {testimonial.date}
                      </p>
                    </div>

                    {/* Play Button */}
                    {/* <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play
                        className="w-5 h-5 text-gray-900 ml-0.5"
                        fill="currentColor"
                      />
                    </button> */}
                  </div>

                  {/* Quote Content */}
                  <div className="p-5">
                    <p className="text-gray-600 text-base leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>

                {/* Desktop Layout - Side by Side */}
                <div className="hidden md:flex">
                  {/* Video Thumbnail */}
                  <div className="relative w-[280px] lg:w-[320px] flex-shrink-0">
                    <div className="relative h-full min-h-[320px]">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-[24px]"
                        sizes="320px"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 rounded-[36px] bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Name & Location */}
                      <div className="absolute bottom-5 left-5">
                        <p className="text-white font-semibold text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-white/70 text-sm">
                          {testimonial.location} · {testimonial.date}
                        </p>
                      </div>

                      {/* Play Button */}
                      {/* <button className="absolute bottom-5 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <Play
                          className="w-5 h-5 text-gray-900 ml-0.5"
                          fill="currentColor"
                        />
                      </button> */}
                    </div>
                  </div>

                  {/* Quote Content */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
                    <p className="text-gray-700 text-lg lg:text-xl leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
