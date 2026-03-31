import { createBrowserClient } from "@supabase/ssr";

function validateSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const isSupabaseConfigured =
  validateSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null instead of throwing — caller must check for null
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
