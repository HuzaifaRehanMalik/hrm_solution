import { memo } from "react";

const nodes = [
  { x: 12, label: "Form" },
  { x: 37, label: "Agent" },
  { x: 63, label: "CRM" },
  { x: 88, label: "Slack" },
];

/** Data moving through a pipeline. Pure SVG + CSS, no JS loop. */
function FlowDiagram() {
  return (
    <svg
      viewBox="0 0 100 40"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {nodes.slice(0, -1).map((node, i) => (
        <g key={node.label}>
          <line
            x1={node.x + 7}
            x2={nodes[i + 1].x - 7}
            y1="20"
            y2="20"
            stroke="var(--border-strong)"
            strokeWidth="0.4"
          />
          <line
            x1={node.x + 7}
            x2={nodes[i + 1].x - 7}
            y1="20"
            y2="20"
            stroke="var(--accent)"
            strokeWidth="0.5"
            className="flow-line"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
          {/* data packet travelling to the next node */}
          <rect y="19.2" width="1.6" height="1.6" fill="var(--accent)">
            <animate
              attributeName="x"
              values={`${node.x + 7};${nodes[i + 1].x - 8.6}`}
              dur="1.8s"
              begin={`${i * 0.6}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.85;1"
              dur="1.8s"
              begin={`${i * 0.6}s`}
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}
      {nodes.map((node, i) => (
        <g key={node.label}>
          <rect
            x={node.x - 7}
            y="13"
            width="14"
            height="14"
            fill="var(--background)"
            stroke={i === 1 ? "var(--accent)" : "var(--border-strong)"}
            strokeWidth="0.4"
          />
          {i === 1 ? (
            <rect x={node.x - 1.2} y="18.8" width="2.4" height="2.4" fill="var(--accent)">
              <animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" />
            </rect>
          ) : (
            <rect x={node.x - 1.2} y="18.8" width="2.4" height="2.4" fill="var(--muted)" />
          )}
          <text
            x={node.x}
            y="34"
            textAnchor="middle"
            fontSize="2.6"
            fill="var(--muted)"
            fontFamily="var(--font-geist-mono)"
            letterSpacing="0.3"
          >
            {node.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default memo(FlowDiagram);
