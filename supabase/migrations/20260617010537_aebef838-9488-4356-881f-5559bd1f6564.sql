
-- Drop old tables
DROP TABLE IF EXISTS public.roadmap_items CASCADE;
DROP TABLE IF EXISTS public.roadmap_columns CASCADE;
DROP TABLE IF EXISTS public.use_cases CASCADE;
DROP TABLE IF EXISTS public.kpis CASCADE;
DROP TABLE IF EXISTS public.traffic_points CASCADE;
DROP TABLE IF EXISTS public.pipeline_stages CASCADE;
DROP TABLE IF EXISTS public.forecast_items CASCADE;
DROP TABLE IF EXISTS public.field_signals CASCADE;

-- Seed auth user so FK targets exist
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated','authenticated',
  'seed@example.com','', now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
  false, '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

-- user_profiles
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  org_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_write" ON public.user_profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- kpis
CREATE TABLE public.kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  delta text NOT NULL,
  period text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.kpis TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpis TO authenticated;
GRANT ALL ON public.kpis TO service_role;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kpis_public_read" ON public.kpis FOR SELECT USING (true);
CREATE POLICY "kpis_owner_write" ON public.kpis FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- traffic_monthly
CREATE TABLE public.traffic_monthly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL,
  actual int,
  forecast int,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.traffic_monthly TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.traffic_monthly TO authenticated;
GRANT ALL ON public.traffic_monthly TO service_role;
ALTER TABLE public.traffic_monthly ENABLE ROW LEVEL SECURITY;
CREATE POLICY "traffic_public_read" ON public.traffic_monthly FOR SELECT USING (true);
CREATE POLICY "traffic_owner_write" ON public.traffic_monthly FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pipeline_stages
CREATE TABLE public.pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage text NOT NULL,
  value int NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pipeline_stages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_stages TO authenticated;
GRANT ALL ON public.pipeline_stages TO service_role;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pipeline_public_read" ON public.pipeline_stages FOR SELECT USING (true);
CREATE POLICY "pipeline_owner_write" ON public.pipeline_stages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- use_cases
CREATE TABLE public.use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL CHECK (status IN ('Live','Beta','Pilot')),
  count int NOT NULL DEFAULT 0,
  growth text NOT NULL DEFAULT '',
  is_new boolean NOT NULL DEFAULT false,
  trend int[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT '',
  active_users int NOT NULL DEFAULT 0,
  resolution_rate int NOT NULL DEFAULT 0,
  departments jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.use_cases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.use_cases TO authenticated;
GRANT ALL ON public.use_cases TO service_role;
ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usecases_public_read" ON public.use_cases FOR SELECT USING (true);
CREATE POLICY "usecases_owner_write" ON public.use_cases FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- roadmap_items
CREATE TABLE public.roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter text NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('Done','In Progress','Planned','Backlog')),
  tag text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.roadmap_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_items TO authenticated;
GRANT ALL ON public.roadmap_items TO service_role;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roadmap_public_read" ON public.roadmap_items FOR SELECT USING (true);
CREATE POLICY "roadmap_owner_write" ON public.roadmap_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- forecast_summary
CREATE TABLE public.forecast_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  sub text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forecast_summary TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forecast_summary TO authenticated;
GRANT ALL ON public.forecast_summary TO service_role;
ALTER TABLE public.forecast_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forecast_public_read" ON public.forecast_summary FOR SELECT USING (true);
CREATE POLICY "forecast_owner_write" ON public.forecast_summary FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- field_signals
CREATE TABLE public.field_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote text NOT NULL,
  attribution text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.field_signals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.field_signals TO authenticated;
GRANT ALL ON public.field_signals TO service_role;
ALTER TABLE public.field_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signals_public_read" ON public.field_signals FOR SELECT USING (true);
CREATE POLICY "signals_owner_write" ON public.field_signals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed profile
INSERT INTO public.user_profiles (id, display_name, org_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo User', 'Measure it')
ON CONFLICT (id) DO NOTHING;
