"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Endless band that speeds up with scroll velocity and flips direction
 * when you scroll back up. Drag it sideways to scrub.
 */
export default function VelocityMarquee({
  children,
  baseVelocity = -2.2,
}: {
  children: ReactNode;
  baseVelocity?: number;
}) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const hovering = useRef(false);
  const dragging = useRef(false);
  const band = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (reduced || dragging.current) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    const speed = hovering.current ? 0.25 : 1;
    let moveBy = direction.current * baseVelocity * (delta / 1000) * speed;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div
      ref={band}
      className="flex w-max cursor-grab touch-pan-y select-none active:cursor-grabbing"
      style={{ x }}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      onPanStart={() => (dragging.current = true)}
      onPan={(_, info) => {
        // Pixels -> percent of the band (which holds two copies).
        const width = band.current?.offsetWidth || 1;
        baseX.set(baseX.get() + (info.delta.x / width) * 100);
      }}
      onPanEnd={() => (dragging.current = false)}
    >
      {children}
      <div aria-hidden="true" className="flex">
        {children}
      </div>
    </motion.div>
  );
}
