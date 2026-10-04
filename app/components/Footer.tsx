import ArrowUpRight from "@/app/components/ArrowUpRight";
import Logo from "@/app/components/Logo";
import ArrowRight from "@/app/components/ui/ArrowRight";
import Wordmark from "@/app/components/ui/Wordmark";
import { navSections, siteConfig } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border px-5 pt-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <a href="#top" aria-label={`${siteConfig.brand} home`} className="inline-block">
              <Logo className="h-10 w-auto" />
            </a>
            <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-muted">
              AI agents, automation and custom software for businesses that
              want their time back.
            </p>
            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-3 border-b border-border-strong pb-1 text-base tracking-tight text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Start a project
              <ArrowRight />
            </a>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
              Site
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {navSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
              Elsewhere
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-muted transition-colors hover:text-foreground"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
                >
                  Founder portfolio
                  <ArrowUpRight />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
                >
                  GitHub
                  <ArrowUpRight />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.brand}
          </p>
          <p>{siteConfig.promise}</p>
        </div>
      </div>

      {/* Oversized outlined wordmark, cropped by the page edge. */}
      <Wordmark text={siteConfig.brand} />
    </footer>
  );
}
