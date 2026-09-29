"use client";

import Link from "next/link";
import { primaryButton } from "@/app/admin/ui";

/**
 * Shown when an admin page or action fails (usually the database being
 * briefly unreachable), instead of Next.js' generic error screen.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center px-4 py-16 outline-none"
    >
      <div className="card w-full max-w-md p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The dashboard couldn&apos;t load its data. This is usually the
          database being briefly unreachable. Try again in a moment.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="button" onClick={reset} className={primaryButton}>
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            Back to the website
          </Link>
        </div>
      </div>
    </main>
  );
}
