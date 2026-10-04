import type { CSSProperties } from "react";
import Icon from "@/app/components/Icon";
import HeroSpotlight from "@/app/components/hero/HeroSpotlight";
import HeroStage from "@/app/components/hero/HeroStage";
import SplitReveal from "@/app/components/ui/SplitReveal";
import VelocityMarquee from "@/app/components/ui/VelocityMarquee";
import ArrowRight from "@/app/components/ui/ArrowRight";
import MagneticLink from "@/app/components/ui/MagneticLink";
import { benefits, siteConfig, stack } from "@/app/data/site";

const delay = (ms: number) => ({ "--hero-delay": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-aurora" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-70" />
      <HeroSpotlight />

      <div className="relative mx-auto flex min-h-[calc(100dvh-73px)] max-w-[1400px] flex-col justify-center px-5 pb-16 pt-12 sm:px-8 lg:px-10 lg:pb-20 lg:pt-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Copy */}
          <div className="lg:col-span-7 lg:pr-8">
            <div
              className="hero-enter flex flex-wrap items-center gap-x-4 gap-y-2"
              style={delay(0)}
            >
              <span className="text-sm font-medium tracking-tight text-foreground">
                {siteConfig.brand}
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-border-strong" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                AI engineering studio
              </span>
            </div>

            <SplitReveal
              as="h1"
              onMount
              delay={0.1}
              text="Manual work, rebuilt as systems that run themselves."
              accent={["systems"]}
              className="mt-8 max-w-[14ch] text-balance text-[2.6rem] font-medium leading-[0.98] tracking-tighter text-foreground sm:text-6xl lg:text-[4.6rem]"
            />

            <p
              className="hero-enter mt-8 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg"
              style={delay(180)}
            >
              We design and ship AI agents, workflow automation and internal
              tools for businesses, so your team stops copying data between
              tabs and spends the day on work that needs a person.
            </p>

            <div
              className="hero-enter mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={delay(280)}
            >
              <MagneticLink href="#contact">
                Start a project
                <ArrowRight />
              </MagneticLink>
              <MagneticLink href="#services" variant="ghost" strength={0.15}>
                See what we build
              </MagneticLink>
            </div>

            <p
              className="hero-enter mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle"
              style={delay(360)}
            >
              {siteConfig.promise}
            </p>
          </div>

          {/* Visual: graded brand mark with a live agent run in front of it */}
          <div className="relative lg:col-span-5">
            <HeroStage />
          </div>
        </div>

        {/* Outcomes — hairline grid, no boxes */}
        <dl className="mt-20 grid grid-cols-1 gap-px border-y border-border bg-border sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="hero-enter bg-background py-7 sm:px-6"
              style={delay(420 + index * 70)}
            >
              <dt className="flex items-center gap-3 text-sm font-medium text-foreground">
                <span className="font-mono text-[11px] text-subtle">
                  0{index + 1}
                </span>
                <Icon name={benefit.icon} className="h-4 w-4 text-accent" />
                {benefit.title}
              </dt>
              <dd className="mt-3 max-w-[34ch] text-sm leading-relaxed text-muted">
                {benefit.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Stack marquee */}
      <div className="marquee relative border-y border-border bg-surface/40">
        <div className="mx-auto flex max-w-[1400px] items-center">
          <p className="hidden shrink-0 border-r border-border px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-subtle sm:block lg:px-10">
            Built with
          </p>
          <div
            className="relative flex-1 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <VelocityMarquee>
              <ul className="flex">
                {stack.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-8 px-4 py-4 font-mono text-xs text-muted"
                  >
                    {item}
                    <span aria-hidden="true" className="h-1 w-1 bg-border-strong" />
                  </li>
                ))}
              </ul>
            </VelocityMarquee>
          </div>
        </div>
      </div>
    </section>
  );
}
