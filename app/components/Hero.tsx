import { siteConfig } from "@/app/data/portfolio";

export default function Hero() {
  return (
    <section
      id="intro"
      aria-label="Introduction"
      className="relative flex min-h-[calc(100svh-64px)] flex-col justify-center overflow-hidden border-b border-border px-6 py-20 sm:px-10 lg:min-h-screen lg:px-16"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-grid" />
      <span
        aria-hidden="true"
        className="absolute -right-6 top-10 select-none font-mono text-[8rem] font-bold leading-none text-foreground/[0.03] sm:text-[14rem]"
      >
        00
      </span>

      <div className="relative max-w-3xl">
        <p className="font-mono text-sm tracking-widest text-accent">
          {siteConfig.role.toUpperCase()}
        </p>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {siteConfig.name}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          I build full-stack products and AI agent systems &mdash; from
          FastAPI services to Next.js interfaces, wired together with the
          OpenAI Agents SDK.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            className="border border-accent bg-accent px-5 py-3 font-mono text-sm text-accent-foreground transition-opacity hover:opacity-90"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="border border-border px-5 py-3 font-mono text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Get in Touch
          </a>
        </div>

        <dl className="mt-16 grid max-w-lg grid-cols-1 gap-4 border-t border-border pt-6 font-mono text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted">STACK</dt>
            <dd className="mt-1 text-foreground">
              Python · TypeScript · Next.js · FastAPI
            </dd>
          </div>
          <div>
            <dt className="text-muted">FOCUS</dt>
            <dd className="mt-1 text-foreground">
              AI Agent Systems &amp; Full-Stack Apps
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
