import Link from "next/link";
import { logout } from "@/app/admin/actions";
import Logo from "@/app/components/Logo";

type Props = {
  email: string;
  current: "dashboard" | "password";
};

const links = [
  { key: "dashboard", href: "/admin", label: "Dashboard" },
  { key: "password", href: "/admin/password", label: "Change password" },
] as const;

export default function AdminHeader({ email, current }: Props) {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/admin" aria-label="Admin dashboard home">
            <Logo className="h-9 w-auto" priority />
          </Link>
          <div className="min-w-0 border-l border-border pl-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Admin
            </p>
            <p className="mt-0.5 truncate text-sm text-muted">{email}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              aria-current={current === link.key ? "page" : undefined}
              className={`rounded-sm px-4 py-2 text-sm transition-colors ${
                current === link.key
                  ? "bg-surface-raised text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-sm px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-sm border border-border-strong px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
