"use client";

import { useEffect, useState } from "react";
import ArrowUpRight from "@/app/components/ArrowUpRight";
import Logo from "@/app/components/Logo";
import { navSections, siteConfig } from "@/app/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape, or when the screen grows to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/85"
          : "border-transparent bg-background/0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#top"
          aria-label={`${siteConfig.brand} home`}
          className="shrink-0"
        >
          <Logo className="h-8 w-auto sm:h-9" priority />
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
          <a
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            Portfolio
            <ArrowUpRight />
          </a>
          <a
            href="#contact"
            className="btn-tactile rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Let&apos;s Build Together
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/70 py-3.5 text-base text-foreground"
                >
                  {section.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group inline-flex items-center gap-1.5 border-b border-border/70 py-3.5 text-base text-foreground transition-colors hover:text-accent"
              >
                Portfolio
                <ArrowUpRight />
              </a>
            </li>
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-tactile mt-5 block rounded-sm bg-accent px-5 py-3 text-center text-sm font-medium text-accent-foreground"
          >
            Let&apos;s Build Together
          </a>
        </nav>
      ) : null}
    </header>
  );
}
