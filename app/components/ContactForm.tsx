"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SERVICE_SELECT_EVENT } from "@/app/lib/track";

type Status = "idle" | "sending" | "sent" | "error";

const PREFILL_START = "We are interested in ";
const PREFILL_PATTERN = /^We are interested in [^.]*\.\s?/;

const fieldBase =
  "w-full border bg-background/70 px-4 py-3.5 text-[15px] text-foreground placeholder:text-subtle transition-colors duration-300 focus:bg-background focus:outline-none";

function fieldClass(invalid: boolean) {
  return `${fieldBase} ${
    invalid
      ? "border-red-400/60 focus:border-red-400"
      : "border-border-strong hover:border-muted/40 focus:border-accent"
  }`;
}

const messages: Record<string, { missing: string; format?: string }> = {
  name: { missing: "Please add your name." },
  email: {
    missing: "We need an email to reply to.",
    format: "That email address doesn't look complete.",
  },
  message: { missing: "A sentence or two about the task is enough." },
};

type FieldErrors = Partial<Record<string, string>>;

function validate(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  for (const name of Object.keys(messages)) {
    const el = form.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!el) continue;
    if (el.validity.valueMissing || !el.value.trim()) {
      errors[name] = messages[name].missing;
    } else if (el.validity.typeMismatch && messages[name].format) {
      errors[name] = messages[name].format;
    }
  }
  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [prefill, setPrefill] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);

  // The form unmounts on success; move focus to the confirmation so keyboard
  // and screen reader users aren't dropped back at the top of the page.
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  // Clicking a service card jumps here and starts the message off.
  useEffect(() => {
    function onSelect(event: Event) {
      const title = (event as CustomEvent<{ title?: string }>).detail?.title;
      if (!title) return;

      const text = `We are interested in ${title}. `;
      const current = messageRef.current?.value ?? "";
      setStatus("idle");
      // Swap only the auto-written first sentence; keep anything the
      // visitor has typed after it (or instead of it).
      const rest = current.startsWith(PREFILL_START)
        ? current.replace(PREFILL_PATTERN, "")
        : current;
      setPrefill(rest.trim() ? `${text}${rest}` : text);

      // Let the smooth scroll finish before taking focus.
      window.setTimeout(() => {
        const element = messageRef.current;
        if (!element) return;
        element.focus({ preventScroll: true });
        element.setSelectionRange(element.value.length, element.value.length);
      }, 700);
    }

    window.addEventListener(SERVICE_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(SERVICE_SELECT_EVENT, onSelect);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = validate(form);
    setFieldErrors(invalid);
    const firstInvalid = Object.keys(invalid)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setPrefill("");
      setStatus("sent");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function clearError(name: string) {
    if (!fieldErrors[name]) return;
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function errorFor(name: string) {
    const text = fieldErrors[name];
    return text ? (
      <p id={`${name}-error`} className="text-[13px] text-red-300">
        {text}
      </p>
    ) : null;
  }

  function describedBy(name: string, helper?: string) {
    const ids = [helper, fieldErrors[name] ? `${name}-error` : null].filter(Boolean);
    return ids.length ? ids.join(" ") : undefined;
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="card flex h-full min-h-[32rem] flex-col justify-between p-8 sm:p-12"
        style={{ animation: "fade-up 700ms var(--ease-out-expo) both" }}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center border border-accent/60 text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <motion.path
              d="m5 12.5 4.5 4.5L19 7.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
          </svg>
        </span>
        <div>
          <h3
            ref={sentRef}
            tabIndex={-1}
            className="text-3xl font-medium tracking-tight text-foreground outline-none"
          >
            Message received.
          </h3>
          <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-muted">
            Thanks for reaching out. You&apos;ll get a reply within one working
            day, usually with a couple of questions about how the task runs
            today.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="btn-tactile mt-8 border border-border-strong px-5 py-3 text-sm text-foreground hover:border-accent/60 hover:text-accent"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={sending}
      className="card relative p-6 sm:p-10"
    >
      <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
        <p className="text-sm font-medium text-foreground">Project enquiry</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
          Takes about 2 minutes
        </p>
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-foreground">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Mariam Qureshi"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={describedBy("name")}
            onInput={() => clearError("name")}
            className={fieldClass(Boolean(fieldErrors.name))}
          />
          {errorFor("name")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-foreground">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="mariam@company.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describedBy("email")}
            onInput={() => clearError("email")}
            className={fieldClass(Boolean(fieldErrors.email))}
          />
          {errorFor("email")}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label htmlFor="company" className="text-sm text-foreground">
          Company <span className="text-subtle">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          maxLength={160}
          autoComplete="organization"
          placeholder="Business name"
          className={fieldClass(false)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-foreground">
          What would you like to build? <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          ref={messageRef}
          key={prefill}
          defaultValue={prefill}
          required
          rows={6}
          maxLength={5000}
          placeholder="e.g. Every Monday someone spends three hours merging sales exports into one report."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={describedBy("message", "message-help")}
          onInput={() => clearError("message")}
          className={`resize-y ${fieldClass(Boolean(fieldErrors.message))}`}
        />
        {errorFor("message") ?? (
          <p id="message-help" className="text-[13px] text-subtle">
            What happens today, who does it, and roughly how often.
          </p>
        )}
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="mt-6 border-l-2 border-red-400/70 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse items-stretch gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-subtle">
          Only used to reply to you.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="btn-tactile btn-sweep group inline-flex items-center justify-center gap-2.5 bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground hover:bg-[#6ee0e5] disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? (
            <>
              <span className="h-1.5 w-1.5 animate-pulse bg-accent-foreground" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M2.5 8h10.5M9 4l4 4-4 4" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
