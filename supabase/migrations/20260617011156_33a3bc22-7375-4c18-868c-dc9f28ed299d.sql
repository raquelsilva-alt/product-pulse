
-- Drop permissive read policies and revoke anon access
DROP POLICY IF EXISTS "kpis_public_read" ON public.kpis;
DROP POLICY IF EXISTS "traffic_public_read" ON public.traffic_monthly;
DROP POLICY IF EXISTS "pipeline_public_read" ON public.pipeline_stages;
DROP POLICY IF EXISTS "usecases_public_read" ON public.use_cases;
DROP POLICY IF EXISTS "roadmap_public_read" ON public.roadmap_items;
DROP POLICY IF EXISTS "forecast_public_read" ON public.forecast_summary;
DROP POLICY IF EXISTS "signals_public_read" ON public.field_signals;
DROP POLICY IF EXISTS "profiles_public_read" ON public.user_profiles;

REVOKE SELECT ON public.kpis FROM anon;
REVOKE SELECT ON public.traffic_monthly FROM anon;
REVOKE SELECT ON public.pipeline_stages FROM anon;
REVOKE SELECT ON public.use_cases FROM anon;
REVOKE SELECT ON public.roadmap_items FROM anon;
REVOKE SELECT ON public.forecast_summary FROM anon;
REVOKE SELECT ON public.field_signals FROM anon;
REVOKE SELECT ON public.user_profiles FROM anon;

-- Existing owner_write policies use FOR ALL with auth.uid() = user_id, which already
-- restricts SELECT/INSERT/UPDATE/DELETE to the owner. Nothing else needed.

-- Set a known password on the demo seed user so it can sign in as "User A"
UPDATE auth.users
SET encrypted_password = crypt('Password123!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Auto-create a user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, org_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
