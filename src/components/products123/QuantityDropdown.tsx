"use client";

import { memo, useCallback, useEffect, useRef, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// =============================================================================
// Animation Variants
// =============================================================================

const easeCurve = [0, 0, 0.2, 1] as const;

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: easeCurve },
  },
};

const optionVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.15, ease: "easeOut" as const, delay: i * 0.03 },
  }),
};

// =============================================================================
// Types
// =============================================================================

interface QuantityDropdownProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  options?: readonly number[];
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_OPTIONS = [1, 2, 3, 4, 5] as const;

// =============================================================================
// Component
// =============================================================================

export const QuantityDropdown = memo(function QuantityDropdown({
  quantity,
  onQuantityChange,
  isOpen,
  onToggle,
  options = DEFAULT_OPTIONS,
}: QuantityDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const selectedOption = listboxRef.current.querySelector(
        '[aria-selected="true"]',
      ) as HTMLButtonElement;
      selectedOption?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onToggle();
      } else if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        onToggle();
      }
    },
    [isOpen, onToggle],
  );

  const handleOptionKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, qty: number, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onQuantityChange(qty);
        onToggle();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onToggle();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextOption = listboxRef.current?.querySelectorAll(
          '[role="option"]',
        )[index + 1] as HTMLButtonElement;
        nextOption?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevOption = listboxRef.current?.querySelectorAll(
          '[role="option"]',
        )[index - 1] as HTMLButtonElement;
        prevOption?.focus();
      }
    },
    [onQuantityChange, onToggle],
  );

  const handleOptionClick = useCallback(
    (qty: number) => {
      onQuantityChange(qty);
      onToggle();
    },
    [onQuantityChange, onToggle],
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <motion.button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Quantity: ${quantity}. Click to change.`}
        className="w-full h-11 flex items-center justify-between px-3 py-2.5 bg-[rgba(0,0,0,0.04)] rounded-[8px] hover:bg-[rgba(0,0,0,0.06)] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="button"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        <span className="text-gray-900 font-normal text-sm md:text-base">
          Quantity: {quantity}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
        >
          <ChevronDown
            className="w-5 h-5 text-gray-500"
            aria-hidden="true"
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listboxRef}
            role="listbox"
            aria-label="Select quantity"
            className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] max-h-48 overflow-y-auto scrollbar-hide origin-bottom"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {options.map((qty, index) => (
              <motion.button
                key={qty}
                onClick={() => handleOptionClick(qty)}
                onKeyDown={(e) => handleOptionKeyDown(e, qty, index)}
                role="option"
                aria-selected={quantity === qty}
                className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 transition-colors text-sm md:text-base focus:outline-none focus:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                  quantity === qty
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-900"
                }`}
                type="button"
                custom={index}
                variants={optionVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.04)" }}
                transition={{ duration: 0.15 }}
              >
                {qty}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
