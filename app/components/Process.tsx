"use client";

import type { CSSProperties } from "react";
import SectionHeading from "@/app/components/SectionHeading";
import { process, type Step } from "@/app/data/site";
import { useReveal } from "@/app/lib/useReveal";

function ProcessStep({ step, index }: { step: Step; index: number }) {
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`card reveal p-6 sm:p-7 ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${index * 120}ms` } as CSSProperties}
    >
      <span className="font-mono text-sm text-accent">{step.index}</span>
      <div className="divider-glow mt-4" />
      <h3 className="mt-5 text-base font-semibold text-foreground">
        {step.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">
        {step.description}
      </p>
    </li>
  );
}

export default function Process() {
  return (
    <section
      id="process"
      aria-label="How we work"
      className="relative scroll-mt-24 overflow-hidden border-b border-border px-5 py-20 sm:px-8 sm:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-aurora opacity-40" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How we work"
          title="Four steps, and you see working software in every one"
          description="No long discovery phase billed before anything exists. The goal is a system in your hands that measurably removes work."
        />

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <ProcessStep key={step.index} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
