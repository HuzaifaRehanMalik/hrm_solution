"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useState } from "react";

/** Back-to-top control with a progress ring; appears after the hero. */
export default function ScrollTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 900;
    setShow((prev) => (prev === next ? prev : next));
  });

  return (
    <AnimatePresence>
      {show ? (
        <motion.a
          href="#top"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center border border-border-strong bg-background/80 text-foreground backdrop-blur-md transition-colors hover:text-accent sm:bottom-8 sm:right-8"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <motion.rect
              x="1"
              y="1"
              width="46"
              height="46"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              style={{ pathLength: progress }}
            />
          </svg>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
            <path d="M8 13V3M4 7l4-4 4 4" />
          </svg>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
