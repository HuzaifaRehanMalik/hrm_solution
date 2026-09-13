import CornerCard from "@/app/components/CornerCard";
import SectionHeading from "@/app/components/SectionHeading";
import { projects } from "@/app/data/portfolio";

export default function Projects() {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className="border-b border-border px-6 py-24 sm:px-10 lg:px-16"
    >
      <SectionHeading
        index="02"
        title="Selected Work"
        description="Placeholder entries below — swap in real projects with a specific problem, your role, and an outcome."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {projects.map((project) => (
          <CornerCard key={project.index} className="flex flex-col">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-muted">PROJECT_{project.index}</span>
              {project.placeholder ? (
                <span className="border border-border px-2 py-0.5 text-muted">
                  PLACEHOLDER
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {project.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <li
                  key={tag}
                  className="border border-border px-2 py-1 font-mono text-[11px] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-4 border-t border-border pt-4 font-mono text-xs">
              {project.placeholder ? (
                <span className="text-muted italic">
                  Add repo / live links
                </span>
              ) : (
                <>
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      className="text-foreground transition-colors hover:text-accent"
                    >
                      Repo ↗
                    </a>
                  ) : null}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      className="text-foreground transition-colors hover:text-accent"
                    >
                      Live ↗
                    </a>
                  ) : null}
                </>
              )}
            </div>
          </CornerCard>
        ))}
      </div>
    </section>
  );
}
