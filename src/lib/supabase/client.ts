import { createBrowserClient } from "@supabase/ssr";

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-supabase");

export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase not configured. Add credentials to .env.local");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
