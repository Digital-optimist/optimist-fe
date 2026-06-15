"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

// Card is an `m.div` so any usage can opt into Framer animations (e.g.
// `variants={fadeUp}` inside a staggered parent) WITHOUT an extra wrapper
// element — the grid placement (col-span etc.) stays on the Card itself. With
// no motion props it renders as a plain static div.
export default function Card({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <m.div
      className={cn(
        "overflow-hidden rounded-3xl border border-[#E9E9E9] bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </m.div>
  );
}
