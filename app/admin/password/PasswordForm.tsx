"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/admin/actions";
import { changePassword } from "@/app/admin/actions";
import {
  errorBox,
  fieldClass,
  primaryButton,
  successBox,
} from "@/app/admin/ui";

type Result = FormState & { at?: number };

// If the request never reaches the server (dev server restarting, network
// dropped), show a message instead of crashing into the error overlay.
async function safeChangePassword(
  state: Result | undefined,
  formData: FormData,
): Promise<Result | undefined> {
  try {
    const result = await changePassword(state, formData);
    // A timestamp makes every result unique, so the form resets after
    // each successful change, not just the first one.
    return { ...result, at: Date.now() };
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT"))
      throw error;
    return {
      error:
        "Couldn't reach the server. Check your connection, reload the page and try again.",
    };
  }
}

function PasswordField({
  id,
  label,
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  autoComplete: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${fieldClass} pr-16`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={
            visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`
          }
          className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 rounded-sm px-2 py-1 text-xs text-muted transition-colors hover:text-accent"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function PasswordForm({ minLength }: { minLength: number }) {
  const [state, action, pending] = useActionState(
    safeChangePassword,
    undefined,
  );
  const succeeded = Boolean(state?.success);

  return (
    <div>
      {/* Validation happens on the server so every problem gets a clear
          message here, rather than a browser tooltip that's easy to miss. */}
      <form
        action={action}
        noValidate
        key={succeeded ? `done-${state?.at}` : "form"}
        className="card space-y-5 p-6 sm:p-8"
      >
        <PasswordField
          id="current"
          label="Current password"
          autoComplete="off"
          hint="The password you signed in with. Type it yourself rather than letting the browser fill it."
        />
        <PasswordField
          id="next"
          label="New password"
          autoComplete="new-password"
          hint={`At least ${minLength} characters.`}
        />
        <PasswordField
          id="confirm"
          label="Confirm new password"
          autoComplete="new-password"
        />

        {state?.error ? (
          <p role="alert" className={errorBox}>
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={`mt-2 ${primaryButton}`}
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>

      {succeeded ? (
        <p role="status" className={`mt-5 ${successBox}`}>
          {state?.success}
        </p>
      ) : null}
    </div>
  );
}
