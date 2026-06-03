import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TrendingUp,
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
      { title: "GraphTruth — Product Health, Pipeline & Forecast" },
      {
        name: "description",
        content:
          "Graph RAG dashboard for customer-support chatbots: hallucination reduction, SRs solved & avoided, positive feedback, roadmap and next-quarter forecast.",
      },
      { property: "og:title", content: "GraphTruth — Product Pulse" },
      {
        property: "og:description",
        content: "Graph RAG for hallucination-free chatbots — PM dashboard with pipeline, activity, roadmap and forecast.",
      },
    ],
  }),
  component: Dashboard,
});

// ——— Mock data: previous quarter (W1–W8) → next-quarter forecast (W9–W12) ———
const trafficData = [
  { week: "W1", solved: 980, avoided: 540, halluc: 5.8, forecastSolved: null as number | null, forecastAvoided: null as number | null },
  { week: "W2", solved: 1120, avoided: 640, halluc: 5.2, forecastSolved: null, forecastAvoided: null },
  { week: "W3", solved: 1280, avoided: 760, halluc: 4.5, forecastSolved: null, forecastAvoided: null },
  { week: "W4", solved: 1410, avoided: 870, halluc: 3.9, forecastSolved: null, forecastAvoided: null },
  { week: "W5", solved: 1560, avoided: 980, halluc: 3.3, forecastSolved: null, forecastAvoided: null },
  { week: "W6", solved: 1690, avoided: 1090, halluc: 2.8, forecastSolved: null, forecastAvoided: null },
  { week: "W7", solved: 1820, avoided: 1180, halluc: 2.4, forecastSolved: null, forecastAvoided: null },
  { week: "W8", solved: 1980, avoided: 1290, halluc: 2.1, forecastSolved: 1980, forecastAvoided: 1290 },
  { week: "W9", solved: null as number | null, avoided: null as number | null, halluc: 1.8, forecastSolved: 2140, forecastAvoided: 1430 },
  { week: "W10", solved: null, avoided: null, halluc: 1.6, forecastSolved: 2310, forecastAvoided: 1580 },
  { week: "W11", solved: null, avoided: null, halluc: 1.4, forecastSolved: 2490, forecastAvoided: 1740 },
  { week: "W12", solved: null, avoided: null, halluc: 1.2, forecastSolved: 2680, forecastAvoided: 1910 },
];

const pipelineData = [
  { stage: "Prospects", value: 2840, color: "var(--chart-1)" },
  { stage: "Pilots", value: 612, color: "var(--chart-2)" },
  { stage: "Integrated", value: 284, color: "var(--chart-3)" },
  { stage: "Production", value: 138, color: "var(--chart-4)" },
  { stage: "Expanded", value: 47, color: "var(--chart-5)" },
];

const hallucReduction = [
  { bot: "Billing", baseline: 14.2, withGraph: 2.1 },
  { bot: "Tier-1 support", baseline: 12.8, withGraph: 1.8 },
  { bot: "Troubleshoot", baseline: 16.5, withGraph: 2.9 },
  { bot: "Account mgmt", baseline: 11.4, withGraph: 1.6 },
  { bot: "Onboarding", baseline: 9.8, withGraph: 1.4 },
];

const graphCoverage = [
  { week: "W1", coverage: 38, accuracy: 74 },
  { week: "W2", coverage: 44, accuracy: 78 },
  { week: "W3", coverage: 51, accuracy: 81 },
  { week: "W4", coverage: 58, accuracy: 84 },
  { week: "W5", coverage: 65, accuracy: 87 },
  { week: "W6", coverage: 71, accuracy: 90 },
  { week: "W7", coverage: 78, accuracy: 92 },
  { week: "W8", coverage: 84, accuracy: 94 },
];

const useCases = [
  { name: "Billing & payments support", users: 4820, growth: 28 },
  { name: "Tier-1 customer service", users: 4310, growth: 34 },
  { name: "Technical troubleshooting", users: 3680, growth: 41 },
  { name: "Account & subscription mgmt", users: 2940, growth: 22 },
  { name: "Onboarding & how-to assistant", users: 2210, growth: 47 },
  { name: "Internal agent copilot", users: 1580, growth: 62 },
];

const activityByDay = [
  { day: "Mon", queries: 14200, grounded: 13820 },
  { day: "Tue", queries: 15800, grounded: 15410 },
  { day: "Wed", queries: 16400, grounded: 16020 },
  { day: "Thu", queries: 15900, grounded: 15530 },
  { day: "Fri", queries: 14100, grounded: 13760 },
  { day: "Sat", queries: 6200, grounded: 6080 },
  { day: "Sun", queries: 5100, grounded: 5010 },
];

const roadmap = [
  { quarter: "Q1 — Shipped", title: "Core Graph RAG engine", status: "done", progress: 100 },
  { quarter: "Q1 — Shipped", title: "Zendesk connector", status: "done", progress: 100 },
  { quarter: "Q2 — Current", title: "Real-time graph sync", status: "in-progress", progress: 72 },
  { quarter: "Q2 — Current", title: "Enterprise SSO & audit logs", status: "in-progress", progress: 55 },
  { quarter: "Q3 — Next", title: "Horizontal scalability / multi-tenant sharding", status: "planned", progress: 18 },
  { quarter: "Q3 — Next", title: "Salesforce + Intercom connectors", status: "planned", progress: 8 },
  { quarter: "Q4 — Future", title: "Self-serve graph builder", status: "planned", progress: 0 },
  { quarter: "Q4 — Future", title: "On-prem deployment", status: "planned", progress: 0 },
];

const channelMix = [
  { name: "Inbound", value: 38 },
  { name: "Partner CRMs", value: 29 },
  { name: "Outbound", value: 19 },
  { name: "Community", value: 14 },
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
  lowerIsBetter = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: number;
  hint: string;
  lowerIsBetter?: boolean;
}) {
  // For "lower is better" metrics (e.g. hallucination rate), a negative delta is good.
  const isGood = lowerIsBetter ? delta < 0 : delta >= 0;
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
              isGood
                ? "bg-success/15 text-success hover:bg-success/15"
                : "bg-destructive/15 text-destructive hover:bg-destructive/15"
            }
          >
            {delta >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
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
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top user bar */}
        <div className="rounded-t-lg border border-b-0 bg-card">
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/80?img=12"
                alt="User avatar"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div className="leading-tight">
                <div className="text-sm font-medium">Alex Morgan</div>
                <div className="text-xs text-muted-foreground">Product Manager · Measure it if you can</div>
              </div>
            </div>
            <nav className="hidden items-center gap-7 text-sm md:flex">
              <a className="font-medium text-foreground" href="#dashboard">Dashboard</a>
              <a className="text-muted-foreground hover:text-foreground" href="#usecases">Use cases</a>
              <a className="text-muted-foreground hover:text-foreground" href="#roadmap">Roadmap</a>
              <a className="text-muted-foreground hover:text-foreground" href="#forecast">Forecast</a>
            </nav>
            <Badge variant="secondary" className="hidden bg-accent text-accent-foreground sm:inline-flex">
              Q2 2026
            </Badge>
          </div>
        </div>

        {/* Inner header */}
        <header className="border-x border-b bg-card/80 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-semibold tracking-tight">Measure it if you can</h1>
                <p className="text-xs text-muted-foreground">Graph RAG for hallucination-free chatbots · Product Pulse · Updated 2 min ago</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Previous quarter → Next-quarter forecast
            </Badge>
          </div>
        </header>

        <main id="dashboard" className="space-y-6 border-x bg-card px-6 py-8">

        {/* KPIs */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={ThumbsUp} label="Positive feedback" value="4,820" delta={28} hint="Thumbs-up on agent answers, this quarter" />
          <Kpi icon={Boxes} label="SRs solved by agent" value="12,340" delta={41} hint="Tickets resolved with our suggestions" />
          <Kpi icon={ShieldCheck} label="SRs avoided" value="8,150" delta={52} hint="Accurate first response — no ticket opened" />
          <Kpi icon={TrendingUp} label="Hallucination rate" value="2.1%" delta={-63} hint="Lower is better · vs. previous quarter" lowerIsBetter />
        </section>

        {/* Main chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle>SRs solved & avoided — with Q3 forecast</CardTitle>
                <CardDescription>
                  Solid = previous quarter actuals · Dashed = forecast · Right axis: hallucination rate (%)
                </CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">+35% projected</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAvoided" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="solved" name="SRs solved" stroke="var(--chart-1)" strokeWidth={2} fill="url(#gSolved)" />
                <Area yAxisId="left" type="monotone" dataKey="avoided" name="SRs avoided" stroke="var(--chart-3)" strokeWidth={2} fill="url(#gAvoided)" />
                <Line yAxisId="left" type="monotone" dataKey="forecastSolved" name="Forecast — solved" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="forecastAvoided" name="Forecast — avoided" stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="halluc" name="Hallucination %" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hallucination reduction vs baseline + Graph coverage trend */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>Hallucination reduction by bot type</CardTitle>
                  <CardDescription>Baseline LLM vs. with GraphTruth (lower is better)</CardDescription>
                </div>
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hallucReduction} margin={{ left: 0, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="bot" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="baseline" name="Baseline" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="withGraph" name="With GraphTruth" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>Graph coverage vs. answer accuracy</CardTitle>
                  <CardDescription>Knowledge graph node coverage drives grounded accuracy</CardDescription>
                </div>
                <Network className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphCoverage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="coverage" name="Graph coverage" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="accuracy" name="Answer accuracy" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Pipeline + Channel mix */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Customer pipeline</CardTitle>
              <CardDescription>
                {fmt(totalPipeline)} prospects → {fmt(pipelineData[4].value)} expanded ({conversion}% conversion)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                  <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={90} />
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
              <CardTitle>Acquisition channels</CardTitle>
              <CardDescription>How customers discover GraphTruth</CardDescription>
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
        <Tabs defaultValue="usecases" id="roadmap">
          <TabsList>
            <TabsTrigger value="usecases" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Use cases</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Activity</TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="usecases" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer-support bots by adoption</CardTitle>
                <CardDescription>Active end-users per bot type, positive-feedback growth vs. previous quarter</CardDescription>
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
                <CardTitle>Graph queries & grounded answers</CardTitle>
                <CardDescription>Daily graph queries vs. answers grounded in the knowledge graph</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="queries" name="Graph queries" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="grounded" name="Grounded answers" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product roadmap</CardTitle>
                <CardDescription>Q1 shipped · Q2 in progress · Q3 real-time sync, scalability · Q4 enterprise</CardDescription>
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

        {/* Footer */}
        <footer className="rounded-b-lg border border-t-0 bg-card">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-serif font-semibold">Measure it if you can</span>
              <span className="text-muted-foreground">— Graph RAG for grounded answers</span>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Product</a>
              <a href="#" className="hover:text-foreground">Pricing</a>
              <a href="#" className="hover:text-foreground">Docs</a>
              <a href="#" className="hover:text-foreground">Contact</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
            </nav>
          </div>
          <div className="rounded-b-lg bg-neutral-800 px-6 py-3 text-center text-xs text-neutral-300">
            <Activity className="mr-1 inline h-3 w-3" />
            © {new Date().getFullYear()} Measure it if you can. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

