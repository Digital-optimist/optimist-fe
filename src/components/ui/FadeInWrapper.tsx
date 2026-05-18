"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeInWrapperProps {
  children: ReactNode;
  className?: string;
}

export function FadeInWrapper({ children, className }: FadeInWrapperProps) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
