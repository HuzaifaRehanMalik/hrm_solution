export const siteConfig = {
  name: "[Your Name]",
  role: "AI & Full-Stack Developer",
  email: "[your.email@example.com]",
  github: "[github.com/yourusername]",
  linkedin: "[linkedin.com/in/yourusername]",
};

export type SkillGroup = {
  label: string;
  items: string[];
  placeholder?: boolean;
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    label: "Backend & AI",
    items: ["FastAPI", "OpenAI Agents SDK", "REST APIs", "LLM Agent Systems"],
  },
  {
    label: "[Add a category]",
    items: [
      "[e.g. databases — PostgreSQL, MongoDB]",
      "[e.g. cloud — AWS, GCP, Azure]",
      "[e.g. tooling — Docker, CI/CD]",
    ],
    placeholder: true,
  },
];

export type Project = {
  index: string;
  title: string;
  description: string;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "[Project Name]",
    description:
      "[Replace with a real project. Describe the problem it solved, your specific role, and a concrete outcome or metric.]",
    stack: ["[Stack tag]", "[Stack tag]", "[Stack tag]"],
    placeholder: true,
  },
  {
    index: "02",
    title: "[Project Name]",
    description:
      "[Replace with a real project. Describe the problem it solved, your specific role, and a concrete outcome or metric.]",
    stack: ["[Stack tag]", "[Stack tag]", "[Stack tag]"],
    placeholder: true,
  },
  {
    index: "03",
    title: "[Project Name]",
    description:
      "[Replace with a real project. Describe the problem it solved, your specific role, and a concrete outcome or metric.]",
    stack: ["[Stack tag]", "[Stack tag]", "[Stack tag]"],
    placeholder: true,
  },
];

export const navSections = [
  { id: "intro", index: "00", label: "Intro" },
  { id: "skills", index: "01", label: "Skills" },
  { id: "work", index: "02", label: "Work" },
  { id: "contact", index: "03", label: "Contact" },
] as const;
