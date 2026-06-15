import { Button } from "./button";
import { cn } from "@/lib/cn";

// Ported verbatim from optimist-website's GradientButton so the blue→cyan CTA
// gradient, pill radius and sizing match the reference exactly.
export function GradientButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "bg-[linear-gradient(44.96deg,#1265FF_30.07%,#69CDEB_99.77%,#4466FF_136.67%)] h-10 rounded-[50px] px-6 text-base leading-[160%] font-medium text-white hover:opacity-90 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
