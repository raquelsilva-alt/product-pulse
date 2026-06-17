// Dashboard screen — pure presentation. Data fetched via TanStack Query from Supabase.

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChartSkeleton,
  CachedBadge,
  ChartSkeleton,
  ErrorMessage,
  SkeletonLine,
  StateToggle,
  type DataState,
} from "@/components/states";
import { dashboardQueryOptions, slugify } from "@/lib/queries";
import {
  GrowthBadge,
  MiniSparkline,
  ROAD_EDGE,
  RoadStatusBadge,
  StatusBadge,
} from "./badges";

export type DashboardScreenProps = {
  state: DataState;
  onRetry: () => void;
  userEmail?: string;
  onSignOut?: () => void;
};

export function DashboardScreen({ state, onRetry, userEmail, onSignOut }: DashboardScreenProps) {
  const { data } = useSuspenseQuery(dashboardQueryOptions());
  const { kpis, traffic, pipeline, useCases, roadmap, forecast, fieldSignals } = data;
  const maxUseCase = Math.max(1, ...useCases.map((u) => u.count));

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 tabular-nums">
      <div className="mx-auto max-w-[1280px] px-8 py-8">
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
              <StateToggle basePath="/" current={state} />
              <span>Q2 2026 · Jun 4</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Healthy · 82/100
              </span>
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-md border border-neutral-200 bg-white px-5 py-4"
            >
              <p className="text-xs text-neutral-500">{k.label}</p>
              {state === "loading" ? (
                <SkeletonLine className="mt-2 h-7 w-20" />
              ) : state === "error" ? (
                <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-400">—</p>
              ) : (
                <p className="mt-2 text-3xl font-semibold tracking-tight">{k.value}</p>
              )}
              {state === "loading" ? (
                <SkeletonLine className="mt-2 h-3 w-24" />
              ) : state === "error" ? (
                <CachedBadge onRetry={onRetry} />
              ) : (
                <p className="mt-2 text-xs text-emerald-600">↑ {k.delta}</p>
              )}
            </div>
          ))}
        </section>

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
            {state === "loading" ? (
              <ChartSkeleton height={320} />
            ) : state === "error" ? (
              <ErrorMessage onRetry={onRetry}>
                Data connection interrupted. Last successful sync: Jun 3, 2026.
              </ErrorMessage>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
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
                    contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb" }}
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
            )}
          </div>
        </section>

        <section className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-md border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              User pipeline
            </h2>
            <div className="h-[230px]">
              {state === "loading" ? (
                <BarChartSkeleton height={230} rows={5} />
              ) : state === "error" ? (
                <ErrorMessage onRetry={onRetry}>
                  Data connection interrupted. Last successful sync: Jun 3, 2026.
                </ErrorMessage>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipeline} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
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
              )}
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

          <div className="col-span-2 rounded-md border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              Use case activity — {useCases.length} total · monthly requests
            </h2>
            <div className="space-y-2">
              {useCases.map((u) => {
                const isLoading = state === "loading";
                const isEmpty = state === "empty" || u.count === 0;
                const pct = (u.count / maxUseCase) * 100;
                const isBreakout = u.name === "Code review assist" && !isLoading && !isEmpty;
                return (
                  <Link
                    key={u.id}
                    to="/use-case/$slug"
                    params={{ slug: slugify(u.name) }}
                    className={`grid grid-cols-[180px_60px_1fr_60px_86px] items-center gap-3 rounded px-1 py-1 text-xs transition-colors hover:bg-neutral-100 ${
                      isBreakout ? "bg-amber-50/60 hover:bg-amber-100/60" : ""
                    }`}
                  >
                    <span className="truncate text-neutral-800">{u.name}</span>
                    <StatusBadge status={u.status} />
                    {isLoading ? (
                      <>
                        <SkeletonLine className="h-1.5 w-full" />
                        <SkeletonLine className="ml-auto h-3 w-12" />
                        <SkeletonLine className="ml-auto h-4 w-20" />
                      </>
                    ) : isEmpty ? (
                      <span className="col-span-3 text-right text-neutral-400">
                        No activity this period
                      </span>
                    ) : (
                      <>
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
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
            Product roadmap — Q2–Q4 2026
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {roadmap.map((col) => (
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

        <section className="mb-6 rounded-md border border-amber-200 bg-amber-50/40 p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">
            Q3 2026 forecast — based on Q2 trends
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {forecast.map((f) => (
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

        <section className="mb-6 rounded-md border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
            Field signals
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {fieldSignals.map((s) => (
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
