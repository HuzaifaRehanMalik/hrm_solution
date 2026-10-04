"use client";

import type { CSSProperties, ReactNode } from "react";
import Icon from "@/app/components/Icon";
import SectionHeading from "@/app/components/SectionHeading";
import ArrowRight from "@/app/components/ui/ArrowRight";
import AnswerStream from "@/app/components/visuals/AnswerStream";
import FlowDiagram from "@/app/components/visuals/FlowDiagram";
import PriorityList from "@/app/components/visuals/PriorityList";
import { services, type Service } from "@/app/data/site";
import { trackSpotlight } from "@/app/lib/spotlight";
import { SERVICE_SELECT_EVENT, track } from "@/app/lib/track";
import { useReveal } from "@/app/lib/useReveal";

function selectService(title: string) {
  track("service_click", { label: title });
  window.dispatchEvent(
    new CustomEvent(SERVICE_SELECT_EVENT, { detail: { title } }),
  );
}

const featured: Record<string, { visual: ReactNode; kicker: string }> = {
  agents: { visual: <PriorityList />, kicker: "Agents" },
  workflow: { visual: <FlowDiagram />, kicker: "Automation" },
  chat: { visual: <AnswerStream />, kicker: "Knowledge" },
};

const tileLayout = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
];

const visualHeight = ["min-h-[19rem] lg:min-h-[26rem]", "h-40", "min-h-[11rem]"];

function FeatureTile({ service, index }: { service: Service; index: number }) {
  const { ref, visible } = useReveal<HTMLLIElement>(0.15);
  const meta = featured[service.icon];

  return (
    <li
      ref={ref}
      className={`reveal ${tileLayout[index]} ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
    >
      <div
        onPointerMove={trackSpotlight}
        className="card spotlight group flex h-full flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
            0{index + 1} / {meta.kicker}
          </span>
          <Icon
            name={service.icon}
            className="h-5 w-5 text-muted transition-colors duration-300 group-hover:text-accent"
          />
        </div>

        <div
          className={`relative flex-1 px-6 py-6 sm:px-8 ${visualHeight[index]} flex flex-col justify-center`}
        >
          {meta.visual}
        </div>

        <a
          href="#contact"
          onClick={() => selectService(service.title)}
          className="group/link block border-t border-border px-6 py-6 transition-colors duration-500 hover:bg-surface-raised/60 sm:px-8 sm:py-7"
        >
          <div className="flex items-start justify-between gap-6">
            <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              {service.title}
            </h3>
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-border-strong text-muted transition-colors duration-300 group-hover/link:border-accent group-hover/link:bg-accent group-hover/link:text-accent-foreground">
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5" />
            </span>
          </div>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted">
            {service.description}
          </p>
        </a>
      </div>
    </li>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const { ref, visible } = useReveal<HTMLLIElement>(0.3);

  return (
    <li
      ref={ref}
      className={`reveal border-b border-border ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as CSSProperties}
    >
      <a
        href="#contact"
        onClick={() => selectService(service.title)}
        className="group relative isolate grid grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-2 py-7 transition-colors duration-300 md:grid-cols-[4rem_minmax(0,5fr)_minmax(0,6fr)_auto] md:items-center md:gap-x-8"
      >
        {/* hover wash, slides in from the left */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 origin-left scale-x-0 bg-surface transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
        <span className="pt-1 font-mono text-[11px] text-subtle md:pt-0 md:pl-4">
          {String(index + 4).padStart(2, "0")}
        </span>
        <h3 className="flex items-center gap-3 text-lg font-medium tracking-tight text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
          <Icon name={service.icon} className="h-4 w-4 shrink-0 text-accent" />
          {service.title}
        </h3>
        <p className="col-start-2 max-w-[60ch] text-sm leading-relaxed text-muted md:col-start-auto">
          {service.description}
        </p>
        <span className="col-start-3 row-start-1 inline-flex items-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle transition-colors group-hover:text-accent md:col-start-auto md:row-start-auto md:pr-4 md:pt-0">
          <span className="hidden lg:inline">Enquire</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </a>
    </li>
  );
}

export default function Services() {
  const featuredServices = services.filter((s) => s.icon in featured);
  const rest = services.filter((s) => !(s.icon in featured));

  return (
    <section
      id="services"
      aria-label="Services"
      className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          index="01"
          eyebrow="What we build"
          title="Systems that take the repetitive work off your desk."
          description="Every engagement starts from a real bottleneck in your business, not a list of technologies. These are the shapes that work usually takes."
        />

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {featuredServices.map((service, index) => (
            <FeatureTile key={service.title} service={service} index={index} />
          ))}
        </ul>

        <div className="mt-20 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span>Also on the bench</span>
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>
        <ul className="relative isolate mt-2 border-t border-border">
          {rest.map((service, index) => (
            <ServiceRow key={service.title} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
