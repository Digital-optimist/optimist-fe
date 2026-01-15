"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface Feature {
  id: number;
  badge: {
    icon?: string;
    text: string;
    bgColor: string;
    textColor: string;
  };
  title: string;
  subtitle: string;
  image: string;
  imagePosition?: "left" | "right";
  bgColor?: string;
}

const features: Feature[] = [
  {
    id: 1,
    badge: {
      icon: "⚡",
      text: "First in Class",
      bgColor: "bg-[#FFF8E8]",
      textColor: "text-[#8B7355]",
    },
    title: "In-Built Gas Indicator.",
    subtitle: "Stop paying for refills you don't need.",
    image: "/MainACDesktop.png",
    imagePosition: "right",
    bgColor: "bg-gradient-to-br from-[#F5F5F7] to-[#E8E8EA]",
  },
  {
    id: 2,
    badge: {
      icon: "📋",
      text: "5-Year Warranty",
      bgColor: "bg-[#FFF8E8]",
      textColor: "text-[#8B7355]",
    },
    title: "5 Years",
    subtitle: "Because quality shouldn't need an asterisk.",
    image: "/ACTilted.png",
    imagePosition: "left",
    bgColor: "bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0]",
  },
  {
    id: 3,
    badge: {
      text: "Highest ISEER In India",
      bgColor: "bg-[#FFF4E6]",
      textColor: "text-[#C67D39]",
    },
    title: "Lower bills. Higher comfort.",
    subtitle: "Live Energy Meter, Track consumption as it happens.",
    image: "/MainACDesktop.png",
    imagePosition: "right",
    bgColor: "bg-gradient-to-br from-[#F8F8FA] to-[#EBEBED]",
  },
  {
    id: 4,
    badge: {
      icon: "⚡",
      text: "heading",
      bgColor: "bg-[#FFF8E8]",
      textColor: "text-[#8B7355]",
    },
    title: "No end-of-month surprises.",
    subtitle: "Projected Monthly Bill, Know your bill before it arrives.",
    image: "/ACTilted.png",
    imagePosition: "left",
    bgColor: "bg-gradient-to-br from-[#F9F9FB] to-[#E5E5E7]",
  },
];

export function FeaturesShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Batch all animations into a single ScrollTrigger per card
      const cards = sectionRef.current?.querySelectorAll(
        ".feature-showcase-card"
      );

      cards?.forEach((card) => {
        const textContent = card.querySelector(".text-content");
        const image = card.querySelector(".feature-image");

        // Create a single timeline for both text and image
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            end: "top 25%",
            toggleActions: "play none none none",
            once: true, // Only animate once for better performance
          },
        });

        // Animate text content
        tl.fromTo(
          textContent,
          {
            opacity: 0,
            x: -40,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0 // Start at timeline position 0
        );

        // Animate image at the same time with slight delay
        if (image) {
          tl.fromTo(
            image,
            {
              scale: 0.9,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            },
            0.15 // Slight stagger effect
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Feature Cards */}
        <div className="space-y-16 md:space-y-20 lg:space-y-32">
          {features.map((feature, index) => (
            <div key={feature.id} className="feature-showcase-card">
              <div
                className={`grid grid-cols-1 ${
                  feature.imagePosition === "right"
                    ? "lg:grid-cols-[1fr_1.3fr]"
                    : "lg:grid-cols-[1.3fr_1fr]"
                } gap-8 lg:gap-16 items-center`}
              >
                {/* Text Content */}
                <div
                  className={`text-content ${
                    feature.imagePosition === "right"
                      ? "order-1"
                      : "order-1 lg:order-2"
                  }`}
                >
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 ${feature.badge.bgColor} rounded-full mb-6 md:mb-8`}
                  >
                    {feature.badge.icon && (
                      <span className="text-base">{feature.badge.icon}</span>
                    )}
                    <span
                      className={`text-sm font-medium ${feature.badge.textColor}`}
                    >
                      {feature.badge.text}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-optimist-blue-primary mb-4 md:mb-5 leading-tight">
                    {feature.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-500 leading-relaxed">
                    {feature.subtitle}
                  </p>
                </div>

                {/* Image */}
                <div
                  className={`${
                    feature.imagePosition === "right"
                      ? "order-2"
                      : "order-2 lg:order-1"
                  } relative`}
                >
                  <div
                    className={`feature-image relative aspect-[16/9] lg:aspect-[4/3] rounded-[32px] overflow-hidden ${feature.bgColor} p-6 md:p-8 lg:p-12`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                        priority={index === 0}
                      />
                    </div>
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
