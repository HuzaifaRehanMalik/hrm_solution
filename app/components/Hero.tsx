import type { CSSProperties } from "react";
import Icon from "@/app/components/Icon";
import { benefits, siteConfig, stack } from "@/app/data/site";

export default function Hero() {
  const [brandFirst, ...brandRest] = siteConfig.brand.split(" ");

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-hidden border-b border-border"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-aurora" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <p className="hero-enter font-mono text-xs tracking-[0.25em] text-accent">
              {siteConfig.tagline.toUpperCase()}
            </p>

            <h1
              className="hero-enter mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              style={{ "--hero-delay": "90ms" } as CSSProperties}
            >
              {brandFirst}{" "}
              <span className="bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-transparent">
                {brandRest.join(" ")}
              </span>
            </h1>

            <p
              className="hero-enter mt-6 max-w-xl text-xl font-medium leading-snug text-foreground sm:text-2xl"
              style={{ "--hero-delay": "180ms" } as CSSProperties}
            >
              We build AI-powered internal tools and workflow automation for
              businesses.
            </p>

            <p
              className="hero-enter mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              style={{ "--hero-delay": "260ms" } as CSSProperties}
            >
              Turning manual work into intelligent systems, so your team saves
              time, makes fewer mistakes, and spends the day on what actually
              moves the business forward.
            </p>

            <div
              className="hero-enter mt-10 flex flex-wrap items-center gap-4"
              style={{ "--hero-delay": "360ms" } as CSSProperties}
            >
              <a
                href="#contact"
                className="btn-tactile inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Let&apos;s Build Together
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#services"
                className="btn-tactile rounded-sm border border-border-strong px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                See what we build
              </a>
            </div>
          </div>

          <div className="order-first flex justify-center lg:order-none lg:justify-end">
            <div className="relative aspect-square w-52 sm:w-64 lg:w-full lg:max-w-[26rem]">
              <div
                aria-hidden="true"
                className="hero-ambient-glow absolute inset-[6%]"
              />
              <div aria-hidden="true" className="logo-graded absolute inset-0" />
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <dt className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <Icon name={benefit.icon} className="h-5 w-5 text-accent" />
                {benefit.title}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {benefit.description}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted">
          <span className="tracking-[0.2em]">BUILT WITH</span>
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-sm border border-border px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
