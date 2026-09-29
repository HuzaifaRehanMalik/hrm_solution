import type { Metadata } from "next";
import { MIN_PASSWORD_LENGTH, requireAdmin } from "@/app/lib/auth";
import AdminHeader from "../AdminHeader";
import PasswordForm from "./PasswordForm";

export const metadata: Metadata = {
  title: "Change password",
  robots: { index: false, follow: false },
};

export default async function ChangePasswordPage() {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.email} current="password" />

      <main id="main" tabIndex={-1} className="outline-none mx-auto max-w-xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Change password
        </h1>
        <p className="mt-2 text-sm text-muted">
          Signed in as {session.email}. Changing your password signs out every
          other browser.
        </p>

        <div className="mt-8">
          <PasswordForm minLength={MIN_PASSWORD_LENGTH} />
        </div>
      </main>
    </div>
  );
}
