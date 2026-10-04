"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { memo, useEffect, useState } from "react";

type Scenario = { prompt: string; source: string; steps: string[] };

const scenarios: Scenario[] = [
  {
    prompt: "Chase every unpaid invoice older than 30 days",
    source: "accounts.xlsx",
    steps: [
      "Read 214 rows from the receivables sheet",
      "Matched 37 overdue accounts to contacts",
      "Drafted 37 reminders in your tone",
      "Queued for your approval",
    ],
  },
  {
    prompt: "Summarise yesterday's support tickets by urgency",
    source: "helpdesk",
    steps: [
      "Pulled 86 tickets from the inbox",
      "Grouped them into 9 recurring themes",
      "Flagged 4 that need a human today",
      "Posted the digest to #operations",
    ],
  },
  {
    prompt: "Reorder anything with under two weeks of stock",
    source: "inventory db",
    steps: [
      "Checked 1,148 SKUs against sales velocity",
      "Found 23 below the reorder line",
      "Built 3 supplier orders, grouped by vendor",
      "Waiting on sign-off before sending",
    ],
  },
];

type Phase = "typing" | "thinking" | "running" | "done";

const TYPE_MS = 34;

function AgentConsole() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [stepCount, setStepCount] = useState(0);

  const scenario = scenarios[index];

  useEffect(() => {
    // Reduced motion: the finished run is rendered statically below.
    if (reduced) return;

    let timer: number;
    if (phase === "typing") {
      if (chars < scenario.prompt.length) {
        timer = window.setTimeout(() => setChars((c) => c + 1), TYPE_MS);
      } else {
        timer = window.setTimeout(() => setPhase("thinking"), 380);
      }
    } else if (phase === "thinking") {
      timer = window.setTimeout(() => setPhase("running"), 1300);
    } else if (phase === "running") {
      if (stepCount < scenario.steps.length) {
        timer = window.setTimeout(() => setStepCount((s) => s + 1), 520);
      } else {
        timer = window.setTimeout(() => setPhase("done"), 200);
      }
    } else {
      timer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % scenarios.length);
        setChars(0);
        setStepCount(0);
        setPhase("typing");
      }, 3200);
    }
    return () => window.clearTimeout(timer);
  }, [phase, chars, stepCount, scenario, reduced]);

  // Reduced motion shows the first run, finished, with no loop.
  const shownChars = reduced ? scenario.prompt.length : chars;
  const shownSteps = reduced ? scenario.steps.length : stepCount;
  const shownPhase: Phase = reduced ? "done" : phase;

  return (
    <div
      className="card relative overflow-hidden bg-surface/90 backdrop-blur-md"
      aria-label="Example of an AI agent working through a task"
      role="img"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            ops-agent
          </span>
        </div>
        <span className="font-mono text-[11px] text-subtle">
          run {String(index + 412).padStart(4, "0")}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Command input */}
        <div className="border border-border-strong bg-background/60 px-4 py-3.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
            Task
          </p>
          <p className="mt-2 min-h-[3rem] text-[15px] leading-snug text-foreground">
            {scenario.prompt.slice(0, shownChars)}
            {shownPhase === "typing" ? <span className="caret" aria-hidden="true" /> : null}
          </p>
        </div>

        {/* Status line */}
        <div className="mt-4 flex h-5 items-center justify-between font-mono text-[11px]">
          <span className="text-subtle">source: {scenario.source}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={shownPhase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={
                shownPhase === "thinking"
                  ? "shimmer-text"
                  : shownPhase === "done"
                    ? "text-accent"
                    : "text-muted"
              }
            >
              {shownPhase === "typing"
                ? "listening"
                : shownPhase === "thinking"
                  ? "planning steps"
                  : shownPhase === "running"
                    ? "executing"
                    : "complete"}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Steps */}
        <ol className="mt-4 min-h-[7.25rem] space-y-2.5">
          <AnimatePresence initial={false}>
            {scenario.steps.slice(0, shownSteps).map((step, i) => {
              const last = i === scenario.steps.length - 1;
              return (
                <motion.li
                  key={`${index}-${step}`}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="flex items-start gap-3 text-[13px] leading-snug"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                      last ? "border-accent/60 text-accent" : "border-border-strong text-muted"
                    }`}
                  >
                    <svg viewBox="0 0 10 10" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="m2 5.2 2 2L8 3" />
                    </svg>
                  </span>
                  <span className={last ? "text-foreground" : "text-muted"}>{step}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>

      {/* Progress */}
      <div className="h-px w-full bg-border">
        <motion.div
          className="h-px origin-left bg-accent"
          animate={{
            scaleX:
              shownPhase === "typing"
                ? 0.05
                : shownPhase === "thinking"
                  ? 0.2
                  : 0.2 + (0.8 * shownSteps) / scenario.steps.length,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}

export default memo(AgentConsole);
