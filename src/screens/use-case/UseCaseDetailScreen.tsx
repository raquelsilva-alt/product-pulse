// Use Case Detail screen — fetches via TanStack Query, finds use case by slug.

import { Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyTrend, slugify, useCasesQueryOptions } from "@/lib/queries";
import {
  ChartSkeleton,
  EmptyMessage,
  ErrorMessage,
  SkeletonLine,
  StateToggle,
  type DataState,
} from "@/components/states";
import { StatusBadge } from "./badges";

export type UseCaseDetailScreenProps = {
  slug: string;
  state: DataState;
  onRetry: () => void;
};

export function UseCaseDetailScreen({ slug, state, onRetry }: UseCaseDetailScreenProps) {
  const { data: useCases } = useSuspenseQuery(useCasesQueryOptions());
  const uc = useCases.find((u) => slugify(u.name) === slug);
  if (!uc) throw notFound();

  const fetchFailed = state === "error";
  const loading = state === "loading";
  const empty = state === "empty";

  const data = monthlyTrend(uc);
  const first = data[0].actual;
  const last = data[data.length - 1].actual;
  const mom = data[data.length - 2].actual
    ? Math.round(((last - data[data.length - 2].actual) / data[data.length - 2].actual) * 100)
    : 0;

  const cards = [
    { label: "Monthly requests", value: uc.count.toLocaleString(), sub: `vs ${first.toLocaleString()} 6 mo ago` },
    { label: "MoM growth", value: uc.isNew ? "New" : `${mom >= 0 ? "+" : ""}${mom}%`, sub: "month over month" },
    { label: "Active users", value: uc.activeUsers.toString(), sub: "on this use case" },
    { label: "Resolution rate", value: `${uc.resolutionRate}%`, sub: "auto-resolved" },
  ];

  const maxDept = Math.max(1, ...uc.departments.map((d) => d.share));

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
          <StateToggle basePath="/use-case/$slug" current={state} />
        </div>

        <header className="mb-6 border-b border-neutral-200 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                Use case detail
              </p>
              <h1 className="mt-1 flex items-center gap-3 text-2xl font-semibold tracking-tight text-neutral-900">
                {uc.name}
                <StatusBadge status={uc.status} />
              </h1>
              <p className="mt-2 text-xs text-neutral-500">
                Category · <span className="text-neutral-700">{uc.category}</span>
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
                  Unable to load use case data. Check your connection and try again.
                </ErrorMessage>
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
                Unable to load use case data. Check your connection and try again.
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
            {uc.departments.map((d) => (
              <div
                key={d.name}
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
