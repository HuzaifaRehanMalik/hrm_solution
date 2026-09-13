import CornerCard from "@/app/components/CornerCard";
import SectionHeading from "@/app/components/SectionHeading";
import { skillGroups } from "@/app/data/portfolio";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="border-b border-border px-6 py-24 sm:px-10 lg:px-16"
    >
      <SectionHeading
        index="01"
        title="Skills"
        description="Grouped by where they show up in the stack, not a flat tag cloud."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <CornerCard key={group.label} dashed={group.placeholder}>
            <h3 className="font-mono text-xs tracking-widest text-accent">
              {group.label.toUpperCase()}
            </h3>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li
                  key={item}
                  className={`flex items-start gap-3 text-sm ${
                    group.placeholder ? "text-muted italic" : "text-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </CornerCard>
        ))}
      </div>
    </section>
  );
}
