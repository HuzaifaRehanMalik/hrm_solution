"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type Tag = "h1" | "h2" | "p";

/**
 * Word-by-word mask reveal. Each word rises out of its own clipped line box.
 * Screen readers get the plain sentence via aria-label.
 */
export default function SplitReveal({
  text,
  as = "h2",
  className = "",
  accent = [],
  delay = 0,
  onMount = false,
}: {
  text: string;
  as?: Tag;
  className?: string;
  /** Words (exact match, punctuation stripped) to colour with the accent. */
  accent?: string[];
  delay?: number;
  /** Play on mount (hero) instead of when scrolled into view. */
  onMount?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const play = onMount || inView;
  const words = text.split(" ");
  const Tag = motion[as];

  return (
    <Tag ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => {
        const bare = word.replace(/[.,!?]/g, "");
        return (
          <span
            key={`${word}-${i}`}
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className={`inline-block will-change-transform ${
                accent.includes(bare) ? "text-accent" : ""
              }`}
              initial={reduced ? false : { y: "105%", rotate: 4, opacity: 0 }}
              animate={play ? { y: "0%", rotate: 0, opacity: 1 } : undefined}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: delay + i * 0.045,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}
