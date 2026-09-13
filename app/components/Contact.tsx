import SectionHeading from "@/app/components/SectionHeading";
import { siteConfig } from "@/app/data/portfolio";

const fields = [
  { label: "EMAIL", value: siteConfig.email },
  { label: "GITHUB", value: siteConfig.github },
  { label: "LINKEDIN", value: siteConfig.linkedin },
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="px-6 py-24 sm:px-10 lg:px-16"
    >
      <SectionHeading index="03" title="Contact" />

      <div className="relative border border-border bg-surface p-8 sm:p-12">
        <p className="font-mono text-sm text-accent">$ contact --init</p>
        <h3 className="mt-4 max-w-lg text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Let&apos;s build something worth shipping.
        </h3>
        <p className="mt-4 max-w-lg text-muted">
          Open to full-stack and AI/agent-focused work. Reach out through any
          of the fields below.
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-6 md:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="font-mono text-xs tracking-widest text-muted">
                {field.label}
              </dt>
              <dd className="mt-2 text-sm text-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
