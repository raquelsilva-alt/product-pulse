// Presentational badges + sparkline used only by the Dashboard screen.

import type { Status, RoadStatus } from "@/lib/queries";

export function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Live: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Beta: "bg-amber-50 text-amber-700 border-amber-200",
    Pilot: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function RoadStatusBadge({ status }: { status: RoadStatus }) {
  const styles: Record<RoadStatus, string> = {
    Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
    Planned: "bg-amber-50 text-amber-700 border-amber-200",
    Backlog: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export const ROAD_EDGE: Record<RoadStatus, string> = {
  Done: "border-l-emerald-500",
  "In Progress": "border-l-sky-500",
  Planned: "border-l-amber-500",
  Backlog: "border-l-neutral-300",
};

function parseGrowth(growth: string): number | null {
  const m = growth.match(/^\+?(\d+)%$/);
  return m ? parseInt(m[1], 10) : null;
}

export function GrowthBadge({ growth, isNew }: { growth: string; isNew?: boolean }) {
  if (isNew) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-800">
        {growth}
      </span>
    );
  }
  const val = parseGrowth(growth);
  let classes = "inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-bold ";
  if (val === null) {
    classes += "border-neutral-200 bg-neutral-100 text-neutral-600";
  } else if (val <= 10) {
    classes += "border-emerald-200 bg-emerald-50 text-emerald-600";
  } else if (val <= 30) {
    classes += "border-emerald-300 bg-emerald-200 text-emerald-800";
  } else {
    classes += "border-emerald-600 bg-emerald-500 text-white";
  }
  return <span className={classes}>{growth}</span>;
}

export function MiniSparkline({ data }: { data: [number, number, number] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 28;
  const h = 14;
  const pad = 2;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="inline-block" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r="1.5" fill="#10b981" />;
      })}
    </svg>
  );
}
