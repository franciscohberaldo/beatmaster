"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      router.push("/studio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-mono font-bold text-2xl text-white tracking-widest">BEATMAKER</h1>
          <p className="text-sm font-mono text-white/40 mt-1">Web Drum Sampler</p>
        </div>

        <div className="bg-surface-1 border border-white/10 rounded-xl p-6">
          {/* Mode toggle */}
          <div className="flex rounded-lg bg-surface-2 p-1 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded text-sm font-mono font-semibold transition-all
                  ${mode === m
                    ? "bg-surface-3 text-white"
                    : "text-white/40 hover:text-white/60"
                  }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2.5
                  text-sm font-mono text-white focus:outline-none focus:border-white/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2.5
                  text-sm font-mono text-white focus:outline-none focus:border-white/30"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs font-mono text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-mono font-semibold
                bg-emerald-600/20 border border-emerald-500/40 text-emerald-300
                hover:bg-emerald-600/40 disabled:opacity-50 transition-all"
            >
              {loading ? "…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs font-mono text-white/20 mt-4">
            You can use the app without signing in.{" "}
            <a href="/studio" className="text-white/40 hover:text-white/60 underline">
              Skip →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
