import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Product Health Dashboard — Pipeline, Activity & Forecast" },
      {
        name: "description",
        content:
          "Track product health, user pipeline, activity, use cases, traffic, roadmap and next-quarter forecast in one dashboard.",
      },
      { property: "og:title", content: "Product Health Dashboard" },
      {
        property: "og:description",
        content: "Pipeline, activity, roadmap and forecast for product managers.",
      },
    ],
  }),
  component: Dashboard,
});

// ——— Mock data (previous quarter → next quarter forecast) ———
const trafficData = [
  { week: "W1", traffic: 18400, activeUsers: 9200, forecast: null as number | null },
  { week: "W2", traffic: 21200, activeUsers: 10800, forecast: null },
  { week: "W3", traffic: 23900, activeUsers: 12100, forecast: null },
  { week: "W4", traffic: 26800, activeUsers: 13400, forecast: null },
  { week: "W5", traffic: 28100, activeUsers: 14200, forecast: null },
  { week: "W6", traffic: 31500, activeUsers: 15900, forecast: null },
  { week: "W7", traffic: 33200, activeUsers: 16800, forecast: null },
  { week: "W8", traffic: 36400, activeUsers: 18200, forecast: 36400 },
  { week: "W9", traffic: null as number | null, activeUsers: null, forecast: 39100 },
  { week: "W10", traffic: null, activeUsers: null, forecast: 42300 },
  { week: "W11", traffic: null, activeUsers: null, forecast: 45800 },
  { week: "W12", traffic: null, activeUsers: null, forecast: 49600 },
];

const pipelineData = [
  { stage: "Visitors", value: 124800, color: "var(--chart-1)" },
  { stage: "Signups", value: 38200, color: "var(--chart-2)" },
  { stage: "Activated", value: 21400, color: "var(--chart-3)" },
  { stage: "Engaged", value: 12900, color: "var(--chart-4)" },
  { stage: "Paying", value: 4280, color: "var(--chart-5)" },
];

const useCases = [
  { name: "Automated reports", users: 8420, growth: 18 },
  { name: "Team collaboration", users: 6210, growth: 24 },
  { name: "API integrations", users: 4980, growth: 32 },
  { name: "Custom dashboards", users: 3850, growth: 12 },
  { name: "Workflow automation", users: 3120, growth: 41 },
  { name: "Data exports", users: 2640, growth: -6 },
];

const activityByDay = [
  { day: "Mon", sessions: 4200, actions: 18400 },
  { day: "Tue", sessions: 4800, actions: 21200 },
  { day: "Wed", sessions: 5100, actions: 22800 },
  { day: "Thu", sessions: 4950, actions: 21900 },
  { day: "Fri", sessions: 4400, actions: 19200 },
  { day: "Sat", sessions: 2100, actions: 8400 },
  { day: "Sun", sessions: 1800, actions: 7100 },
];

const roadmap = [
  { quarter: "Q1 — Shipped", title: "Workspaces & SSO", status: "done", progress: 100 },
  { quarter: "Q2 — Current", title: "AI insights & smart alerts", status: "in-progress", progress: 72 },
  { quarter: "Q2 — Current", title: "Mobile app v2", status: "in-progress", progress: 45 },
  { quarter: "Q3 — Next", title: "Public API & webhooks", status: "planned", progress: 15 },
  { quarter: "Q3 — Next", title: "Advanced permissions", status: "planned", progress: 5 },
  { quarter: "Q4 — Future", title: "Marketplace & integrations", status: "planned", progress: 0 },
];

const channelMix = [
  { name: "Organic", value: 42 },
  { name: "Referral", value: 23 },
  { name: "Paid", value: 18 },
  { name: "Direct", value: 17 },
];

// ——— Helpers ———
const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`;

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: number;
  hint: string;
}) {
  const positive = delta >= 0;
  return (
    <Card className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: "var(--gradient-primary)" }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-medium uppercase tracking-wider">
            {label}
          </CardDescription>
          <div className="rounded-md bg-accent p-2 text-accent-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2">
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          <Badge
            variant="secondary"
            className={
              positive
                ? "bg-success/15 text-success hover:bg-success/15"
                : "bg-destructive/15 text-destructive hover:bg-destructive/15"
            }
          >
            {positive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
            {Math.abs(delta)}%
          </Badge>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    color: "var(--popover-foreground)",
    fontSize: 12,
  },
  labelStyle: { color: "var(--muted-foreground)" },
};

function Dashboard() {
  const totalPipeline = pipelineData[0].value;
  const conversion = ((pipelineData[4].value / totalPipeline) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Product Pulse</h1>
              <p className="text-xs text-muted-foreground">Q2 2026 · Updated 2 min ago</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Previous quarter → Next-quarter forecast
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* KPIs */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={Users} label="Monthly active users" value="18.2k" delta={14} hint="vs. previous quarter" />
          <Kpi icon={Activity} label="Weekly traffic" value="36.4k" delta={22} hint="Sessions, last 7 days" />
          <Kpi icon={Boxes} label="Active use cases" value="24" delta={9} hint="6 launched this quarter" />
          <Kpi icon={TrendingUp} label="Q3 forecast MAU" value="26.1k" delta={43} hint="Model: linear + seasonality" />
        </section>

        {/* Main chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle>Traffic & active users — with Q3 forecast</CardTitle>
                <CardDescription>
                  Solid = previous quarter actuals · Dashed = forecast for next quarter
                </CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">+43% projected</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="traffic" name="Traffic" stroke="var(--chart-1)" strokeWidth={2} fill="url(#gTraffic)" />
                <Area type="monotone" dataKey="activeUsers" name="Active users" stroke="var(--chart-3)" strokeWidth={2} fill="url(#gUsers)" />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="var(--chart-5)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline + Channel mix */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User pipeline</CardTitle>
              <CardDescription>
                {fmt(totalPipeline)} visitors → {fmt(pipelineData[4].value)} paying ({conversion}% conversion)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                  <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {pipelineData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic channels</CardTitle>
              <CardDescription>Share of acquisition this quarter</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelMix} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {channelMix.map((_, i) => (
                      <Cell key={i} fill={`var(--chart-${i + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Tabs: use cases / activity / roadmap */}
        <Tabs defaultValue="usecases">
          <TabsList>
            <TabsTrigger value="usecases">Use cases</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="usecases" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top use cases by adoption</CardTitle>
                <CardDescription>Active users per use case, growth vs. previous quarter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {useCases.map((u) => (
                  <div key={u.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-medium">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        {u.name}
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span>{fmt(u.users)} users</span>
                        <Badge
                          variant="secondary"
                          className={
                            u.growth >= 0
                              ? "bg-success/15 text-success hover:bg-success/15"
                              : "bg-destructive/15 text-destructive hover:bg-destructive/15"
                          }
                        >
                          {u.growth >= 0 ? "+" : ""}
                          {u.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(u.users / useCases[0].users) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User activity by day</CardTitle>
                <CardDescription>Sessions and in-app actions, average week</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="sessions" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="actions" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product roadmap</CardTitle>
                <CardDescription>Q1 shipped · Q2 in progress · Q3+ planned</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roadmap.map((r) => (
                  <div key={r.title} className="rounded-lg border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {r.quarter}
                        </div>
                        <div className="mt-0.5 font-medium">{r.title}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          r.status === "done"
                            ? "bg-success/15 text-success hover:bg-success/15"
                            : r.status === "in-progress"
                              ? "bg-primary/10 text-primary hover:bg-primary/10"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <Progress value={r.progress} className="mt-3 h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
