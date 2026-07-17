import styles from "./calculator.module.css";

// Map space-separated ORIGINAL class names (as authored in calculator.module.css)
// to the hashed CSS-module names. Falsy args are ignored so conditional classes
// read naturally: sx("card", active && "reveal"). Unknown tokens pass through
// unchanged, which keeps runtime safe if a class is ever renamed.
export function sx(...names: Array<string | false | null | undefined>): string {
  return names
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => styles[n] ?? n)
    .join(" ");
}

// Best-effort haptic feedback (Android/Chrome). No-ops where unsupported (e.g.
// desktop, most iOS browsers) and never throws.
export function haptic(pattern: number | number[]): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* vibrate can throw in some embedded webviews — ignore */
  }
}

// True when the user prefers reduced motion (SSR-safe).
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
