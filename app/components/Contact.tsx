import ContactForm from "@/app/components/ContactForm";
import { siteConfig } from "@/app/data/site";
import SplitReveal from "@/app/components/ui/SplitReveal";

const nextSteps = [
  "A reply within one working day, with questions if the scope is unclear.",
  "A short call to walk through how the task is done today.",
  "A written scope with a fixed outcome, timeline and price before anything is built.",
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-border px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-aurora opacity-80" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            <span className="text-accent">04</span>
            <span className="h-px w-10 bg-border-strong" aria-hidden="true" />
            <span>Start a project</span>
          </div>
          <SplitReveal text="Tell us what is eating your team's time." className="mt-7 max-w-[15ch] text-balance text-3xl font-medium leading-[1.05] tracking-tighter text-foreground sm:text-4xl md:text-5xl" />
          <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-muted">
            Describe the task in a few sentences. You&apos;ll get an honest
            answer on whether it is worth automating, and a rough scope if it
            is.
          </p>

          <div className="mt-12 border-t border-border pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
              Direct
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group mt-3 inline-flex items-center gap-2 break-all text-lg tracking-tight text-foreground transition-colors hover:text-accent"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
              What happens next
            </p>
            <ol className="mt-6 space-y-5">
              {nextSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-relaxed text-muted">
                  <span className="font-mono text-[11px] leading-6 text-accent">
                    0{index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
