/** Small outbound-link arrow. An SVG, so it never renders as an emoji glyph. */
export default function ArrowUpRight({
  className = "h-3 w-3",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      className={`inline-block shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className}`}
    >
      <path d="M3.5 8.5 8.5 3.5M4.25 3.5H8.5V7.75" />
    </svg>
  );
}
