import type { Variants } from "framer-motion";

// Match GSAP's previous behavior: trigger when ~20% of the element is in view,
// fire once (no re-trigger on scroll back up).
export const viewportOnce = { once: true, amount: 0.2 } as const;

// Default easing used by GSAP `power3.out` — Framer's "easeOut" cubic is the
// closest built-in match without shipping a custom bezier.
const ease = "easeOut" as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

// Stagger container — children with `variants={fadeUp}` etc. will inherit
// the parent's animation state and offset by `staggerChildren` seconds.
export const staggerParent = (staggerChildren = 0.15): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren } },
});
