"use client";

import { useCallback, useEffect, useState } from "react";
import { useUIStore, useProjectStore } from "@/store";
import { useSampleUpload } from "@/hooks/useSampleUpload";
import AudioEngine from "@/engine/AudioEngine";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { DbSample, PadId } from "@/types";

export function SampleBrowser() {
  const isOpen = useUIStore((s) => s.isSampleBrowserOpen);
  const targetPad = useUIStore((s) => s.sampleBrowserTargetPad);
  const closeSampleBrowser = useUIStore((s) => s.closeSampleBrowser);
  const updatePad = useProjectStore((s) => s.updatePad);
  const pad = useProjectStore((s) =>
    targetPad !== null ? s.currentProject?.pads[targetPad] : null
  );

  const { upload, uploading, progress } = useSampleUpload();
  const [samples, setSamples] = useState<DbSample[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = isSupabaseConfigured ? createClient() : null;

  const loadSamples = useCallback(async () => {
    if (!supabase) { setSamples([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("samples")
      .select("*")
      .order("created_at", { ascending: false });
    setSamples((data as DbSample[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (isOpen) loadSamples();
  }, [isOpen, loadSamples]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || targetPad === null) return;
    const result = await upload(file, targetPad as PadId);
    await assignSample(result.url, result.name);
    await loadSamples();
  };

  const assignSample = async (url: string, name: string) => {
    if (targetPad === null) return;
    updatePad(targetPad as PadId, { sampleUrl: url, sampleName: name, isLoading: true });
    await AudioEngine.getInstance().loadSample({
      padId: targetPad as PadId,
      url,
      volume: pad?.volume ?? 0.8,
      pitch: pad?.pitch ?? 0,
    });
    closeSampleBrowser();
  };

  const handleAssignExisting = async (sample: DbSample) => {
    if (!supabase) return;
    const { data } = supabase.storage.from("samples").getPublicUrl(sample.storage_path);
    await assignSample(data.publicUrl, sample.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-1 border border-white/10 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="font-mono font-semibold text-white">Load Sample</h2>
            {pad && (
              <p className="text-xs font-mono text-white/40 mt-0.5">→ {pad.name}</p>
            )}
          </div>
          <button
            onClick={closeSampleBrowser}
            className="text-white/40 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Upload new */}
          <div>
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-2">
              Upload New Sample
            </label>
            <label className="flex items-center gap-3 px-4 py-3 bg-surface-2 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-white/40">
                <path d="M10 3a1 1 0 0 1 .707.293l3 3a1 1 0 0 1-1.414 1.414L11 6.414V13a1 1 0 1 1-2 0V6.414L7.707 7.707A1 1 0 0 1 6.293 6.293l3-3A1 1 0 0 1 10 3z"/>
                <path d="M3 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"/>
              </svg>
              <span className="text-sm font-mono text-white/60">
                {uploading ? `Uploading… ${progress}%` : "Choose .wav / .mp3 file"}
              </span>
              <input
                type="file"
                accept="audio/wav,audio/mpeg,audio/ogg,audio/flac,audio/aiff,.wav,.mp3,.ogg,.flac,.aif"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Existing samples */}
          <div>
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-2">
              Your Library ({samples.length})
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {loading && (
                <div className="text-center py-4 text-white/30 text-sm font-mono">Loading…</div>
              )}
              {!loading && samples.length === 0 && (
                <div className="text-center py-4 text-white/20 text-sm font-mono">No samples yet</div>
              )}
              {samples.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleAssignExisting(s)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-surface-2 hover:bg-surface-3
                    transition-colors flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-white/30 flex-shrink-0">
                      <path d="M2 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3z"/>
                    </svg>
                    <span className="text-sm font-mono text-white/70 truncate">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 flex-shrink-0 group-hover:text-white/50">
                    {(s.file_size / 1024).toFixed(0)}kb
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
