import { createFileRoute, Link } from "@tanstack/react-router";
import { USE_CASES, slugify } from "@/data/useCases";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Measure it · AI Operations Platform — Product Health Dashboard" },
      {
        name: "description",
        content:
          "Measure it · AI Operations Platform — Product Health Dashboard. Traffic, pipeline, use cases, roadmap and Q3 2026 forecast in one view.",
      },
    ],
  }),
  component: Dashboard,
});

// ---------- Data ----------

const KPIS = [
  { label: "Active use cases", value: "12", delta: "+2 vs Q1" },
  { label: "Monthly requests", value: "4,700", delta: "+4.7% vs Q1 avg" },
  { label: "Active users", value: "280", delta: "+6.9% vs Q1" },
  { label: "Resolution rate", value: "89%", delta: "+3 pp vs Q1" },
];

const TRAFFIC = [
  { m: "Oct", actual: 3200 },
  { m: "Nov", actual: 3450 },
  { m: "Dec", actual: 3100 },
  { m: "Jan", actual: 3800 },
  { m: "Feb", actual: 4100 },
  { m: "Mar", actual: 4500 },
  { m: "Apr", actual: 4600 },
  { m: "May", actual: 4900 },
  { m: "Jun", actual: 4700, forecast: 4700 },
  { m: "Jul", forecast: 5100 },
  { m: "Aug", forecast: 5400 },
  { m: "Sep", forecast: 5650 },
];

const PIPELINE = [
  { stage: "Registered", value: 420 },
  { stage: "Onboarded", value: 341 },
  { stage: "Active (30d)", value: 280 },
  { stage: "Power users", value: 95 },
  { stage: "Champions", value: 32 },
];

type Status = "Live" | "Beta" | "Pilot";


const MAX_USE_CASE = Math.max(...USE_CASES.map((u) => u.count));

type RoadStatus = "Done" | "In Progress" | "Planned" | "Backlog";
const ROADMAP: {
  quarter: string;
  badge: string;
  dot: string;
  items: { title: string; status: RoadStatus; tag: string }[];
}[] = [
  {
    quarter: "Q2 · 2026",
    badge: "CURRENT",
    dot: "bg-sky-500",
    items: [
      { title: "Neo4j RAG optimization", status: "Done", tag: "INFRA" },
      { title: "ITSM integration v2", status: "Done", tag: "INTEGRATION" },
      { title: "Multi-modal input support", status: "In Progress", tag: "FEATURE" },
    ],
  },
  {
    quarter: "Q3 · 2026",
    badge: "",
    dot: "bg-amber-600",
    items: [
      { title: "Predictive ticket routing", status: "Planned", tag: "AI/ML" },
      { title: "Self-service onboarding", status: "Planned", tag: "UX" },
      { title: "Analytics dashboard v2", status: "Planned", tag: "FEATURE" },
      { title: "Multi-agent orchestration", status: "Planned", tag: "AI/ML" },
    ],
  },
  {
    quarter: "Q4 · 2026",
    badge: "",
    dot: "bg-neutral-400",
    items: [
      { title: "Voice interface", status: "Backlog", tag: "FEATURE" },
      { title: "Enterprise SSO enhance.", status: "Backlog", tag: "SECURITY" },
      { title: "API rate limit mgmt", status: "Backlog", tag: "INFRA" },
    ],
  },
];

const FORECAST = [
  { label: "Peak monthly requests", value: "5,650", sub: "September 2026" },
  { label: "Projected active users", value: "338", sub: "+20.7% from Jun" },
  { label: "New use case launches", value: "2", sub: "Routing + onboarding" },
  { label: "Est. resolution rate", value: "92%", sub: "↑ +3 pp from Q2" },
];

// ---------- Helpers ----------

function StatusBadge({ status }: { status: Status }) {
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

function RoadStatusBadge({ status }: { status: RoadStatus }) {
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

const ROAD_EDGE: Record<RoadStatus, string> = {
  Done: "border-l-emerald-500",
  "In Progress": "border-l-sky-500",
  Planned: "border-l-amber-500",
  Backlog: "border-l-neutral-300",
};

function parseGrowth(growth: string): number | null {
  const m = growth.match(/^\+?(\d+)%$/);
  return m ? parseInt(m[1], 10) : null;
}

function GrowthBadge({ growth, isNew }: { growth: string; isNew?: boolean }) {
  if (isNew) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
        {growth}
      </span>
    );
  }
  const val = parseGrowth(growth);
  let classes = "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ";
  if (val === null) {
    classes += "border-neutral-200 bg-neutral-100 text-neutral-600";
  } else if (val <= 10) {
    classes += "border-emerald-200 bg-emerald-50/70 text-emerald-600";
  } else if (val <= 30) {
    classes += "border-emerald-200 bg-emerald-100 text-emerald-700";
  } else {
    classes += "border-emerald-300 bg-emerald-200 text-emerald-800";
  }
  return <span className={classes}>{growth}</span>;
}

function MiniSparkline({ data }: { data: [number, number, number] }) {
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

// ---------- Component ----------

function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 tabular-nums">
      <div className="mx-auto max-w-[1280px] px-8 py-8">
        {/* Header */}
        <header className="mb-6 border-b border-neutral-200 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                Measure it · AI Operations Platform
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                Product health dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span>Q2 2026 · Jun 4</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Healthy · 82/100
              </span>
            </div>
          </div>
        </header>

        {/* KPI strip */}
        <section className="mb-6 grid grid-cols-4 gap-4">
          {KPIS.map((k) => (
            <div
              key={k.label}
              className="rounded-md border border-neutral-200 bg-white px-5 py-4"
            >
              <p className="text-xs text-neutral-500">{k.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{k.value}</p>
              <p className="mt-2 text-xs text-emerald-600">↑ {k.delta}</p>
            </div>
          ))}
        </section>

        {/* Traffic & Forecast */}
        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              Traffic & forecast — Q4 '25 to Q3 '26
            </h2>
            <div className="flex items-center gap-5 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-6 bg-sky-500" /> Actual requests
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-0.5 w-6"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, #BA7517 0 4px, transparent 4px 8px)",
                  }}
                />
                Q3 2026 forecast
              </span>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BA7517" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#BA7517" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
                  domain={[3000, 6000]}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#actualFill)"
                  connectNulls
                  name="Actual"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#BA7517"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                  fill="url(#forecastFill)"
                  connectNulls
                  name="Forecast"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Two column: Pipeline + Use cases */}
        <section className="mb-6 grid grid-cols-3 gap-4">
          {/* Pipeline */}
          <div className="rounded-md border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              User pipeline
            </h2>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PIPELINE} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                  <CartesianGrid stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tick={{ fontSize: 11, fill: "#525252" }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="value" fill="#93c5fd" radius={[0, 2, 2, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-600">Activation rate</span>
                <span className="font-medium text-sky-600">66.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Power user rate</span>
                <span className="font-medium text-sky-600">22.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Champion rate</span>
                <span className="font-medium text-sky-600">7.6%</span>
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div className="col-span-2 rounded-md border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              Use case activity — 12 total · monthly requests
            </h2>
            <div className="space-y-2">
              {USE_CASES.map((u) => {
                const pct = (u.count / MAX_USE_CASE) * 100;
                const isBreakout = u.name === "Code review assist";
                return (
                  <Link
                    key={u.name}
                    to="/use-case/$slug"
                    params={{ slug: slugify(u.name) }}
                    className={`grid grid-cols-[180px_60px_1fr_60px_86px] items-center gap-3 rounded px-1 py-1 text-xs transition-colors hover:bg-neutral-100 ${
                      isBreakout ? "bg-amber-50/60 hover:bg-amber-100/60" : ""
                    }`}
                  >
                    <span className="truncate text-neutral-800">{u.name}</span>
                    <StatusBadge status={u.status} />
                    <div className="h-1.5 w-full rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full ${
                          u.status === "Live"
                            ? "bg-sky-500"
                            : u.status === "Beta"
                              ? "bg-amber-500"
                              : "bg-neutral-300"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-right font-medium text-neutral-900">
                      {u.count.toLocaleString()}
                    </span>
                    <div className="flex items-center justify-end gap-1.5">
                      <GrowthBadge growth={u.growth} isNew={u.isNew} />
                      <MiniSparkline data={u.trend} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
            Product roadmap — Q2–Q4 2026
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {ROADMAP.map((col) => (
              <div key={col.quarter}>
                <div className="mb-3 flex items-center gap-2 text-xs text-neutral-700">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="font-medium">{col.quarter}</span>
                  {col.badge && (
                    <span className="rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                      {col.badge}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {col.items.map((it) => (
                    <div
                      key={it.title}
                      className={`rounded-sm border border-neutral-200 border-l-2 ${ROAD_EDGE[it.status]} bg-white px-3 py-2.5`}
                    >
                      <p className="text-sm font-medium text-neutral-900">{it.title}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <RoadStatusBadge status={it.status} />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                          {it.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Forecast summary */}
        <section className="mb-6 rounded-md border border-amber-200 bg-amber-50/40 p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">
            Q3 2026 forecast — based on Q2 trends
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {FORECAST.map((f) => (
              <div key={f.label} className="rounded-md border border-amber-200 bg-white px-4 py-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  {f.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-900">
                  {f.value}
                </p>
                <p className="mt-1 text-xs text-neutral-500">{f.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Field signals */}
        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
            Field signals
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              {
                q: "I spend 45 minutes every Friday pulling data from three different tools just to build one slide.",
                a: "IT Platform PM, sprint retro",
              },
              {
                q: "I didn't know Code Review was up 44% until the QBR. I would have invested in it a month earlier.",
                a: "IT Operations Lead, post-QBR debrief",
              },
              {
                q: "The forecast is useful but I won't show it to my VP without knowing where the numbers come from.",
                a: "Enterprise Architect, dashboard review",
              },
            ].map((s) => (
              <blockquote
                key={s.a}
                className="border-l-2 border-sky-300 bg-neutral-50/60 px-4 py-3"
              >
                <p className="italic text-neutral-700">"{s.q}"</p>
                <footer className="mt-2 text-xs text-neutral-500">— {s.a}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <footer className="border-t border-neutral-200 pt-4 text-center text-xs text-neutral-400">
          Measure it · AI Operations Platform · Product Health Dashboard · Q2 2026
        </footer>
      </div>
    </div>
  );
}
