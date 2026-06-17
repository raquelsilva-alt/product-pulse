// Use Case Detail screen — pure presentation. Data + state are passed in by the route.

import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyTrend, type UseCase } from "@/lib/queries";
import {
  ChartSkeleton,
  EmptyMessage,
  ErrorMessage,
  SkeletonLine,
  StateToggle,
  type DataState,
} from "@/components/states";
import { StatusBadge } from "./badges";

const PLACEHOLDER_UC: UseCase = {
  id: "placeholder",
  name: "—",
  status: "Live",
  count: 0,
  growth: "",
  isNew: false,
  trend: [0, 0, 0],
  category: "—",
  activeUsers: 0,
  resolutionRate: 0,
  departments: [
    { name: "—", share: 0 },
    { name: "—", share: 0 },
    { name: "—", share: 0 },
  ],
};

export type UseCaseDetailScreenProps = {
  slug: string;
  state: DataState;
  urlState: DataState | undefined;
  uc: UseCase | undefined;
  onRetry: () => void;
};

export function UseCaseDetailScreen({
  slug: _slug,
  state,
  urlState,
  uc,
  onRetry,
}: UseCaseDetailScreenProps) {
  const view = state === "ready" && uc ? uc : PLACEHOLDER_UC;

  const fetchFailed = state === "error";
  const loading = state === "loading";
  const empty = state === "empty";

  const data = monthlyTrend(view);
  const first = data[0].actual;
  const last = data[data.length - 1].actual;
  const prev = data[data.length - 2].actual;
  const mom = prev ? Math.round(((last - prev) / prev) * 100) : 0;

  const cards = [
    { label: "Monthly requests", value: view.count.toLocaleString(), sub: `vs ${first.toLocaleString()} 6 mo ago` },
    { label: "MoM growth", value: view.isNew ? "New" : `${mom >= 0 ? "+" : ""}${mom}%`, sub: "month over month" },
    { label: "Active users", value: view.activeUsers.toString(), sub: "on this use case" },
    { label: "Resolution rate", value: `${view.resolutionRate}%`, sub: "auto-resolved" },
  ];

  const maxDept = Math.max(1, ...view.departments.map((d) => d.share));

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 tabular-nums">
      <div className="mx-auto max-w-[1280px] px-8 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900"
          >
            ← Back to dashboard
          </Link>
          <StateToggle basePath="/use-case/$slug" current={urlState} />
        </div>

        <header className="mb-6 border-b border-neutral-200 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                Use case detail
              </p>
              <h1 className="mt-1 flex items-center gap-3 text-2xl font-semibold tracking-tight text-neutral-900">
                {loading ? <SkeletonLine className="h-7 w-48" /> : view.name}
                {!loading && <StatusBadge status={view.status} />}
              </h1>
              <p className="mt-2 text-xs text-neutral-500">
                Category · <span className="text-neutral-700">{view.category}</span>
              </p>
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-md border border-neutral-200 bg-white px-5 py-4">
              <p className="text-xs text-neutral-500">{c.label}</p>
              {loading ? (
                <>
                  <SkeletonLine className="mt-2 h-7 w-20" />
                  <SkeletonLine className="mt-2 h-3 w-24" />
                </>
              ) : fetchFailed ? (
                <ErrorMessage onRetry={onRetry}>
                  Couldn't load use case data. Check your connection and try again.
                </ErrorMessage>
              ) : empty ? (
                <>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-400">—</p>
                  <p className="mt-2 text-xs text-neutral-400">No data yet</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{c.value}</p>
                  <p className="mt-2 text-xs text-neutral-500">{c.sub}</p>
                </>
              )}
            </div>
          ))}
        </section>

        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              Monthly requests — last 6 months
            </h2>
            <div className="flex items-center gap-5 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-6 bg-sky-500" /> Actual requests
              </span>
            </div>
          </div>
          <div className="h-[320px]">
            {loading ? (
              <ChartSkeleton height={320} />
            ) : fetchFailed ? (
              <ErrorMessage onRetry={onRetry}>
                Couldn't load use case data. Check your connection and try again.
              </ErrorMessage>
            ) : empty ? (
              <EmptyMessage>
                No request data for this use case in the selected period. Data appears once the use
                case logs its first interaction.
              </EmptyMessage>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="ucFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#737373" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#ucFill)"
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
            Top user departments
          </h2>
          <div className="space-y-2">
            {view.departments.map((d, i) => (
              <div
                key={`${d.name}-${i}`}
                className="grid grid-cols-[120px_1fr_48px] items-center gap-3 text-xs"
              >
                <span className="text-neutral-700">{d.name}</span>
                {loading ? (
                  <SkeletonLine className="h-2 w-full" />
                ) : fetchFailed || empty ? (
                  <span className="text-neutral-400">No activity this period</span>
                ) : (
                  <div className="h-2 w-full rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${(d.share / maxDept) * 100}%` }}
                    />
                  </div>
                )}
                {loading ? (
                  <SkeletonLine className="ml-auto h-3 w-8" />
                ) : fetchFailed || empty ? (
                  <span className="text-right text-neutral-400">—</span>
                ) : (
                  <span className="text-right font-medium text-neutral-900">{d.share}%</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
