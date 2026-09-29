"use client";

import { motion, useMotionValueEvent } from "motion/react";
import { useRef } from "react";
import { useScrollProgress } from "@/app/lib/motion/useScrollProgress";

export default function ScrollProgressProbe() {
  const ref = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLOutputElement>(null);
  const { progress, active, willChange } = useScrollProgress(ref);

  // Write the number straight to the DOM: no React re-render per frame.
  useMotionValueEvent(progress, "change", (value) => {
    if (readoutRef.current) readoutRef.current.textContent = value.toFixed(3);
  });

  return (
    <div
      ref={ref}
      id="probe"
      data-active={active}
      className="relative flex h-[60vh] flex-col justify-center gap-4 rounded-sm border border-border bg-surface p-8"
    >
      <p className="text-sm text-muted">
        progress <output ref={readoutRef}>0.000</output> · will-change{" "}
        <span data-testid="will-change">{willChange}</span>
      </p>
      <div className="h-2 overflow-hidden rounded-none bg-border">
        <motion.div
          data-testid="bar"
          className="h-full origin-left bg-accent"
          style={{ scaleX: progress, willChange }}
        />
      </div>
    </div>
  );
}
