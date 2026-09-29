"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICE_SELECT_EVENT } from "@/app/lib/track";

type Status = "idle" | "sending" | "sent" | "error";

const PREFILL_START = "We are interested in ";
const PREFILL_PATTERN = /^We are interested in [^.]*\.\s?/;

const fieldClass =
  "w-full rounded-sm border border-border bg-surface-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [prefill, setPrefill] = useState("");
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

  if (status === "sent") {
    return (
      <div
        role="status"
        className="card flex h-full flex-col items-start justify-center p-8 sm:p-10"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-accent/50 text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3
          ref={sentRef}
          tabIndex={-1}
          className="mt-5 text-xl font-semibold text-foreground outline-none"
        >
          Message sent.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Thanks for reaching out. You&apos;ll get a reply within one working
          day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-accent underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Your name"
            className={`mt-2 ${fieldClass}`}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@company.com"
            className={`mt-2 ${fieldClass}`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="company" className="text-sm font-medium text-foreground">
          Company <span className="text-muted">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          maxLength={160}
          autoComplete="organization"
          placeholder="Business name"
          className={`mt-2 ${fieldClass}`}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          What would you like to build? <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          ref={messageRef}
          key={prefill}
          defaultValue={prefill}
          required
          rows={5}
          maxLength={5000}
          placeholder="Tell us about the project or task you'd like help with."
          className={`mt-2 resize-y ${fieldClass}`}
        />
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="mt-5 rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-tactile mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        {status === "sending" ? null : <span aria-hidden="true">&rarr;</span>}
      </button>
    </form>
  );
}
