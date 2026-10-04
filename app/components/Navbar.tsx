"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useState } from "react";
import ArrowUpRight from "@/app/components/ArrowUpRight";
import Logo from "@/app/components/Logo";
import ArrowRight from "@/app/components/ui/ArrowRight";
import { navSections, siteConfig } from "@/app/data/site";

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  // Tuck the bar away while reading downward; bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 12;
    setScrolled((prev) => (prev === next ? prev : next));
    const previous = scrollY.getPrevious() ?? 0;
    const delta = value - previous;
    if (Math.abs(delta) < 4) return;
    const hide = delta > 0 && value > 480;
    setHidden((prev) => (prev === hide ? prev : hide));
  });

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const targets = navSections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!targets.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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

  const marker = hovered ?? active;

  return (
    <motion.header
      className="sticky top-0 z-50"
      animate={{ y: hidden && !open ? "-100%" : "0%" }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      onFocusCapture={() => setHidden(false)}
    >
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-border bg-background/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <a
            href="#top"
            aria-label={`${siteConfig.brand} home`}
            className="shrink-0"
          >
            <Logo className="h-8 w-auto sm:h-9" priority />
          </a>

          <nav aria-label="Primary" className="hidden items-center md:flex">
            <ul
              className="flex items-center"
              onPointerLeave={() => setHovered(null)}
            >
              {navSections.map((section) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id} className="relative">
                    <a
                      href={`#${section.id}`}
                      onPointerEnter={() => setHovered(section.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block px-4 py-2 text-sm transition-colors duration-300 ${
                        isActive || hovered === section.id
                          ? "text-foreground"
                          : "text-muted"
                      }`}
                    >
                      {marker === section.id ? (
                        <motion.span
                          layoutId="nav-marker"
                          transition={SPRING}
                          aria-hidden="true"
                          className="absolute inset-x-4 -bottom-px h-px bg-accent"
                        />
                      ) : null}
                      {section.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={siteConfig.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  Portfolio
                  <ArrowUpRight />
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="btn-tactile btn-sweep group hidden items-center gap-2 bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground md:inline-flex"
            >
              Start a project
              <ArrowRight className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative inline-flex h-10 w-10 items-center justify-center border border-border-strong text-foreground transition-colors active:scale-[0.97] md:hidden"
            >
              <span
                aria-hidden="true"
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className={`h-px origin-left bg-accent/70 transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-b border-border bg-background/95 px-5 pb-6 pt-2 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {navSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index, type: "spring", stiffness: 260, damping: 26 }}
                >
                  <a
                    href={`#${section.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-border py-4 text-lg tracking-tight text-foreground"
                  >
                    <span className="font-mono text-[11px] text-subtle">
                      0{index + 1}
                    </span>
                    {section.label}
                  </a>
                </motion.li>
              ))}
              <li>
                <a
                  href={siteConfig.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-1.5 border-b border-border py-4 text-lg tracking-tight text-foreground"
                >
                  Portfolio
                  <ArrowUpRight />
                </a>
              </li>
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-tactile mt-6 flex items-center justify-center gap-2 bg-accent px-5 py-3.5 text-sm font-medium text-accent-foreground"
            >
              Start a project
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
