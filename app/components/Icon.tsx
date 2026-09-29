import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  agents: (
    <>
      <circle cx="8" cy="7" r="2.5" />
      <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13a4.5 4.5 0 0 1 4.5 4.5V19" />
      <circle cx="17.5" cy="7" r="1.5" />
      <circle cx="17.5" cy="17" r="1.5" />
      <path d="M17.5 8.5v7" />
      <path d="M12.5 15h3.5" />
    </>
  ),
  workflow: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v10H9l-5 3.5z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9h17" />
      <path d="M7.5 16l2.5-3 2.5 2 4-4.5" />
    </>
  ),
  tools: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M17 13.5v7M13.5 17h7" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.75" />
      <path d="M5 6v12c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75V6" />
      <path d="M5 12c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75" />
    </>
  ),
  inventory: (
    <>
      <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
      <path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9" />
    </>
  ),
  api: (
    <>
      <path d="M9.5 14.5 7 17a3.5 3.5 0 0 1-5-5l2.5-2.5" />
      <path d="M14.5 9.5 17 7a3.5 3.5 0 0 1 5 5l-2.5 2.5" />
      <path d="M9 15l6-6" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19.5v-1A4.5 4.5 0 0 1 7.5 14h3a4.5 4.5 0 0 1 4.5 4.5v1" />
      <path d="M16 5.6a3 3 0 0 1 0 4.8M17.5 14h.5a4.5 4.5 0 0 1 4.5 4.5v1" />
    </>
  ),
  growth: (
    <>
      <path d="M4 17 9.5 11l3.5 3.2L20 7" />
      <path d="M15 7h5v5" />
    </>
  ),
};

export default function Icon({
  name,
  ...props
}: { name: string } & SVGProps<SVGSVGElement>) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {content}
    </svg>
  );
}
