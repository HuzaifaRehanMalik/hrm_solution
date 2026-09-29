"use client";

import type { CSSProperties } from "react";
import ArrowUpRight from "@/app/components/ArrowUpRight";
import { LogoMark } from "@/app/components/Logo";
import SectionHeading from "@/app/components/SectionHeading";
import { siteConfig } from "@/app/data/site";
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

function ReasonCard({
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
      className={`card card-hover reveal p-6 sm:p-7 ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
    >
      <h3 className="text-base font-semibold text-foreground">
        {reason.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">
        {reason.description}
      </p>
    </li>
  );
}

export default function WhyUs() {
  return (
    <section
      id="why"
      aria-label="Why HRM Solution"
      className="scroll-mt-24 border-b border-border px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why HRM Solution"
          title="Small enough to care, technical enough to deliver"
          description="HRM Solution is a focused AI engineering studio. That shapes how the work is scoped, built and handed over."
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
            {reasons.map((reason, index) => (
              <ReasonCard key={reason.title} reason={reason} index={index} />
            ))}
          </ul>

          <div className="card flex flex-col p-6 sm:p-7">
            <LogoMark className="h-9 w-auto self-start" />
            <p className="mt-6 font-mono text-xs tracking-[0.2em] text-accent">
              WHO YOU WORK WITH
            </p>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
              {siteConfig.founder}
            </h3>
            <p className="text-sm text-muted">{siteConfig.founderRole}</p>
            <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">
              Full-stack and AI developer building RAG pipelines, multi-agent
              systems and production web applications. HRM Solution is where
              that work is offered to businesses.
            </p>
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm">
              <a
                href={siteConfig.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
              >
                Developer portfolio
                <ArrowUpRight />
              </a>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
              >
                GitHub
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
