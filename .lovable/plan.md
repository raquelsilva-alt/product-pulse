## Goal

Rebrand and re-content the existing dashboard for your product: a Graph RAG layer that reduces hallucinations in customer-support chatbots. Keep the visual system (cards, tokens, dark/light theme), swap data, and add 2 new charts tailored to your domain.

## Header & branding

- Title: "GraphTruth — Product Pulse" (placeholder, easy to change)
- Subtitle: "Graph RAG for hallucination-free chatbots · Q2 2026"

## KPIs (4 cards, top row)

Replace the 4 generic KPIs with:
1. Positive feedback (this quarter) — e.g. `4,820` ▲ +28%
2. Service Requests solved by agent — e.g. `12,340` ▲ +41%
3. SRs avoided (accurate first response) — e.g. `8,150` ▲ +52%
4. Hallucination rate — e.g. `2.1%` ▼ −63% (lower is better; show down-arrow as positive)

## Main chart — Quarter actuals + Q3 forecast (kept, re-keyed)

AreaChart over W1–W12. Series:
- SRs solved (actual W1–W8, forecast dashed W8–W12)
- SRs avoided (actual W1–W8, forecast dashed)
- Hallucination rate % on a secondary axis (declining curve)

## NEW chart 1 — Hallucination reduction vs baseline (BarChart)

Grouped bars per use case / bot type showing:
- Baseline hallucination rate (without Graph RAG)
- With Graph RAG
Categories: Billing bot, Tier-1 support, Technical troubleshooting, Account management, Onboarding assistant.

## NEW chart 2 — Graph coverage & query accuracy trend (LineChart)

Two lines across the previous quarter:
- Knowledge graph node coverage %
- Answer accuracy %
Shows the correlation between expanding the graph and accuracy gains — a strong PM narrative.

## Pipeline (kept, re-labeled)

Adoption funnel for customer-support deployments:
Prospects → Pilots started → Bots integrated → In production → Expanded (multi-bot)

## Channel mix (kept, re-labeled)

How customers discover the product: Inbound, Partner CRMs (Zendesk/Salesforce), Outbound, Community.

## Tabs

1. Use cases — list of customer-support bot types with adoption + positive-feedback growth:
   - Billing & payments support
   - Tier-1 customer service
   - Technical troubleshooting
   - Account & subscription management
   - Onboarding & how-to assistant
   - Internal agent copilot

2. Activity — sessions/queries by day of the week (kept; relabeled as "Graph queries" and "Grounded answers").

3. Roadmap — replace items with:
   - Q1 — Shipped: Core Graph RAG engine, Zendesk connector
   - Q2 — In progress: Real-time graph sync (72%), Enterprise SSO & audit logs (55%)
   - Q3 — Next: Horizontal scalability / multi-tenant sharding, Salesforce + Intercom connectors
   - Q4 — Future: Self-serve graph builder, on-prem deployment

## Technical notes

- Single file edit: `src/routes/index.tsx` (data arrays, KPI section, two new `<Card>` blocks with recharts, tab contents, header copy).
- Update `head()` meta: title "GraphTruth — Product Health, Pipeline & Forecast", description mentioning Graph RAG and hallucination reduction.
- No new dependencies; reuses `recharts`, existing UI components, and design tokens (`--chart-1..5`, `--gradient-primary`).
- No backend / Lovable Cloud needed — mock data only, as fits a PM report.

## Out of scope

- Real data ingestion, auth, persistence — this remains a presentation dashboard.
