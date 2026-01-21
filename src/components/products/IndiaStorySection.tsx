"use client";

import { memo } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface StoryCard {
  image: string;
  caption: string;
  alt: string;
}

// =============================================================================
// Constants
// =============================================================================

const STORY_CARDS: StoryCard[] = [
  {
    image: ASSETS.indiaStoryDesert,
    caption: "Tested for operation up to 50°C",
    alt: "Desert landscape with intense sun showing extreme heat testing conditions",
  },
  {
    image: ASSETS.indiaStorySleeping,
    caption: "Designed for long, continuous usage",
    alt: "Person sleeping comfortably with AC running continuously",
  },
  {
    image: ASSETS.indiaStoryValidated,
    caption: "Validated beyond short demo cycles",
    alt: "AC unit with BTU performance chart showing sustained performance",
  },
];

// =============================================================================
// Card Components
// =============================================================================

interface MainCardProps {
  card: StoryCard;
}

const MainCard = memo(function MainCard({ card }: MainCardProps) {
  return (
    <div className="relative w-full lg:w-[789px] h-[218px] md:h-[400px] lg:h-[516px] rounded-[20px] overflow-hidden">
      <Image
        src={card.image}
        alt={card.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 789px"
      />
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 44.76%, rgba(0, 0, 0, 1) 104.52%)" 
        }}
      />
      {/* Caption */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4">
        <p className="font-sans text-base md:text-2xl lg:text-4xl text-white font-normal">
          {card.caption}
        </p>
      </div>
    </div>
  );
});

interface SmallCardProps {
  card: StoryCard;
}

const SmallCard = memo(function SmallCard({ card }: SmallCardProps) {
  return (
    <div className="relative flex-1 min-w-0 h-[195px] md:h-[220px] lg:h-[248px] rounded-[20px] overflow-hidden">
      <Image
        src={card.image}
        alt={card.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 280px, 549px"
      />
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 44.76%, rgba(0, 0, 0, 1) 104.52%)" 
        }}
      />
      {/* Caption */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4">
        <p className="font-sans text-sm md:text-xl lg:text-[32px] text-white font-normal leading-tight">
          {card.caption}
        </p>
      </div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const IndiaStorySection = memo(function IndiaStorySection() {
  return (
    <section 
      className="w-full py-12 md:py-16 lg:py-20 bg-white"
      aria-labelledby="india-story-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-11">
          {/* Left: Label + Title */}
          <div className="flex flex-col gap-2 md:gap-2.5 max-w-full lg:max-w-[634px]">
            <p className="text-[#3478F6] text-sm md:text-base lg:text-xl font-normal">
              India Story – Testing Lab
            </p>
            <h2 
              id="india-story-heading"
              className="font-display text-2xl md:text-[32px] lg:text-[40px] font-semibold text-black leading-tight"
            >
              Built and tested for Indian summers
            </h2>
          </div>
          
          {/* Right: Description */}
          <p className="text-black text-sm md:text-base lg:text-xl font-normal max-w-full lg:max-w-[430px]">
            The focus is sustained performance during long summers, not peak numbers for marketing
          </p>
        </div>

        {/* Cards Grid */}
        {/* Mobile: Stack layout */}
        <div className="flex flex-col gap-3 lg:hidden">
          {/* Main Card - Full width */}
          <MainCard card={STORY_CARDS[0]} />
          
          {/* Two smaller cards side by side */}
          <div className="flex gap-3">
            <SmallCard card={STORY_CARDS[1]} />
            <SmallCard card={STORY_CARDS[2]} />
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-[789px_1fr] lg:gap-5">
          {/* Left: Main Card */}
          <MainCard card={STORY_CARDS[0]} />
          
          {/* Right: Two stacked cards */}
          <div className="flex flex-col gap-5">
            <SmallCard card={STORY_CARDS[1]} />
            <SmallCard card={STORY_CARDS[2]} />
          </div>
        </div>
      </div>
    </section>
  );
});
