// Dashboard screen data. All values mocked — replace with real fetches when wired up.

export type RoadStatus = "Done" | "In Progress" | "Planned" | "Backlog";

export type RoadmapColumn = {
  quarter: string;
  badge: string;
  dot: string;
  items: { title: string; status: RoadStatus; tag: string }[];
};

export const KPIS: { label: string; value: string; delta: string }[] = [
  { label: "Active use cases", value: "12", delta: "+2 vs Q1" },
  { label: "Monthly requests", value: "4,700", delta: "+4.7% vs Q1 avg" },
  { label: "Active users", value: "280", delta: "+6.9% vs Q1" },
  { label: "Resolution rate", value: "89%", delta: "+3 pp vs Q1" },
];

export const TRAFFIC: { m: string; actual?: number; forecast?: number }[] = [
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

export const PIPELINE: { stage: string; value: number }[] = [
  { stage: "Registered", value: 420 },
  { stage: "Onboarded", value: 341 },
  { stage: "Active (30d)", value: 280 },
  { stage: "Power users", value: 95 },
  { stage: "Champions", value: 32 },
];

export const ROADMAP: RoadmapColumn[] = [
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

export const FORECAST: { label: string; value: string; sub: string }[] = [
  { label: "Peak monthly requests", value: "5,650", sub: "September 2026" },
  { label: "Projected active users", value: "338", sub: "+20.7% from Jun" },
  { label: "New use case launches", value: "2", sub: "Routing + onboarding" },
  { label: "Est. resolution rate", value: "92%", sub: "↑ +3 pp from Q2" },
];

export const FIELD_SIGNALS: { q: string; a: string }[] = [
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
];
