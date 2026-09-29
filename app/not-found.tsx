import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/app/components/Logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="bg-aurora flex min-h-screen items-center justify-center px-5 py-16 outline-none"
    >
      <div className="w-full max-w-md">
        <Logo className="h-10 w-auto" />
        <p className="mt-10 font-mono text-xs tracking-[0.2em] text-accent">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The link may be old or mistyped. Everything on this site lives on the
          home page.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="btn-tactile inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Go to the home page
          </Link>
          <Link
            href="/#contact"
            className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
