"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labelledBy?: string;
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  labelledBy,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2"
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-required="true"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= active;
        return (
          <motion.button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            whileHover={disabled ? undefined : { scale: 1.1 }}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            className="p-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] disabled:cursor-not-allowed"
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            aria-checked={value === star}
            role="radio"
            tabIndex={value === star || (value === 0 && star === 1) ? 0 : -1}
          >
            <Star
              strokeWidth={1.5}
              aria-hidden="true"
              className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-150 ${
                isFilled
                  ? "fill-[#F8D300] stroke-[#F8D300]"
                  : "fill-transparent stroke-[#D4D4D4]"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
