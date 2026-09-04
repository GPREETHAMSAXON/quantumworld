// SERVER-SIDE ONLY. Never import this from a 'use client' file or the browser
// bundle will try to include the service-role secret.
//
// This client bypasses Row Level Security entirely — it exists only for the
// handful of admin operations the anon key cannot perform (creating auth
// users). Everything else (reading/updating profiles, internships) should go
// through the normal request-scoped server or browser client so RLS stays
// the single source of truth for who can do what.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to .env (Supabase dashboard -> Settings -> API) to enable admin account creation.'
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Verifies the caller of the current request is an authenticated, active admin.
 * Reads the requester's own session via the cookie-scoped server client — this
 * is the access-control check that must run before any admin-only route uses
 * the privileged client above.
 */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin' || profile.status !== 'active') return null;
  return { user, profile };
}
