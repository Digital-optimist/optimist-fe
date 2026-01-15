"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollVelocityOptions {
  /**
   * Velocity threshold to consider scrolling as "fast"
   * Default: 1000 pixels per second
   */
  threshold?: number;
  /**
   * Sampling interval in milliseconds
   * Default: 100ms
   */
  sampleInterval?: number;
}

/**
 * Hook to detect fast scrolling velocity
 * Returns whether the user is currently fast scrolling
 * Useful for pausing expensive animations during rapid scrolling
 */
export function useScrollVelocity(options: ScrollVelocityOptions = {}) {
  const { threshold = 1000, sampleInterval = 100 } = options;
  
  const [isFastScrolling, setIsFastScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      
      const timeDiff = currentTime - lastTime.current;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
      
      // Calculate velocity in pixels per second
      const velocity = (scrollDiff / timeDiff) * 1000;
      
      // Update refs
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      
      // Check if velocity exceeds threshold
      if (velocity > threshold) {
        setIsFastScrolling(true);
        
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Reset fast scrolling flag after user stops
        timeoutRef.current = setTimeout(() => {
          setIsFastScrolling(false);
        }, 150);
      }
    };

    // Throttle scroll event listener
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", scrollListener);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, sampleInterval]);

  return isFastScrolling;
}

/**
 * Hook that returns the current scroll velocity value
 * Useful for more granular control based on actual velocity
 */
export function useScrollVelocityValue(sampleInterval = 100) {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      
      const timeDiff = currentTime - lastTime.current;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
      
      // Calculate velocity in pixels per second
      const newVelocity = (scrollDiff / timeDiff) * 1000;
      
      // Update refs
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      
      setVelocity(newVelocity);
    };

    // Throttle scroll event listener
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [sampleInterval]);

  return velocity;
}
