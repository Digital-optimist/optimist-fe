"use client";

import { memo, useRef, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Star, Play } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

interface CustomerVideo {
  id: string;
  name: string;
  rating: number;
  thumbnail: string;
}

// =============================================================================
// Constants
// =============================================================================

const CUSTOMER_VIDEOS: CustomerVideo[] = [
  {
    id: "rahul",
    name: "Rahul Sharma",
    rating: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "priya",
    name: "Priya Menon",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "arjun",
    name: "Arjun Patel",
    rating: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "sneha",
    name: "Sneha Iyer",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "vikram",
    name: "Vikram Desai",
    rating: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "ananya",
    name: "Ananya Rao",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "karthik",
    name: "Karthik Nair",
    rating: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=528&h=840&fit=crop&crop=faces",
  },
  {
    id: "divya",
    name: "Divya Reddy",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=528&h=840&fit=crop&crop=faces",
  },
];

// =============================================================================
// Star Rating Component
// =============================================================================

const StarRating = memo(function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[2px]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-[#F5A623] text-[#F5A623]"
              : "fill-[#E0E0E0] text-[#E0E0E0]"
          }`}
        />
      ))}
    </div>
  );
});

// =============================================================================
// Video Card Component
// =============================================================================

const VideoCard = memo(function VideoCard({ video }: { video: CustomerVideo }) {
  return (
    <div className="shrink-0 w-[200px] sm:w-[230px] md:w-[264px] flex flex-col gap-4">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[264/420] rounded-[8px] overflow-hidden bg-white group cursor-pointer">
        <Image
          src={video.thumbnail}
          alt={`${video.name} video testimonial`}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 264px, (min-width: 640px) 230px, 200px"
          unoptimized
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <StarRating rating={video.rating} />
        <p className="font-display font-semibold text-sm md:text-base text-black">
          ~{video.name}
        </p>
      </div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const CustomerVideosSection = memo(function CustomerVideosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
    }
    if (trackRef.current) {
      gsap.set(trackRef.current, { opacity: 0 });
    }
  }, []);

  useGSAP(
    () => {
      if (!trackRef.current) return;

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

      tl.to(
        trackRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.2,
      );

      const track = trackRef.current;
      const totalWidth = track.scrollWidth / 2;

      tweenRef.current = gsap.to(track, {
        x: -totalWidth,
        duration: 50,
        ease: "none",
        repeat: -1,
        paused: false,
      });

      // Start animation when in viewport
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => tweenRef.current?.play(),
          onLeave: () => tweenRef.current?.pause(),
          onEnterBack: () => tweenRef.current?.play(),
          onLeaveBack: () => tweenRef.current?.pause(),
        },
      });
    },
    { scope: sectionRef },
  );

  const handleMouseEnter = useCallback(() => {
    tweenRef.current?.pause();
  }, []);

  const handleMouseLeave = useCallback(() => {
    tweenRef.current?.play();
  }, []);

  const duplicatedVideos = [...CUSTOMER_VIDEOS, ...CUSTOMER_VIDEOS];

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 md:py-14 lg:py-16 bg-white overflow-hidden"
      aria-label="Customer video testimonials"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <h2
        ref={headerRef}
        className="font-display font-semibold text-2xl md:text-4xl lg:text-[40px] text-black text-center leading-tight mb-8 md:mb-12 lg:mb-14 px-4"
      >
        Hear it from our customers
      </h2>

      {/* Marquee Track */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-[10px] items-start will-change-transform"
        >
          {duplicatedVideos.map((video, index) => (
            <VideoCard key={`${video.id}-${index}`} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
});
