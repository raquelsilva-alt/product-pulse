
-- USE CASES
CREATE TABLE public.use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL CHECK (status IN ('Live','Beta','Pilot')),
  count integer NOT NULL DEFAULT 0,
  growth text NOT NULL,
  is_new boolean NOT NULL DEFAULT false,
  trend integer[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  active_users integer NOT NULL DEFAULT 0,
  resolution_rate integer NOT NULL DEFAULT 0,
  departments jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.use_cases TO anon, authenticated;
GRANT ALL ON public.use_cases TO service_role;
ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Use cases are publicly readable" ON public.use_cases FOR SELECT USING (true);

-- KPIS
CREATE TABLE public.kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  delta text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.kpis TO anon, authenticated;
GRANT ALL ON public.kpis TO service_role;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "KPIs are publicly readable" ON public.kpis FOR SELECT USING (true);

-- TRAFFIC
CREATE TABLE public.traffic_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL,
  actual integer,
  forecast integer,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.traffic_points TO anon, authenticated;
GRANT ALL ON public.traffic_points TO service_role;
ALTER TABLE public.traffic_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Traffic is publicly readable" ON public.traffic_points FOR SELECT USING (true);

-- PIPELINE
CREATE TABLE public.pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage text NOT NULL,
  value integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pipeline_stages TO anon, authenticated;
GRANT ALL ON public.pipeline_stages TO service_role;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pipeline is publicly readable" ON public.pipeline_stages FOR SELECT USING (true);

-- ROADMAP
CREATE TABLE public.roadmap_columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter text NOT NULL,
  badge text NOT NULL DEFAULT '',
  dot text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.roadmap_columns TO anon, authenticated;
GRANT ALL ON public.roadmap_columns TO service_role;
ALTER TABLE public.roadmap_columns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roadmap columns are publicly readable" ON public.roadmap_columns FOR SELECT USING (true);

CREATE TABLE public.roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id uuid NOT NULL REFERENCES public.roadmap_columns(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('Done','In Progress','Planned','Backlog')),
  tag text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.roadmap_items TO anon, authenticated;
GRANT ALL ON public.roadmap_items TO service_role;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roadmap items are publicly readable" ON public.roadmap_items FOR SELECT USING (true);

-- FORECAST
CREATE TABLE public.forecast_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  sub text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forecast_items TO anon, authenticated;
GRANT ALL ON public.forecast_items TO service_role;
ALTER TABLE public.forecast_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forecast is publicly readable" ON public.forecast_items FOR SELECT USING (true);

-- FIELD SIGNALS
CREATE TABLE public.field_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  attribution text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.field_signals TO anon, authenticated;
GRANT ALL ON public.field_signals TO service_role;
ALTER TABLE public.field_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Field signals are publicly readable" ON public.field_signals FOR SELECT USING (true);
