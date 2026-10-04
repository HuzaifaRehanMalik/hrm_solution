"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";
import AgentConsole from "@/app/components/hero/AgentConsole";
import TiltCard from "@/app/components/ui/TiltCard";

const SPRING = { stiffness: 60, damping: 18, mass: 0.6 };

/**
 * Hero visual: the brand mark and the agent console drift against each
 * other with the pointer (depth) and with scroll (parallax).
 */
export default function HeroStage() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  const { scrollY } = useScroll();
  const scrollMark = useTransform(scrollY, [0, 800], [0, -120]);
  const scrollConsole = useTransform(scrollY, [0, 800], [0, -40]);

  const markX = useTransform(sx, (v) => v * -28);
  const markY = useTransform([sy, scrollMark] as const, ([p, s]: number[]) => p * -28 + s);
  const markRotate = useTransform(sx, [-1, 1], [-4, 4]);
  const consoleX = useTransform(sx, (v) => v * 10);
  const consoleY = useTransform([sy, scrollConsole] as const, ([p, s]: number[]) => p * 10 + s);

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mx.set((event.clientX / window.innerWidth) * 2 - 1);
      my.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, mx, my]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { x: markX, y: markY, rotate: markRotate }}
        className="absolute right-0 top-0 aspect-square w-48 sm:w-64 lg:w-[19rem]"
      >
        <motion.div
          initial={reduced ? false : { scale: 0.6, opacity: 0, filter: "blur(12px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.25 }}
          className="absolute inset-0"
        >
          <div className="hero-ambient-glow absolute inset-[8%]" />
          <div className="logo-graded absolute inset-0 opacity-90" />
        </motion.div>
      </motion.div>

      <motion.div
        style={reduced ? undefined : { x: consoleX, y: consoleY }}
        className="relative pt-32 sm:pt-44 lg:-ml-10 lg:mr-14 lg:pt-52"
      >
        <motion.div
          initial={reduced ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.45 }}
        >
          <TiltCard>
            <AgentConsole />
          </TiltCard>
        </motion.div>
      </motion.div>
    </>
  );
}
