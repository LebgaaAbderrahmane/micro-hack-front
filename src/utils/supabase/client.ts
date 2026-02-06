import { createBrowserClient } from "@supabase/ssr";

// We removed the singleton 'let client' to ensure that cookie changes
// are always picked up correctly on every call, avoiding stale state.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
