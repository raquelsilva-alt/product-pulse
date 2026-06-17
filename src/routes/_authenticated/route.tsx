// Integration-managed protected layout. Redirects to /auth when not signed in.
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/auth",
        search: { flash: "Please sign in to view your dashboard." },
      });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
