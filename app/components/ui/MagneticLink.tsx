"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

const SPRING = { stiffness: 150, damping: 15, mass: 0.2 };

const variants = {
  primary:
    "btn-sweep bg-accent text-accent-foreground hover:bg-[#6ee0e5]",
  ghost:
    "border border-border-strong text-foreground hover:border-accent/60 hover:text-accent",
} as const;

/**
 * A link that leans toward the cursor. Position lives in motion values, so
 * pointer movement never triggers a React render.
 */
export default function MagneticLink({
  href,
  children,
  variant = "primary",
  className = "",
  strength = 0.25,
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  strength?: number;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  function onMove(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      className={`btn-tactile group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-medium tracking-tight ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
