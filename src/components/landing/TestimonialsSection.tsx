"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Play } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "David Prague",
    date: "Aug 20, 2025",
    rating: "4.8",
    quote:
      '"At an extreme 48°C outdoor temperature, the AC still delivered unwavering cooling. The airflow stayed smooth and stable without any power dips. "',
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Vania Islam",
    date: "Mar 20, 2025",
    rating: "4.9",
    quote:
      '"The energy efficiency is remarkable. Our electricity bill dropped significantly while maintaining perfect cooling throughout the day."',
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Rahul Sharma",
    date: "Feb 15, 2025",
    rating: "4.8",
    quote:
      '"Installation was seamless and the smart features are incredible. I can control everything from my phone even when traveling."',
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

      // Header animation
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0
      );

      // Cards stagger animation
      const cards = carouselRef.current?.querySelectorAll(".testimonial-card");
      if (cards) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          },
          0.2 // Start slightly after header
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#F8F8FA] py-8 md:py-12 lg:py-16 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10 md:mb-14">
          <p className="text-sm md:text-base text-gray-500 mb-2 md:mb-3">
            Hear it from our customers!
          </p>
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Real Homes,{" "}
            <span className="text-optimist-blue-primary">Real Performance</span>
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card flex-shrink-0 w-[85%] md:w-[600px] lg:w-[700px] bg-white rounded-[24px] overflow-hidden shadow-sm"
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Mobile Layout - Stacked */}
              <div className="md:hidden">
                {/* Video Thumbnail */}
                <div className="relative aspect-[4/5]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="85vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Name & Date */}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-semibold text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-white/70 text-sm">{testimonial.date}</p>
                  </div>

                  {/* Play Button */}
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Play
                      className="w-5 h-5 text-gray-900 ml-0.5"
                      fill="currentColor"
                    />
                  </button>
                </div>

                {/* Quote Content */}
                <div className="p-5">
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    {testimonial.quote}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/GoldenStar.png"
                      alt="Rating"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {testimonial.rating} Rated
                    </span>
                  </div>
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
                      className="object-cover"
                      sizes="320px"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Name & Date */}
                    <div className="absolute bottom-5 left-5">
                      <p className="text-white font-semibold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-white/70 text-sm">
                        {testimonial.date}
                      </p>
                    </div>

                    {/* Play Button */}
                    <button className="absolute bottom-5 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play
                        className="w-5 h-5 text-gray-900 ml-0.5"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
                  <p className="text-gray-700 text-lg lg:text-xl leading-relaxed mb-6">
                    {testimonial.quote}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/GoldenStar.png"
                      alt="Rating"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="text-base font-semibold text-gray-900">
                      {testimonial.rating} Rated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
