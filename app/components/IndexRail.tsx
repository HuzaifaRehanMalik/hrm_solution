"use client";

import { useEffect, useState } from "react";
import { navSections, siteConfig } from "@/app/data/portfolio";

export default function IndexRail() {
  const [activeId, setActiveId] = useState<string>(navSections[0].id);

  useEffect(() => {
    const sections = navSections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop rail */}
      <header className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col justify-between border-r border-border bg-background px-8 py-10 lg:flex">
        <a
          href="#intro"
          className="font-mono text-sm tracking-tight text-foreground"
        >
          [ {siteConfig.name} ]
        </a>

        <nav aria-label="Section navigation">
          <ul className="space-y-4">
            {navSections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`group flex items-center gap-3 py-1 font-mono text-sm transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-px w-6 shrink-0 transition-colors ${
                        isActive ? "bg-accent" : "bg-border group-hover:bg-muted"
                      }`}
                    />
                    <span>{section.index}</span>
                    <span className="text-foreground/80 group-hover:text-foreground">
                      {section.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="font-mono text-xs leading-relaxed text-muted">
          Built with Next.js
          <br />
          &amp; Tailwind CSS
        </p>
      </header>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <a href="#intro" className="font-mono text-sm text-foreground">
            [ {siteConfig.name} ]
          </a>
          <nav aria-label="Section navigation">
            <ul className="flex gap-4">
              {navSections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`font-mono text-xs transition-colors ${
                        isActive ? "text-accent" : "text-muted"
                      }`}
                    >
                      {section.index}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
