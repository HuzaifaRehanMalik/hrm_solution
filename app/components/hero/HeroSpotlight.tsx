"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

/** A soft teal light on the hero grid that trails the mouse. */
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(-1000), { stiffness: 120, damping: 24 });
  const y = useSpring(useMotionValue(-1000), { stiffness: 120, damping: 24 });
  const background = useMotionTemplate`radial-gradient(26rem circle at ${x}px ${y}px, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)`;

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    return () => host.removeEventListener("pointermove", onMove);
  }, [reduced, x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ background }}
      className="pointer-events-none absolute inset-0"
    />
  );
}
