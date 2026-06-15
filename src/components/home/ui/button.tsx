import * as React from "react";
import { cn } from "@/lib/cn";

// Minimal button primitive for the /home port. The reference (optimist-website)
// uses a full shadcn Button, but every /home usage fully overrides the visual
// via className (GradientButton, carousel arrows), so a thin base is faithful
// and avoids pulling in cva/radix.
export function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none transition-all select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}
