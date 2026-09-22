import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client that bypasses RLS and column grants. The one deliberate
 * exception to "every query runs as the user": Paddle's webhook has no user
 * session, and users.plan must only change from verified billing events.
 * Never import this outside server code that has verified its caller.
 */
export const createAdminSupabase = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
