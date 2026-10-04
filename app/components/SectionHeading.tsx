import SplitReveal from "@/app/components/ui/SplitReveal";

/**
 * Asymmetric section header: index + eyebrow on a hairline, the title on the
 * left and the supporting copy pushed right on wide screens.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-14 sm:mb-20">
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        <span className="text-accent">{index}</span>
        <span className="h-px w-10 bg-border-strong" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <SplitReveal
          text={title}
          className="text-balance text-3xl font-medium leading-[1.05] tracking-tighter text-foreground sm:text-4xl md:text-5xl lg:col-span-7"
        />
        {description ? (
          <p className="max-w-[46ch] text-base leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
