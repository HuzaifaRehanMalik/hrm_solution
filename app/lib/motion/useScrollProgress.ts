"use client";

import { useInView, useScroll } from "motion/react";
import type { RefObject } from "react";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Scroll progress (0 → 1) of `target` across the viewport, as a Motion value.
 * Driven by Motion's scroll timeline, so components bind it straight to
 * `style` without re-rendering and without their own scroll listeners.
 *
 * `active` is true while the element is within `prime` of the viewport. Use it
 * to switch `will-change` on just before the element animates and off again
 * once it has left, instead of leaving it on permanently.
 *
 * The target must be positioned (relative, absolute, sticky or fixed).
 */
export function useScrollProgress<T extends HTMLElement>(
  target: RefObject<T | null>,
  {
    offset = ["start end", "end start"],
    prime = "25%",
  }: { offset?: ScrollOffset; prime?: `${number}%` | `${number}px` } = {},
) {
  const { scrollYProgress } = useScroll({ target, offset });
  const active = useInView(target, { margin: `${prime} 0px ${prime} 0px` });

  return {
    progress: scrollYProgress,
    active,
    willChange: active ? "transform" : "auto",
  } as const;
}
