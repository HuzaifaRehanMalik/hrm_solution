"use client";

import type { CSSProperties } from "react";
import Icon from "@/app/components/Icon";
import SectionHeading from "@/app/components/SectionHeading";
import { services, type Service } from "@/app/data/site";
import { SERVICE_SELECT_EVENT, track } from "@/app/lib/track";
import { useReveal } from "@/app/lib/useReveal";

function selectService(title: string) {
  track("service_click", { label: title });
  window.dispatchEvent(
    new CustomEvent(SERVICE_SELECT_EVENT, { detail: { title } }),
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`card card-hover reveal ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${Math.min(index, 5) * 70}ms` } as CSSProperties}
    >
      <a
        href="#contact"
        onClick={() => selectService(service.title)}
        className="group flex h-full flex-col rounded-[inherit] p-6 sm:p-7"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border-strong bg-surface-raised text-accent">
          <Icon name={service.icon} className="h-5 w-5" />
        </span>
        <h3 className="mt-5 text-base font-semibold text-foreground">
          {service.title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
          {service.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition-transform duration-200 group-hover:translate-x-0.5">
          Enquire about this &rarr;
        </span>
      </a>
    </li>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      aria-label="Services"
      className="scroll-mt-24 border-b border-border px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What we do"
          title="Systems that do the repetitive work for you"
          description="Every engagement starts from a real bottleneck in your business, not from a list of technologies. These are the shapes that work usually takes."
        />

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
