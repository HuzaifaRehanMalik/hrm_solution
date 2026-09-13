import { siteConfig } from "@/app/data/portfolio";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-border px-6 py-8 font-mono text-xs text-muted sm:flex-row sm:px-10 lg:px-16">
      <p>
        © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js.
      </p>
      <a href="#intro" className="transition-colors hover:text-accent">
        Back to top ↑
      </a>
    </footer>
  );
}
