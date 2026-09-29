"use client";

import { useMediaQuery } from "@/app/lib/motion/useMediaQuery";

export const MOTION_QUERIES = {
  reduced: "(prefers-reduced-motion: reduce)",
  touch: "(hover: none) and (pointer: coarse)",
  desktop: "(min-width: 768px)",
} as const;

/**
 * Which motion patterns this device should get. Every flag is false on the
 * server and during hydration, so motion only switches on after the page is
 * already painted and never causes a hydration mismatch.
 */
export function useMotionCapabilities() {
  const reduced = useMediaQuery(MOTION_QUERIES.reduced, true);
  const touch = useMediaQuery(MOTION_QUERIES.touch, false);
  const desktop = useMediaQuery(MOTION_QUERIES.desktop, false);

  return {
    reduced,
    /** Lenis. Native momentum is better on touch. */
    smoothScroll: !reduced && !touch,
    /** Parallax and background type: desktop width only. */
    parallax: !reduced && desktop,
    /** Continuous loops (the rotating badge). */
    loops: !reduced,
  };
}
