import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollProgressProbe from "@/app/motion-lab/ScrollProgressProbe";

export const metadata: Metadata = {
  title: "Motion lab",
  robots: { index: false, follow: false },
};

/**
 * Development-only harness for the motion foundation. Returns 404 in
 * production builds.
 */
export default function MotionLabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="px-5 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="flex min-h-[110vh] flex-col justify-center gap-4">
          <p className="font-mono text-xs text-accent">motion-lab</p>
          <h1 className="text-4xl font-semibold">Scroll-progress probe</h1>
          <p className="max-w-prose text-muted">
            Scroll down. The bar below tracks the probe element&apos;s progress
            from entering the bottom of the viewport (0) to leaving the top (1).
          </p>
          <a href="#probe" className="self-start text-accent underline">
            Jump to probe
          </a>
        </section>

        <ScrollProgressProbe />

        <section className="flex min-h-[130vh] items-end pb-24">
          <button
            type="button"
            className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground"
          >
            End of page
          </button>
        </section>
      </div>
    </main>
  );
}
