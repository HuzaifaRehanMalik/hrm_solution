/** Inline arrow that nudges right when its `group` parent is hovered. */
export default function ArrowRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 ${className}`}
    >
      <path d="M2.5 8h10.5M9 4l4 4-4 4" />
    </svg>
  );
}
