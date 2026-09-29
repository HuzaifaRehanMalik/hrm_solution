import ContactForm from "@/app/components/ContactForm";
import SectionHeading from "@/app/components/SectionHeading";
import { siteConfig } from "@/app/data/site";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-aurora opacity-70" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Let's build together"
          title="Tell us what is eating your team's time"
          description="Describe the task in a few sentences. You'll get an honest answer on whether it is worth automating, and a rough scope if it is."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-5 lg:col-span-2">
            <div className="card p-6 sm:p-7">
              <p className="font-mono text-xs tracking-[0.2em] text-accent">
                DIRECT
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 block break-all text-base text-foreground transition-colors hover:text-accent"
              >
                {siteConfig.email}
              </a>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Prefer email? Write directly and you&apos;ll reach the same
                inbox.
              </p>
            </div>

            <div className="card flex-1 p-6 sm:p-7">
              <p className="font-mono text-xs tracking-[0.2em] text-accent">
                WHAT HAPPENS NEXT
              </p>
              <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
                <li className="flex gap-3">
                  <span className="font-mono text-accent">1</span>
                  <span>
                    A reply within one working day, with questions if the scope
                    is unclear.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent">2</span>
                  <span>
                    A short call to walk through how the task is done today.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent">3</span>
                  <span>
                    A written scope with a fixed outcome, timeline and price
                    before anything is built.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
