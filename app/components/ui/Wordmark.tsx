"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

/** Oversized outlined wordmark: letters rise in on view, lift on hover. */
export default function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  const reduced = useReducedMotion();

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="-mb-[0.22em] select-none whitespace-nowrap text-center text-[14.5vw] font-semibold leading-none tracking-tighter"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="text-outline inline-block transition-[-webkit-text-stroke-color] duration-300 hover:[-webkit-text-stroke-color:var(--accent)]"
          initial={reduced ? false : { y: "60%", opacity: 0 }}
          animate={inView ? { y: "0%", opacity: 1 } : undefined}
          whileHover={reduced ? undefined : { y: "-8%" }}
          transition={{ type: "spring", stiffness: 140, damping: 16, delay: inView ? i * 0.035 : 0 }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </p>
  );
}
