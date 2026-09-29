import ArrowUpRight from "@/app/components/ArrowUpRight";
import Logo from "@/app/components/Logo";
import { navSections, siteConfig } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-border px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <a href="#top" aria-label={`${siteConfig.brand} home`}>
              <Logo className="h-9 w-auto" />
            </a>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Technology for real progress. AI agents, automation and custom
              software for businesses that want their time back.
            </p>
            <p className="mt-5 font-mono text-xs tracking-[0.2em] text-accent">
              {siteConfig.promise.toUpperCase()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="font-mono text-xs tracking-[0.2em] text-muted">
                SITE
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                {navSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-foreground transition-colors hover:text-accent"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-mono text-xs tracking-[0.2em] text-muted">
                ELSEWHERE
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-foreground transition-colors hover:text-accent"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
                  >
                    Portfolio
                    <ArrowUpRight />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
                  >
                    GitHub
                    <ArrowUpRight />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.brand}. All rights
            reserved.
          </p>
          <p>WEB · AI · AUTOMATION · GROWTH</p>
        </div>
      </div>
    </footer>
  );
}
