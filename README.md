# Product Health Dashboard

Single-pane executive dashboard tracking adoption, growth, and health of internal AI use cases — with drill-down detail per use case.

## Stack

- **Framework:** TanStack Start v1 (React 19, SSR, file-based routing)
- **Build:** Vite 7
- **Styling:** Tailwind CSS v4 via `src/styles.css` (semantic tokens; no `tailwind.config.js`)
- **Charts:** Recharts
- **Components:** shadcn/ui primitives in `src/components/ui/`
- **Runtime:** Edge (Cloudflare Workers)

## Scripts

The dev server is managed by Lovable; build/typecheck run automatically. Locally:

```bash
bun install
bun run dev      # start dev server
bun run build    # production build
```

## Folder Map

```
src/
├── routes/                          # File-based routing (TanStack)
│   ├── __root.tsx                   # App shell
│   ├── index.tsx                    # "/" → renders DashboardScreen
│   ├── use-case.$slug.tsx           # "/use-case/:slug" → renders UseCaseDetailScreen
│   └── api/                         # Server route handlers
│
├── screens/                         # One folder per route, mirroring URLs 1:1
│   ├── dashboard/
│   │   ├── DashboardScreen.tsx      # Pure presentation
│   │   ├── badges.tsx               # StatusBadge, RoadStatusBadge, GrowthBadge, MiniSparkline
│   │   └── data.ts                  # KPIS, TRAFFIC, PIPELINE, ROADMAP, FORECAST, FIELD_SIGNALS (mocked)
│   └── use-case/
│       ├── UseCaseDetailScreen.tsx  # Pure presentation
│       └── badges.tsx               # StatusBadge
│
├── data/
│   └── useCases.ts                  # Shared use-case dataset + helpers (slugify, getUseCase, monthlyTrend)
│
├── components/
│   ├── states.tsx                   # Shared loading/empty/error primitives (skeletons, CachedBadge, etc.)
│   └── ui/                          # shadcn/ui primitives
│
├── lib/                             # Utils, server-function modules (*.functions.ts)
├── integrations/                    # Lovable Cloud / Supabase clients (if enabled)
└── styles.css                       # Tailwind v4 + design tokens
```

## Conventions

### Routes vs Screens

Route files in `src/routes/` are **thin**: they declare metadata, validate search params, run loaders, and render the matching `Screen` from `src/screens/`. All UI lives in `src/screens/<feature>/`.

### Data vs display

- Mock/static data lives in `src/screens/<feature>/data.ts` (feature-local) or `src/data/` (shared across screens, like `useCases.ts`).
- Screen components receive data via props or via shared modules — they never embed business data inline.
- When wiring to a real backend, replace the `data.ts` exports with TanStack Query hooks; the screens shouldn't change shape.

### State handling

Loading / empty / error / cached states use the shared primitives in `src/components/states.tsx`. Add `?state=loading|empty|error|ready` to any URL to preview a state. Rules:

- States are **additive** — they render in place of data, never replace the surrounding component.
- Use existing color tokens only (neutral / sky / emerald / amber). No new colors.
- Skeletons match the approximate shape of the content they replace.

### Design tokens

Colors, gradients, and shadows are defined in `src/styles.css`. Never hardcode `text-white`, `bg-black`, or `bg-[#hex]` in components — use semantic Tailwind utilities tied to the theme.

### Type safety

`createFileRoute("/...")` strings must match the filename exactly. `routeTree.gen.ts` is auto-generated — never edit by hand.

## Mocked vs Real

Everything in `src/screens/*/data.ts` and `src/data/useCases.ts` is **mocked**. The `?state=` param simulates fetch lifecycle without a real backend. No auth, no database, no ingestion pipeline yet.

To make it real: enable Lovable Cloud, move datasets behind server functions in `src/lib/*.functions.ts`, and call them from the route loader via TanStack Query.
