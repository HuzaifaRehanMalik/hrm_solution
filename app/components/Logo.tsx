import Image from "next/image";

const LOCKUP = { src: "/logo-full.png", width: 388, height: 160 };
const MARK = { src: "/logo-mark.png", width: 197, height: 256 };

/** Full HRM Solution lockup — icon plus wordmark. */
export default function Logo({
  className = "h-8 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      {...LOCKUP}
      alt="HRM Solution"
      priority={priority}
      className={className}
    />
  );
}

/** Icon only — for tight spots where the wordmark would not fit. */
export function LogoMark({ className = "h-6 w-auto" }: { className?: string }) {
  return <Image {...MARK} alt="" aria-hidden="true" className={className} />;
}
