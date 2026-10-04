"use client";

import type { CSSProperties } from "react";
import ArrowUpRight from "@/app/components/ArrowUpRight";
import { LogoMark } from "@/app/components/Logo";
import TiltCard from "@/app/components/ui/TiltCard";
import SectionHeading from "@/app/components/SectionHeading";
import { siteConfig } from "@/app/data/site";
import { trackSpotlight } from "@/app/lib/spotlight";
import { useReveal } from "@/app/lib/useReveal";

const reasons = [
  {
    title: "You work with the person building it",
    description:
      "No account manager relaying requirements to a team you never meet. The person who scopes the work is the one who writes it.",
  },
  {
    title: "Scoped to one outcome at a time",
    description:
      "We agree on a single measurable result before development starts, so you can judge the work on something other than hours billed.",
  },
  {
    title: "Built for your team to own",
    description:
      "Documented, handed over, and explained. Ongoing support is offered because it is useful, not because the system breaks without us.",
  },
  {
    title: "A stack that will still be here later",
    description:
      "Python, TypeScript, Next.js and FastAPI: mainstream, well-supported tools any competent developer can pick up after us.",
  },
];

function Reason({
  reason,
  index,
}: {
  reason: (typeof reasons)[number];
  index: number;
}) {
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`reveal group bg-background p-7 transition-colors duration-500 hover:bg-surface sm:p-9 ${
        visible ? "is-visible" : ""
      }`}
      style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
    >
      <span className="font-mono text-[11px] text-subtle transition-colors duration-300 group-hover:text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-10 max-w-[22ch] text-xl font-medium leading-snug tracking-tight text-foreground">
        {reason.title}
      </h3>
      <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-muted">
        {reason.description}
      </p>
    </li>
  );
}

export default function WhyUs() {
  const { ref, visible } = useReveal<HTMLElement>(0.2);

  return (
    <section
      id="why"
      aria-label="Why HRM Solution"
      className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          index="03"
          eyebrow="Why HRM Solution"
          title="Small enough to care. Technical enough to deliver."
          description="HRM Solution is a focused AI engineering studio. That shapes how the work is scoped, built and handed over."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:col-span-8">
            {reasons.map((reason, index) => (
              <Reason key={reason.title} reason={reason} index={index} />
            ))}
          </ul>

          <TiltCard className="lg:col-span-4" max={5}>
          <aside
            ref={ref}
            onPointerMove={trackSpotlight}
            className={`card spotlight reveal flex h-full flex-col overflow-hidden ${
              visible ? "is-visible" : ""
            }`}
            style={{ "--reveal-delay": "200ms" } as CSSProperties}
          >
            <div className="relative flex items-end justify-between border-b border-border bg-surface-raised/50 px-7 pb-6 pt-10 sm:px-9">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-grid opacity-50"
              />
              <LogoMark className="relative h-14 w-auto" />
              <span className="relative inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <span className="pulse-dot" aria-hidden="true" />
                Who you work with
              </span>
            </div>

            <div className="flex flex-1 flex-col px-7 py-7 sm:px-9 sm:py-8">
              <h3 className="text-2xl font-medium tracking-tight text-foreground">
                {siteConfig.founder}
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {siteConfig.founderRole}
              </p>
              <p className="mt-6 flex-1 text-sm leading-relaxed text-muted">
                Full-stack and AI developer building RAG pipelines,
                multi-agent systems and production web applications. HRM
                Solution is where that work is offered to businesses.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border text-sm">
                <a
                  href={siteConfig.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 bg-surface px-4 py-3.5 text-foreground transition-colors hover:bg-surface-raised hover:text-accent"
                >
                  Portfolio
                  <ArrowUpRight />
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 bg-surface px-4 py-3.5 text-foreground transition-colors hover:bg-surface-raised hover:text-accent"
                >
                  GitHub
                  <ArrowUpRight />
                </a>
              </div>
            </div>
          </aside>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
