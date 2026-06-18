import { Flame } from "lucide-react";
import { cn } from "@/lib/cn";

interface SocialProofLineProps {
  /** Wrapper classes — controls text size/color per context (light vs dark bg). */
  className?: string;
  /** Icon color override. */
  iconClassName?: string;
}

/**
 * Social-proof nudge shown above the price and in the mobile sticky footer.
 * Static copy — not data-driven.
 */
export function SocialProofLine({
  className,
  iconClassName,
}: SocialProofLineProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Flame className={cn("h-4 w-4 shrink-0", iconClassName)} />
      <span>
        <span className="font-semibold">200+</span> people bought in last 7 days
      </span>
    </div>
  );
}
