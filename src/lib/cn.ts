import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind-aware className combiner used by the /home (pixel port) components.
// Mirrors the `cn` helper from the optimist-website reference so ported markup
// behaves identically (later classes win conflicting utilities via twMerge).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
