"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { process, type Step } from "@/app/data/site";
import { useReveal } from "@/app/lib/useReveal";
import SplitReveal from "@/app/components/ui/SplitReveal";

function ProcessStep({ step }: { step: Step }) {
  const { ref, visible } = useReveal<HTMLLIElement>(0.4);

  return (
    <li
      ref={ref}
      className={`reveal relative grid grid-cols-[3rem_1fr] gap-x-6 pb-16 last:pb-0 sm:grid-cols-[4.5rem_1fr] sm:gap-x-10 ${
        visible ? "is-visible" : ""
      }`}
      style={{ "--reveal-delay": "60ms" } as CSSProperties}
    >
      {/* node on the rail */}
      <span
        aria-hidden="true"
        className={`absolute left-[calc(1.5rem-4px)] top-2 h-2 w-2 border transition-colors duration-700 sm:left-[calc(2.25rem-4px)] ${
          visible ? "border-accent bg-accent" : "border-border-strong bg-background"
        }`}
      />
      <span className="col-start-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
        Step {step.index}
      </span>
      <h3 className="col-start-2 mt-3 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        {step.title}
      </h3>
      <p className="col-start-2 mt-4 max-w-[54ch] text-base leading-relaxed text-muted">
        {step.description}
      </p>
    </li>
  );
}

export default function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  return (
    <section
      id="process"
      aria-label="How we work"
      className="relative scroll-mt-20 border-y border-border bg-surface/30 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              <span className="text-accent">02</span>
              <span className="h-px w-10 bg-border-strong" aria-hidden="true" />
              <span>How we work</span>
            </div>
            <SplitReveal text="Four steps. Working software in every one." className="mt-7 max-w-[16ch] text-balance text-3xl font-medium leading-[1.05] tracking-tighter text-foreground sm:text-4xl md:text-5xl" />
            <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-muted">
              No long discovery phase billed before anything exists. The goal
              is a system in your hands that measurably removes work.
            </p>

            <dl className="mt-12 hidden grid-cols-2 gap-px border border-border bg-border lg:grid">
              <div className="bg-background p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
                  First demo
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  Early, on your data
                </dd>
              </div>
              <div className="bg-background p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
                  Pricing
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  Fixed scope, in writing
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-6 top-3 w-px bg-border sm:left-9"
          >
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-px origin-top bg-accent"
            />
          </div>
          <ol ref={listRef} className="relative">
            {process.map((step) => (
              <ProcessStep key={step.index} step={step} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
