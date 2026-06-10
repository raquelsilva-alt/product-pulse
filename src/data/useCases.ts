export type Status = "Live" | "Beta" | "Pilot";

export type UseCase = {
  name: string;
  status: Status;
  count: number;
  growth: string;
  isNew?: boolean;
  trend: [number, number, number];
  category: string;
  activeUsers: number;
  resolutionRate: number;
  departments: { name: string; share: number }[];
};

export const USE_CASES: UseCase[] = [
  {
    name: "IT service request",
    status: "Live",
    count: 1420,
    growth: "+12%",
    trend: [1260, 1340, 1420],
    category: "IT Operations",
    activeUsers: 142,
    resolutionRate: 91,
    departments: [
      { name: "IT Ops", share: 58 },
      { name: "Finance", share: 14 },
      { name: "HR", share: 11 },
      { name: "Legal", share: 7 },
      { name: "Other", share: 10 },
    ],
  },
  {
    name: "Knowledge base Q&A",
    status: "Live",
    count: 890,
    growth: "+8%",
    trend: [820, 855, 890],
    category: "Productivity",
    activeUsers: 98,
    resolutionRate: 87,
    departments: [
      { name: "IT Ops", share: 32 },
      { name: "HR", share: 24 },
      { name: "Finance", share: 18 },
      { name: "Legal", share: 12 },
      { name: "Other", share: 14 },
    ],
  },
  {
    name: "Incident triage",
    status: "Live",
    count: 670,
    growth: "+22%",
    trend: [545, 605, 670],
    category: "IT Operations",
    activeUsers: 64,
    resolutionRate: 84,
    departments: [
      { name: "IT Ops", share: 71 },
      { name: "Finance", share: 9 },
      { name: "HR", share: 6 },
      { name: "Legal", share: 4 },
      { name: "Other", share: 10 },
    ],
  },
  {
    name: "HR policy assistant",
    status: "Live",
    count: 540,
    growth: "+5%",
    trend: [515, 528, 540],
    category: "HR",
    activeUsers: 71,
    resolutionRate: 92,
    departments: [
      { name: "HR", share: 64 },
      { name: "IT Ops", share: 12 },
      { name: "Finance", share: 10 },
      { name: "Legal", share: 6 },
      { name: "Other", share: 8 },
    ],
  },
  {
    name: "Contract review",
    status: "Live",
    count: 380,
    growth: "+18%",
    trend: [320, 350, 380],
    category: "Legal",
    activeUsers: 42,
    resolutionRate: 88,
    departments: [
      { name: "Legal", share: 61 },
      { name: "Finance", share: 18 },
      { name: "IT Ops", share: 8 },
      { name: "HR", share: 5 },
      { name: "Other", share: 8 },
    ],
  },
  {
    name: "Meeting summary",
    status: "Live",
    count: 290,
    growth: "+31%",
    trend: [220, 255, 290],
    category: "Productivity",
    activeUsers: 86,
    resolutionRate: 90,
    departments: [
      { name: "IT Ops", share: 28 },
      { name: "HR", share: 22 },
      { name: "Finance", share: 20 },
      { name: "Legal", share: 14 },
      { name: "Other", share: 16 },
    ],
  },
  {
    name: "Code review assist",
    status: "Live",
    count: 180,
    growth: "+44%",
    trend: [125, 152, 180],
    category: "Engineering",
    activeUsers: 38,
    resolutionRate: 86,
    departments: [
      { name: "IT Ops", share: 78 },
      { name: "Other", share: 12 },
      { name: "Finance", share: 4 },
      { name: "Legal", share: 3 },
      { name: "HR", share: 3 },
    ],
  },
  {
    name: "Security alerts",
    status: "Live",
    count: 145,
    growth: "+9%",
    trend: [132, 138, 145],
    category: "Security",
    activeUsers: 24,
    resolutionRate: 94,
    departments: [
      { name: "IT Ops", share: 82 },
      { name: "Legal", share: 6 },
      { name: "Finance", share: 5 },
      { name: "HR", share: 3 },
      { name: "Other", share: 4 },
    ],
  },
  {
    name: "Vendor management",
    status: "Beta",
    count: 89,
    growth: "+61%",
    trend: [55, 71, 89],
    category: "Procurement",
    activeUsers: 21,
    resolutionRate: 79,
    departments: [
      { name: "Finance", share: 44 },
      { name: "Legal", share: 22 },
      { name: "IT Ops", share: 18 },
      { name: "HR", share: 6 },
      { name: "Other", share: 10 },
    ],
  },
  {
    name: "Procurement assist",
    status: "Beta",
    count: 67,
    growth: "+88%",
    trend: [36, 51, 67],
    category: "Procurement",
    activeUsers: 18,
    resolutionRate: 76,
    departments: [
      { name: "Finance", share: 48 },
      { name: "IT Ops", share: 20 },
      { name: "Legal", share: 14 },
      { name: "HR", share: 6 },
      { name: "Other", share: 12 },
    ],
  },
  {
    name: "Change management",
    status: "Pilot",
    count: 18,
    growth: "New",
    isNew: true,
    trend: [0, 8, 18],
    category: "IT Operations",
    activeUsers: 8,
    resolutionRate: 71,
    departments: [
      { name: "IT Ops", share: 66 },
      { name: "Finance", share: 12 },
      { name: "Legal", share: 9 },
      { name: "HR", share: 5 },
      { name: "Other", share: 8 },
    ],
  },
  {
    name: "Asset management",
    status: "Pilot",
    count: 12,
    growth: "New",
    isNew: true,
    trend: [0, 5, 12],
    category: "IT Operations",
    activeUsers: 6,
    resolutionRate: 68,
    departments: [
      { name: "IT Ops", share: 70 },
      { name: "Finance", share: 14 },
      { name: "HR", share: 6 },
      { name: "Legal", share: 4 },
      { name: "Other", share: 6 },
    ],
  },
];

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => slugify(u.name) === slug);
}

// Build 6-month trend ending in current count, anchored by 3-pt trend.
export function monthlyTrend(uc: UseCase): { m: string; actual: number }[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const [a, b, c] = uc.trend;
  // Extrapolate 3 earlier months by extending downward proportionally.
  const step = b - a || Math.max(1, Math.round(a * 0.05));
  const m0 = Math.max(0, a - step * 3);
  const m1 = Math.max(0, a - step * 2);
  const m2 = Math.max(0, a - step);
  const vals = [m0, m1, m2, a, b, c];
  return months.map((m, i) => ({ m, actual: vals[i] }));
}
