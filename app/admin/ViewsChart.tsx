"use client";

import { useEffect, useRef, useState } from "react";

export type DailyViews = { day: string; total: number };

const HEIGHT = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

const dayLabel = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const fullLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Rounds the axis max up to a tidy number so gridlines land on whole values. */
function niceMax(value: number) {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * step >= value) return m * step;
  }
  return 10 * step;
}

export default function ViewsChart({ data }: { data: DailyViews[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(280, Math.round(entry.contentRect.width))),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(0, ...data.map((d) => d.total)));
  const n = data.length;

  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.total)}`).join(" ");
  const area = `${line} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  // Show ~6 date labels whatever the range, always including the last day.
  const every = Math.max(1, Math.ceil(n / 6));
  const labelled = data
    .map((_, i) => i)
    .filter((i) => (n - 1 - i) % every === 0);

  function onMove(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const i = Math.round((px / rect.width) * (n - 1));
    setActive(Math.min(n - 1, Math.max(0, i)));
  }

  const point = active !== null ? data[active] : null;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        width={width}
        height={HEIGHT}
        aria-hidden="true"
        className="block"
      >
        <defs>
          <linearGradient id="views-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(t)}
              dy="0.32em"
              textAnchor="end"
              fontSize={11}
              fill="var(--muted)"
              className="tabular-nums"
            >
              {t}
            </text>
          </g>
        ))}

        {labelled.map((i) => (
          <text
            key={data[i].day}
            x={x(i)}
            y={HEIGHT - 8}
            textAnchor={i === n - 1 ? "end" : i === 0 ? "start" : "middle"}
            fontSize={11}
            fill="var(--muted)"
          >
            {dayLabel.format(new Date(data[i].day))}
          </text>
        ))}

        <path d={area} fill="url(#views-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {point && active !== null ? (
          <g pointerEvents="none">
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + innerH}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
            <circle
              cx={x(active)}
              cy={y(point.total)}
              r={5}
              fill="var(--accent)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </g>
        ) : null}

        <rect
          x={PAD.left}
          y={PAD.top}
          width={innerW}
          height={innerH}
          fill="transparent"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setActive(null)}
        />
      </svg>

      {point && active !== null ? (
        <div
          className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border-strong bg-surface-raised px-3 py-2 text-xs shadow-lg"
          style={{
            left: Math.min(width - 70, Math.max(70, x(active))),
          }}
        >
          <p className="text-muted">{fullLabel.format(new Date(point.day))}</p>
          <p className="mt-0.5 font-semibold tabular-nums text-foreground">
            {point.total.toLocaleString()} {point.total === 1 ? "view" : "views"}
          </p>
        </div>
      ) : null}

      {/* The chart is pointer-only; this gives screen readers the numbers. */}
      <table className="sr-only">
        <caption>Daily page views</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Views</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{fullLabel.format(new Date(d.day))}</td>
              <td>{d.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
