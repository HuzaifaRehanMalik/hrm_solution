"use client";

import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import { memo, useEffect, useRef, useState } from "react";

type Task = { id: string; label: string; meta: string; score: number };

const initial: Task[] = [
  { id: "a", label: "Refund request — order 88213", meta: "support", score: 0.42 },
  { id: "b", label: "Supplier invoice mismatch", meta: "finance", score: 0.87 },
  { id: "c", label: "New lead from website form", meta: "sales", score: 0.64 },
  { id: "d", label: "Contract renewal in 6 days", meta: "ops", score: 0.73 },
  { id: "e", label: "Duplicate customer record", meta: "data", score: 0.21 },
];

const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;
const IDLE_MS = 5000;

function Row({
  task,
  rank,
  onGrab,
  onRelease,
}: {
  task: Task;
  rank: number;
  onGrab: () => void;
  onRelease: () => void;
}) {
  const controls = useDragControls();
  const top = rank === 0;

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onRelease}
      transition={SPRING}
      whileDrag={{
        scale: 1.025,
        boxShadow: "0 18px 40px -18px rgb(2 12 16 / 0.9)",
        zIndex: 2,
      }}
      className={`relative flex items-center gap-4 border px-3 py-3 sm:px-4 ${
        top ? "border-accent/40 bg-[#0d1f24]" : "border-border bg-[#081016]"
      }`}
    >
      <button
        type="button"
        aria-label={`Drag to reorder: ${task.label}`}
        onPointerDown={(event) => {
          onGrab();
          controls.start(event);
        }}
        className="flex h-6 w-5 shrink-0 cursor-grab touch-none items-center justify-center text-subtle transition-colors hover:text-accent active:cursor-grabbing"
      >
        <svg viewBox="0 0 8 14" className="h-3.5 w-2" fill="currentColor" aria-hidden="true">
          {[1, 5, 9, 13].map((y) => (
            <g key={y}>
              <rect x="0" y={y - 1} width="2" height="2" />
              <rect x="6" y={y - 1} width="2" height="2" />
            </g>
          ))}
        </svg>
      </button>
      <span className="w-5 font-mono text-[11px] text-subtle">
        {String(rank + 1).padStart(2, "0")}
      </span>
      <span
        className={`flex-1 truncate text-[13px] ${top ? "text-foreground" : "text-muted"}`}
      >
        {task.label}
      </span>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:inline">
        {task.meta}
      </span>
      <span className="relative h-1 w-12 bg-border sm:w-14">
        <motion.span
          className="absolute inset-y-0 left-0 bg-accent"
          animate={{ width: `${Math.round(task.score * 100)}%` }}
          transition={SPRING}
        />
      </span>
    </Reorder.Item>
  );
}

/**
 * An agent re-ranking an inbox on a loop. Visitors can grab a row and
 * re-prioritise it themselves; the agent backs off while they do.
 */
function PriorityList() {
  const reduced = useReducedMotion();
  const [tasks, setTasks] = useState(() =>
    [...initial].sort((x, y) => y.score - x.score),
  );
  const [manual, setManual] = useState(false);
  const lastTouch = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (Date.now() - lastTouch.current < IDLE_MS) return;
      setManual(false);
      setTasks((prev) =>
        prev
          .map((t) => ({
            ...t,
            score: Math.min(0.98, Math.max(0.08, t.score + (Math.random() - 0.5) * 0.5)),
          }))
          .sort((x, y) => y.score - x.score),
      );
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  function onReorder(next: Task[]) {
    // Keep the bars honest: re-spread scores to match the visitor's order.
    const scores = [...next.map((t) => t.score)].sort((a, b) => b - a);
    setTasks(next.map((t, i) => ({ ...t, score: scores[i] })));
  }

  const touch = () => {
    lastTouch.current = Date.now();
    setManual(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
        <span>Shared inbox</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={manual ? "manual" : "auto"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="inline-flex items-center gap-2"
          >
            <span className="pulse-dot" aria-hidden="true" />
            {manual ? "Your order — agent paused" : "Ranked by urgency"}
          </motion.span>
        </AnimatePresence>
      </div>

      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={onReorder}
        className="flex flex-col gap-2"
        aria-label="Example inbox. Drag rows to reorder."
      >
        {tasks.map((task, i) => (
          <Row
            key={task.id}
            task={task}
            rank={i}
            onGrab={touch}
            onRelease={touch}
          />
        ))}
      </Reorder.Group>

      <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
        <span>
          Human <span className="text-accent">1</span> · Auto{" "}
          <span className="text-foreground">4</span>
        </span>
        <span className="hidden sm:inline">Grab a handle to re-prioritise</span>
      </div>
    </div>
  );
}

export default memo(PriorityList);
