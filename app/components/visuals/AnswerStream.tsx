"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { memo, useEffect, useState } from "react";

const pairs = [
  {
    q: "What's our return window for opened items?",
    a: "14 days, unused and in original packaging. Opened electronics get store credit only.",
    src: "returns-policy.pdf · p.3",
  },
  {
    q: "Who signs off purchases over 250k?",
    a: "The operations director, with finance copied. Below that, team leads approve directly.",
    src: "approvals-handbook.docx",
  },
  {
    q: "When does the night shift hand over stock counts?",
    a: "By 06:30, through the shared count sheet. Gaps over 2% go to the floor manager.",
    src: "warehouse-sop.md · §4",
  },
];

/**
 * A knowledge assistant answering from company docs. Auto-advances, and
 * visitors can swipe / drag it sideways or use the dots to switch question.
 */
function AnswerStream() {
  const reduced = useReducedMotion();
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [chars, setChars] = useState(0);
  const pair = pairs[index];

  const go = (next: number, direction: number) => {
    setPage([(next + pairs.length) % pairs.length, direction]);
    setChars(0);
  };

  useEffect(() => {
    if (reduced) return;
    const done = chars >= pair.a.length;
    const timer = window.setTimeout(
      () => {
        if (done) {
          setPage(([i]) => [(i + 1) % pairs.length, 1]);
          setChars(0);
        } else {
          setChars((c) => c + 2);
        }
      },
      done ? 4200 : chars === 0 ? 700 : 22,
    );
    return () => window.clearTimeout(timer);
  }, [chars, pair, reduced]);

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -50) go(index + 1, 1);
    else if (swipe > 50) go(index - 1, -1);
  }

  const shown = reduced ? pair.a.length : chars;

  return (
    <div className="flex h-full flex-col justify-end gap-4">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={onDragEnd}
            className="flex cursor-grab touch-pan-y select-none flex-col gap-3 active:cursor-grabbing"
          >
            <p className="self-end border border-border-strong bg-surface-raised px-3.5 py-2.5 text-[13px] text-foreground">
              {pair.q}
            </p>
            <div className="max-w-[92%] border-l border-accent/60 pl-3.5">
              <p className="min-h-[2.8rem] text-[13px] leading-relaxed text-muted">
                {pair.a.slice(0, shown)}
                {shown < pair.a.length ? <span className="caret" aria-hidden="true" /> : null}
              </p>
              <p
                className={`mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-opacity duration-500 ${
                  shown >= pair.a.length ? "opacity-100" : "opacity-0"
                }`}
              >
                Source: {pair.src}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5" role="tablist" aria-label="Example questions">
          {pairs.map((p, i) => (
            <button
              key={p.q}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Question ${i + 1}`}
              onClick={() => go(i, i > index ? 1 : -1)}
              className="relative h-1 w-6 bg-border-strong"
            >
              {i === index ? (
                <motion.span
                  layoutId="answer-dot"
                  className="absolute inset-0 bg-accent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : null}
            </button>
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          Swipe to switch
        </span>
      </div>
    </div>
  );
}

export default memo(AnswerStream);
