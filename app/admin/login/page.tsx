import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import Logo from "@/app/components/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main id="main" tabIndex={-1} className="outline-none bg-aurora flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Logo className="h-12 w-auto" priority />
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Restricted area. Only the site owner can sign in here.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          &larr; Back to the website
        </Link>
      </div>
    </main>
  );
}
