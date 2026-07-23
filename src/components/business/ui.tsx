import { cn } from "@/lib/cn";

// Blue→cyan CTA gradient, matching the site-wide GradientButton. Shared across
// the /business sections so every "Request a proposal" / primary CTA reads
// identically. Rendered as an <a> so in-page CTAs smooth-scroll natively.
export const CTA_GRADIENT =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[50px] bg-[linear-gradient(44.96deg,#1265FF_30.07%,#69CDEB_99.77%,#4466FF_136.67%)] font-medium text-white transition-all hover:opacity-90 cursor-pointer";

interface GradientCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function GradientCTA({ href, children, className }: GradientCTAProps) {
  return (
    <a href={href} className={cn(CTA_GRADIENT, className)}>
      {children}
    </a>
  );
}
