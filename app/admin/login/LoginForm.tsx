"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import { login } from "@/app/admin/actions";
import { errorBox, fieldClass, primaryButton } from "@/app/admin/ui";

// If the request never reaches the server (dev server restarting, network
// dropped), show a message instead of crashing into the error overlay.
async function safeLogin(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    return await login(state, formData);
  } catch (error) {
    // redirect() after a successful sign-in is thrown on purpose; let it through.
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return {
      error:
        "Couldn't reach the server. Check your connection, reload the page and try again.",
    };
  }
}

export default function LoginForm() {
  const [state, action, pending] = useActionState(safeLogin, undefined);

  return (
    <form action={action} className="card p-6 sm:p-8">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={256}
          className={fieldClass}
        />
      </div>

      {state?.error ? (
        <p role="alert" className={`mt-5 ${errorBox}`}>
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`mt-7 w-full ${primaryButton}`}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
