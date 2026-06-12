# Engineering Handoff — Product Health Dashboard

Audience: an engineer who has never opened this repo. After 15 minutes here you
should know what runs, where it lives, and what's fake.

---

## 1. Start Here (15-minute onboarding)

### Run it

```bash
bun install
bun run dev          # http://localhost:5173
```

Build + typecheck run automatically in Lovable; locally use `bun run build`.

### Open these files first, in order

1. `README.md` — stack + folder map.
2. `src/routes/__root.tsx` — app shell, providers, `<Outlet />`.
3. `src/routes/index.tsx` — thin route, renders `<DashboardScreen />`.
4. `src/screens/dashboard/DashboardScreen.tsx` — the entire main page.
5. `src/screens/dashboard/data.ts` — every number on the main page.
6. `src/data/useCases.ts` — the shared dataset (used by both screens).
7. `src/components/states.tsx` — loading / empty / error primitives.

### Mental model in one paragraph

TanStack Start with file-based routing. Two screens: `/` (dashboard) and
`/use-case/$slug` (detail). Routes are **thin** — they only handle params,
loaders, and metadata, then render a `Screen` component from `src/screens/`.
All data is hard-coded in `data.ts` files. There is no backend, no auth, no
database. Lifecycle states (`loading | empty | error | ready`) are simulated
via a `?state=` URL param using shared primitives.

### Try this in the browser

- `/` — happy path
- `/?state=loading` — skeletons everywhere
- `/?state=error` — error messages with retry, KPIs show cached badge
- `/?state=empty` — use-case rows collapse to "No activity"
- `/use-case/code-review-assist` — detail page (slugified name)
- `/use-case/code-review-assist?state=loading` — independent skeletons per card

### What you should NOT do

- Don't edit `src/routeTree.gen.ts` — auto-generated.
- Don't add `src/pages/` or `app/layout.tsx` — wrong framework conventions.
- Don't hardcode `text-white` / `bg-[#hex]` — use semantic Tailwind tokens
  from `src/styles.css`.
- Don't introduce new colors — palette is locked to neutral / sky / emerald / amber.
- Don't put fetches in `useEffect`. When you add a backend, use TanStack
  Query inside route loaders (template already wires QueryClient).

---

## 2. Component Inventory

### Routes — `src/routes/`

| File | URL | Purpose |
|---|---|---|
| `__root.tsx` | — | App shell, `<head>` defaults, `<Outlet />`. |
| `index.tsx` | `/` | Validates `?state`, renders `<DashboardScreen />`. |
| `use-case.$slug.tsx` | `/use-case/:slug` | Loads use case by slug (404 if missing), renders `<UseCaseDetailScreen />`. |

### Dashboard screen — `src/screens/dashboard/`

| Export | File | Purpose |
|---|---|---|
| `DashboardScreen` | `DashboardScreen.tsx` | Full main-page layout: header, KPI strip, traffic+forecast chart, pipeline bar chart, use-case activity list, roadmap, forecast cards, field signals. Receives `{ state, onRetry }`. |
| `StatusBadge` | `badges.tsx` | Pill for use-case status: `Live` (emerald) / `Beta` (amber) / `Pilot` (neutral). |
| `RoadStatusBadge` | `badges.tsx` | Pill for roadmap items: `Done` / `In Progress` / `Planned` / `Backlog`. |
| `ROAD_EDGE` | `badges.tsx` | Map of `RoadStatus → left-border color class` for roadmap cards. |
| `GrowthBadge` | `badges.tsx` | Magnitude-scaled growth pill. `New` = amber, `≤+10%` light emerald, `≤+30%` medium emerald, `>+30%` vivid emerald. Logic stays neutral for future negatives. |
| `MiniSparkline` | `badges.tsx` | Inline 28×14px SVG line+dot chart from a `[n, n, n]` tuple. |

### Use-case detail screen — `src/screens/use-case/`

| Export | File | Purpose |
|---|---|---|
| `UseCaseDetailScreen` | `UseCaseDetailScreen.tsx` | Back link, header, 4 metric cards (requests / MoM / users / resolution), 6-month area chart, top-departments list. Each block handles loading/empty/error independently. Receives `{ uc, state, onRetry }`. |
| `StatusBadge` | `badges.tsx` | Same shape as dashboard's, kept local to avoid cross-screen coupling. |

### Shared state primitives — `src/components/states.tsx`

Design rule: **states are additive** — they replace data, never the surrounding component. Tokens limited to neutral / sky / emerald / amber.

| Export | Purpose |
|---|---|
| `DataState` (type) | Union: `"ready" \| "loading" \| "empty" \| "error"`. |
| `SkeletonLine` | Pulsing rounded bar for inline KPI/text placeholders. |
| `ChartSkeleton` | Pulsing grey bars matching an area-chart canvas (default 320px). |
| `BarChartSkeleton` | Horizontal bar skeleton with row labels for the pipeline chart. |
| `EmptyMessage` | Centered neutral copy for "no data this period". |
| `ErrorMessage` | Centered error copy with optional `Retry →` link. |
| `CachedBadge` | Amber inline badge ("Showing cached data · Jun 3 · Retry") for KPI cards in error state. |
| `AllClear` | Emerald check pill for "no alerts" empty states (reserved for the alerts panel — not currently rendered). |
| `parseStateParam` | Narrows an unknown `?state` value to `DataState`, defaulting to `"ready"`. |
| `StateToggle` | Dev-only chip row in each header to switch states; updates `?state=` via TanStack `<Link>`. |

### Shared data helpers — `src/data/useCases.ts`

| Export | Purpose |
|---|---|
| `Status` (type) | `"Live" \| "Beta" \| "Pilot"`. |
| `UseCase` (type) | See data model below. |
| `USE_CASES` | Array of 12 mocked use cases. |
| `slugify(name)` | `"Code review assist"` → `"code-review-assist"`. URL-safe. |
| `getUseCase(slug)` | Lookup by slug; returns `undefined` if missing (route turns this into 404). |
| `monthlyTrend(uc)` | Builds a 6-point `{ m, actual }` series for the detail chart by extrapolating 3 earlier months from the 3-point `trend` tuple. |

### UI library — `src/components/ui/`

shadcn/ui primitives (button, card, dialog, etc.). Only `skeleton.tsx` is
related to states, and the dashboard does **not** use it — we use the
custom skeletons in `states.tsx` because they match chart shapes specifically.
Treat the rest of `ui/` as a library: import when needed, don't restyle.

---

## 3. Data Model

All types live in `src/data/useCases.ts` and `src/screens/dashboard/data.ts`.

### `UseCase` (shared, drives both screens)

```ts
type Status = "Live" | "Beta" | "Pilot";

type UseCase = {
  name: string;             // display name; slug derived via slugify()
  status: Status;
  count: number;             // monthly requests, current period
  growth: string;            // "+12%" | "+44%" | "New"
  isNew?: boolean;           // true → render "New" amber badge
  trend: [number, number, number];  // last 3 months, oldest → newest
  category: string;
  activeUsers: number;
  resolutionRate: number;    // 0–100
  departments: { name: string; share: number }[];  // share is 0–100
};
```

Invariants worth knowing:

- `trend[2]` should equal `count` for the sparkline to land on the current bar.
- `departments[*].share` is rendered as a percent and as a bar — the widest
  department fills 100% of the bar track (relative scaling).
- `growth` is parsed by regex `/^\+?(\d+)%$/`; anything else (e.g. `"New"`,
  future `"-5%"`) falls back to neutral styling. Negative-magnitude bins
  aren't defined yet.

### Dashboard data (`src/screens/dashboard/data.ts`)

| Constant | Shape | Drives |
|---|---|---|
| `KPIS` | `{ label, value, delta }[]` | 4 cards across the top |
| `TRAFFIC` | `{ m, actual?, forecast? }[]` | Traffic + forecast area chart (Oct → Sep, overlap at Jun) |
| `PIPELINE` | `{ stage, value }[]` | User funnel bar chart |
| `ROADMAP` | `{ quarter, badge, dot, items: { title, status, tag }[] }[]` | 3-column roadmap grid |
| `FORECAST` | `{ label, value, sub }[]` | Q3 2026 forecast cards |
| `FIELD_SIGNALS` | `{ q, a }[]` | Three pull-quotes at the bottom |
| `RoadStatus` (type) | `"Done" \| "In Progress" \| "Planned" \| "Backlog"` | Roadmap items |

### URL contract

- `/?state=loading|empty|error|ready` — validated by `parseStateParam`; unknown values fall back to `ready`.
- `/use-case/$slug` — slug must match `slugify(name)` of an entry in `USE_CASES`, else 404.
- `/use-case/$slug?state=...` — same state semantics as the dashboard.

---

## 4. Mocked vs. Real

### Mocked (everything)

| Area | Where | Notes |
|---|---|---|
| Use-case dataset | `src/data/useCases.ts` | Static array of 12. |
| KPI / traffic / pipeline / roadmap / forecast / quotes | `src/screens/dashboard/data.ts` | All hard-coded. |
| 6-month detail trend | `monthlyTrend()` in `useCases.ts` | Extrapolated client-side from the 3-point `trend` tuple. |
| Loading / empty / error states | `?state=` URL param | Pure UI simulation; no fetch is in flight. |
| Retry button | `onRetry` → `navigate({ search: { state: "ready" } })` | Just clears the param. |
| Headline metrics ("82/100", "Q2 2026 · Jun 4") | Inline strings in `DashboardScreen.tsx` | Static. |
| Alerts panel | Described in PRD, `AllClear` primitive exists | Not wired into any screen yet. |

### Real

| Area | Where |
|---|---|
| Routing, SSR, params, head metadata | TanStack Start in `src/routes/` |
| Component composition & state-prop pattern | `src/screens/*` |
| Charts | Recharts (`AreaChart`, `BarChart`) |
| Skeleton / empty / error primitives | `src/components/states.tsx` |
| Design tokens & responsive layout | Tailwind v4 via `src/styles.css` |
| Growth-badge magnitude logic | `GrowthBadge` in `dashboard/badges.tsx` |
| Slug routing + 404 on unknown slug | `use-case.$slug.tsx` loader + `notFoundComponent` |

### Not built yet

- Backend / ingestion / DB / auth.
- Per-user or department-scoped views.
- Alerts panel rendering (primitive exists, no host).
- Period selector (Q1 / Q2 / QTD tabs).
- Real-time updates or websockets.

---

## 5. Wiring a Real Backend (when you're ready)

1. **Enable Lovable Cloud** — provisions Postgres + auth + server runtime.
2. **Define tables** in a migration. Always include `GRANT` for `authenticated` and `service_role`, and RLS policies (see the project's `<public-schema-grants>` and `<user-roles>` rules).
3. **Server functions** go in `src/lib/<feature>.functions.ts` using `createServerFn` from `@tanstack/react-start`. Protect with `requireSupabaseAuth` middleware.
4. **Read from loaders**: in each route, `context.queryClient.ensureQueryData(queryOptions)` in the loader; `useSuspenseQuery(queryOptions)` in the screen.
5. **Replace `data.ts` exports** with `queryOptions` factories. The screens stay the same — they just receive data via props/hooks instead of imports.
6. **Map `?state` → real state**: tie `state` to `useSuspenseQuery`'s status (`pending` / `error`) and to a real empty-check (`data.length === 0`). Keep the URL param as a dev override.

The state-handling primitives, screen layouts, and component contracts are
designed to survive this swap unchanged.
