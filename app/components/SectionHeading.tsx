export default function SectionHeading({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 flex items-start gap-4 sm:mb-14">
      <span
        aria-hidden="true"
        className="font-mono text-sm text-accent pt-1.5"
      >
        {index}
      </span>
      <div className="flex-1 border-t border-border pt-1.5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-muted">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
