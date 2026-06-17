// TanStack Query options for dashboard data, sourced from Supabase.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export type Status = "Live" | "Beta" | "Pilot";
export type RoadStatus = "Done" | "In Progress" | "Planned" | "Backlog";

export type UseCase = {
  id: string;
  name: string;
  status: Status;
  count: number;
  growth: string;
  isNew: boolean;
  trend: [number, number, number];
  category: string;
  activeUsers: number;
  resolutionRate: number;
  departments: { name: string; share: number }[];
};

export type Kpi = { label: string; value: string; delta: string };
export type TrafficPoint = { m: string; actual?: number; forecast?: number };
export type PipelineStage = { stage: string; value: number };
export type RoadmapItem = { title: string; status: RoadStatus; tag: string };
export type RoadmapColumn = {
  quarter: string;
  badge: string;
  dot: string;
  items: RoadmapItem[];
};
export type ForecastItem = { label: string; value: string; sub: string };
export type FieldSignal = { q: string; a: string };

export type DashboardData = {
  kpis: Kpi[];
  traffic: TrafficPoint[];
  pipeline: PipelineStage[];
  useCases: UseCase[];
  roadmap: RoadmapColumn[];
  forecast: ForecastItem[];
  fieldSignals: FieldSignal[];
};

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function mapUseCase(row: {
  id: string;
  name: string;
  status: string;
  count: number;
  growth: string;
  is_new: boolean;
  trend: number[] | null;
  category: string;
  active_users: number;
  resolution_rate: number;
  departments: unknown;
}): UseCase {
  const t = row.trend ?? [0, 0, 0];
  return {
    id: row.id,
    name: row.name,
    status: row.status as Status,
    count: row.count,
    growth: row.growth,
    isNew: row.is_new,
    trend: [t[0] ?? 0, t[1] ?? 0, t[2] ?? 0],
    category: row.category,
    activeUsers: row.active_users,
    resolutionRate: row.resolution_rate,
    departments: (row.departments as { name: string; share: number }[]) ?? [],
  };
}

const ROADMAP_META: Record<string, { badge: string; dot: string }> = {
  "Q2 · 2026": { badge: "CURRENT", dot: "bg-sky-500" },
  "Q3 · 2026": { badge: "", dot: "bg-amber-600" },
  "Q4 · 2026": { badge: "", dot: "bg-neutral-400" },
};

async function fetchDashboard(): Promise<DashboardData> {
  const [kpis, traffic, pipeline, useCases, roadmap, forecast, signals] =
    await Promise.all([
      supabase.from("kpis").select("label,value,delta,sort_order").eq("user_id", DEMO_USER_ID).order("sort_order"),
      supabase.from("traffic_monthly").select("month,actual,forecast,sort_order").eq("user_id", DEMO_USER_ID).order("sort_order"),
      supabase.from("pipeline_stages").select("stage,value,sort_order").eq("user_id", DEMO_USER_ID).order("sort_order"),
      supabase.from("use_cases").select("*").eq("user_id", DEMO_USER_ID).order("sort_order"),
      supabase.from("roadmap_items").select("quarter,title,status,tag,sort_order").eq("user_id", DEMO_USER_ID).order("sort_order"),
      supabase.from("forecast_summary").select("label,value,sub,sort_order").eq("user_id", DEMO_USER_ID).order("sort_order"),
      supabase.from("field_signals").select("quote,attribution,sort_order").eq("user_id", DEMO_USER_ID).order("sort_order"),
    ]);

  for (const r of [kpis, traffic, pipeline, useCases, roadmap, forecast, signals]) {
    if (r.error) throw new Error(r.error.message);
  }

  // Group roadmap items by quarter
  const byQ = new Map<string, RoadmapItem[]>();
  for (const r of roadmap.data ?? []) {
    const arr = byQ.get(r.quarter) ?? [];
    arr.push({ title: r.title, status: r.status as RoadStatus, tag: r.tag });
    byQ.set(r.quarter, arr);
  }
  const roadmapCols: RoadmapColumn[] = Array.from(byQ.entries()).map(([quarter, items]) => ({
    quarter,
    badge: ROADMAP_META[quarter]?.badge ?? "",
    dot: ROADMAP_META[quarter]?.dot ?? "bg-neutral-400",
    items,
  }));

  return {
    kpis: (kpis.data ?? []).map((k) => ({ label: k.label, value: k.value, delta: k.delta })),
    traffic: (traffic.data ?? []).map((t) => ({
      m: t.month,
      actual: t.actual ?? undefined,
      forecast: t.forecast ?? undefined,
    })),
    pipeline: (pipeline.data ?? []).map((p) => ({ stage: p.stage, value: p.value })),
    useCases: (useCases.data ?? []).map(mapUseCase),
    roadmap: roadmapCols,
    forecast: (forecast.data ?? []).map((f) => ({ label: f.label, value: f.value, sub: f.sub ?? "" })),
    fieldSignals: (signals.data ?? []).map((s) => ({ q: s.quote, a: s.attribution })),
  };
}

export const dashboardQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard", DEMO_USER_ID],
    queryFn: fetchDashboard,
  });

async function fetchUseCases(): Promise<UseCase[]> {
  const r = await supabase
    .from("use_cases")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .order("sort_order");
  if (r.error) throw new Error(r.error.message);
  return (r.data ?? []).map(mapUseCase);
}

export const useCasesQueryOptions = () =>
  queryOptions({
    queryKey: ["use_cases", DEMO_USER_ID],
    queryFn: fetchUseCases,
  });

// 6-month trend extrapolated from the stored 3-point trend.
export function monthlyTrend(uc: UseCase): { m: string; actual: number }[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const [a, b, c] = uc.trend;
  const step = b - a || Math.max(1, Math.round(a * 0.05));
  const m0 = Math.max(0, a - step * 3);
  const m1 = Math.max(0, a - step * 2);
  const m2 = Math.max(0, a - step);
  const vals = [m0, m1, m2, a, b, c];
  return months.map((m, i) => ({ m, actual: vals[i] }));
}
