"use client";

import {
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import {
  motion,
  useAnimationControls,
  useInView,
  type Variants,
} from "framer-motion";
import { Star, Play } from "lucide-react";
import type { CustomerReviewItem, VideoSource } from "@/lib/shopify";
import { viewportOnce } from "@/lib/motion-variants";

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const trackReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

// =============================================================================
// Types
// =============================================================================

interface CustomerVideo {
  id: string;
  name: string;
  rating: number;
  thumbnail: string;
  videoSources: VideoSource[];
}

// =============================================================================
// Constants
// =============================================================================

const SCROLL_SPEED = 40; // pixels per second
const MIN_CARDS_PER_SET = 10;

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

type VideoState = "idle" | "loading" | "playing" | "buffering";

const Spinner = memo(function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="w-10 h-10 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
    </div>
  );
});

const VideoCard = memo(function VideoCard({
  video,
  widthClass,
  onPlayStateChange,
}: {
  video: CustomerVideo;
  widthClass: string;
  onPlayStateChange: (playing: boolean) => void;
}) {
  const [videoState, setVideoState] = useState<VideoState>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = useCallback(() => {
    if (video.videoSources.length === 0) return;

    const vid = videoRef.current;
    if (!vid) return;

    if (videoState === "idle") {
      setVideoState("loading");
      onPlayStateChange(true);
      vid.play().catch(() => {
        setVideoState("idle");
        onPlayStateChange(false);
      });
    } else {
      vid.pause();
      vid.currentTime = 0;
      setVideoState("idle");
      onPlayStateChange(false);
    }
  }, [videoState, video.videoSources.length, onPlayStateChange]);

  const handlePlaying = useCallback(() => {
    setVideoState("playing");
  }, []);

  const handleWaiting = useCallback(() => {
    setVideoState("buffering");
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setVideoState("idle");
    onPlayStateChange(false);
  }, [onPlayStateChange]);

  const hasVideo = video.videoSources.length > 0;
  const isActive = videoState !== "idle";
  const showVideo = videoState === "playing" || videoState === "buffering";
  const showSpinner = videoState === "loading" || videoState === "buffering";

  return (
    <div className={`shrink-0 ${widthClass} flex flex-col gap-4`}>
      <div
        className="relative w-full aspect-[264/420] rounded-[8px] overflow-hidden bg-black group cursor-pointer"
        onClick={handleClick}
      >
        {/* Thumbnail — blurs during loading */}
        <Image
          src={video.thumbnail}
          alt={`${video.name} video testimonial`}
          fill
          className={`object-cover transition-all duration-300 ${
            showVideo
              ? "opacity-0 scale-105 blur-sm"
              : videoState === "loading"
                ? "opacity-100 scale-105 blur-sm"
                : "opacity-100 scale-100 blur-0"
          }`}
          sizes="(min-width: 768px) 500px, (min-width: 640px) 310px, 300px"
          unoptimized
        />

        {/* Dark scrim over blurred thumbnail while loading */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            videoState === "loading" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Video element */}
        {hasVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              showVideo ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            playsInline
            preload="none"
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onEnded={handleVideoEnded}
          >
            {video.videoSources.map((src, i) => (
              <source key={i} src={src.url} type={src.mimeType} />
            ))}
          </video>
        )}

        {/* Gradient overlay — only when idle */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isActive ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Loading / Buffering spinner */}
        {showSpinner && <Spinner />}

        {/* Play button — visible when idle, hidden while loading, peek-on-hover while playing */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            videoState === "idle"
              ? "opacity-100"
              : videoState === "playing"
                ? "opacity-0 hover:opacity-100"
                : "opacity-0 pointer-events-none"
          }`}
        >
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
// Props
// =============================================================================

interface CustomerVideosSectionProps {
  customers?: CustomerReviewItem[];
}

// =============================================================================
// Main Component
// =============================================================================

export const CustomerVideosSection = memo(function CustomerVideosSection({
  customers,
}: CustomerVideosSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const playingCountRef = useRef(0);
  const isPausedRef = useRef(false);
  const marqueeControls = useAnimationControls();
  const isInView = useInView(sectionRef, { amount: 0.01, once: false });

  const videos: CustomerVideo[] = useMemo(() => {
    if (customers && customers.length > 0) {
      return customers.map((c, i) => ({
        id: `customer-${i}`,
        name: c.name,
        rating: c.rating,
        thumbnail: c.previewImageUrl || "",
        videoSources: c.videoSources ?? [],
      }));
    }
    return [];
  }, [customers]);

  // Widen cards when fewer than 5 to fill the desktop viewport
  const cardWidthClass = useMemo(() => {
    const count = videos.length;
    if (count >= 5) return "w-[200px] sm:w-[230px] md:w-[264px]";
    if (count === 4) return "w-[230px] sm:w-[270px] md:w-[310px]";
    if (count === 3) return "w-[250px] sm:w-[290px] md:w-[380px]";
    if (count === 2) return "w-[270px] sm:w-[310px] md:w-[450px]";
    return "w-[300px] sm:w-[340px] md:w-[500px]";
  }, [videos.length]);

  // Build the looped track: repeat the set so one copy always exceeds the viewport,
  // then duplicate for the seamless GSAP wrap.
  const loopedVideos = useMemo(() => {
    const repeatCount = Math.ceil(MIN_CARDS_PER_SET / videos.length);
    const oneSet: CustomerVideo[] = [];
    for (let i = 0; i < repeatCount; i++) {
      oneSet.push(...videos);
    }
    return [...oneSet, ...oneSet];
  }, [videos]);

  // Drive the infinite marquee. Re-runs whenever something changes the play state
  // (viewport visibility, hover, or a video starting to play) — we either start the
  // looping translate or stop it. The duration is derived from track width so the
  // pixel speed stays constant regardless of how many cards are present.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const shouldPlay =
      isInView && !isPausedRef.current && playingCountRef.current === 0;

    if (!shouldPlay) {
      marqueeControls.stop();
      return;
    }

    const totalWidth = track.scrollWidth / 2;
    if (totalWidth <= 0) return;

    const duration = totalWidth / SCROLL_SPEED;
    marqueeControls.start({
      x: [0, -totalWidth],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration, ease: "linear" },
      },
    });
  }, [isInView, marqueeControls, loopedVideos]);

  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
    marqueeControls.stop();
  }, [marqueeControls]);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    const track = trackRef.current;
    if (!track || !isInView || playingCountRef.current > 0) return;
    const totalWidth = track.scrollWidth / 2;
    if (totalWidth <= 0) return;
    const duration = totalWidth / SCROLL_SPEED;
    marqueeControls.start({
      x: [0, -totalWidth],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration, ease: "linear" },
      },
    });
  }, [isInView, marqueeControls]);

  const handlePlayStateChange = useCallback(
    (playing: boolean) => {
      playingCountRef.current = Math.max(
        0,
        playingCountRef.current + (playing ? 1 : -1),
      );
      if (playingCountRef.current > 0) {
        marqueeControls.stop();
      } else if (isInView && !isPausedRef.current) {
        const track = trackRef.current;
        if (!track) return;
        const totalWidth = track.scrollWidth / 2;
        if (totalWidth <= 0) return;
        const duration = totalWidth / SCROLL_SPEED;
        marqueeControls.start({
          x: [0, -totalWidth],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          },
        });
      }
    },
    [isInView, marqueeControls],
  );

  return (
    <section
      ref={sectionRef}
      className="w-full pt-4 pb-11 md:pb-14 lg:pb-16 bg-white overflow-hidden"
      aria-label="Customer video testimonials"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.h2
        className="font-display font-semibold text-2xl md:text-4xl lg:text-[40px] text-black text-center leading-tight tracking-wide md:tracking-normal mb-8 md:mb-12 lg:mb-14 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={headerReveal}
      >
        Hear it from our customers
      </motion.h2>

      <motion.div
        className="relative"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={trackReveal}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-[10px] items-start will-change-transform"
          animate={marqueeControls}
        >
          {loopedVideos.map((video, index) => (
            <VideoCard
              key={`${video.id}-${index}`}
              video={video}
              widthClass={cardWidthClass}
              onPlayStateChange={handlePlayStateChange}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
});
