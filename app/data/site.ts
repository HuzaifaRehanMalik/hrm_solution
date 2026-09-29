export const siteConfig = {
  brand: "HRM Solution",
  tagline: "Smart tools for a better tomorrow",
  promise: "Automate · Innovate · Grow Together",
  founder: "Huzaifa Rehan",
  founderRole: "Founder & Lead Engineer",
  email: "rehanhuzaifa035@gmail.com",
  portfolioUrl: "https://huzaifa-rehan-portfolio.vercel.app/",
  githubUrl: "https://github.com/HuzaifaRehanMalik",
  url: "https://hrmsolution.com",
};

export const navSections = [
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "why", label: "Why HRM" },
  { id: "contact", label: "Contact" },
] as const;

export type Service = {
  title: string;
  description: string;
  icon: string;
};

export const services: Service[] = [
  {
    title: "AI Agents for Business Tasks",
    description:
      "Autonomous agents that handle the repetitive work your team does by hand: triage, follow-ups, data entry, routine decisions.",
    icon: "agents",
  },
  {
    title: "Workflow Automation",
    description:
      "The manual steps between your tools, replaced with a system that runs them reliably and tells you when something needs a human.",
    icon: "workflow",
  },
  {
    title: "AI Chatbots & Knowledge Assistants",
    description:
      "Assistants trained on your own documents and data, so staff and customers get accurate answers instead of searching for them.",
    icon: "chat",
  },
  {
    title: "AI-Powered Dashboards",
    description:
      "One screen that shows what is actually happening in the business, with the numbers explained rather than just plotted.",
    icon: "dashboard",
  },
  {
    title: "Custom Business Tools",
    description:
      "Internal software shaped around how you already work, not a generic product you have to bend your process around.",
    icon: "tools",
  },
  {
    title: "Data Processing & Reporting",
    description:
      "Messy spreadsheets and exports turned into clean pipelines and reports that arrive on schedule, without anyone rebuilding them.",
    icon: "data",
  },
  {
    title: "Inventory & Operations Systems",
    description:
      "Stock, orders and day-to-day operations tracked in one place, with alerts before a problem becomes expensive.",
    icon: "inventory",
  },
  {
    title: "API Integrations",
    description:
      "Your existing systems connected properly, so data moves between them automatically instead of being copied across by hand.",
    icon: "api",
  },
  {
    title: "Custom Web Applications",
    description:
      "Fast, modern web apps and sites built on Next.js and FastAPI, designed to be maintained, not thrown away in a year.",
    icon: "web",
  },
];

export type Step = {
  index: string;
  title: string;
  description: string;
};

export const process: Step[] = [
  {
    index: "01",
    title: "Understand the work",
    description:
      "We walk through how the task is done today, who touches it, and where the time actually goes. No proposal before that is clear.",
  },
  {
    index: "02",
    title: "Scope one outcome",
    description:
      "We pick the single highest-cost bottleneck and define what success looks like in hours saved or errors removed, in writing.",
  },
  {
    index: "03",
    title: "Build and test with you",
    description:
      "You see working software early and often. Your team tries it on real data while it is still cheap to change direction.",
  },
  {
    index: "04",
    title: "Deploy and hand over",
    description:
      "It ships with documentation and training so your team owns it. Ongoing support is available, never a requirement.",
  },
];

export type Benefit = {
  title: string;
  description: string;
  icon: string;
};

export const benefits: Benefit[] = [
  {
    title: "Save time",
    description:
      "Hours a week returned to your team by removing work that never needed a person in the first place.",
    icon: "clock",
  },
  {
    title: "Reduce manual work",
    description:
      "Fewer copy-paste steps between systems, and fewer of the small mistakes that come with them.",
    icon: "chart",
  },
  {
    title: "Boost productivity",
    description:
      "Your people spend their day on judgement and customers rather than on forms, exports and chasing status.",
    icon: "people",
  },
  {
    title: "Scale your business",
    description:
      "Systems that absorb more volume without a matching increase in headcount or overtime.",
    icon: "growth",
  },
];

export const stack = [
  "Python",
  "TypeScript",
  "Next.js",
  "FastAPI",
  "OpenAI Agents SDK",
  "PostgreSQL",
  "Qdrant",
  "Vercel",
];
