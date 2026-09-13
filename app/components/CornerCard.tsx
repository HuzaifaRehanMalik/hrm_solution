import { ReactNode } from "react";

const corners = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

export default function CornerCard({
  children,
  className = "",
  dashed = false,
}: {
  children: ReactNode;
  className?: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={`relative border p-6 sm:p-7 ${
        dashed ? "border-dashed border-border/70" : "border-border bg-surface"
      } ${className}`}
    >
      {!dashed &&
        corners.map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={`pointer-events-none absolute h-3 w-3 border-accent ${position}`}
          />
        ))}
      {children}
    </div>
  );
}
