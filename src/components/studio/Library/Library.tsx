"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useProjectStore, useUIStore } from "@/store";
import AudioEngine from "@/engine/AudioEngine";
import type { DbSample, PadId } from "@/types";

type LibraryTab = "samples" | "kits";

export function Library() {
  const [tab, setTab] = useState<LibraryTab>("samples");
  const [samples, setSamples] = useState<DbSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPadId = useUIStore((s) => s.selectedPadId);
  const updatePad = useProjectStore((s) => s.updatePad);
  const pad = useProjectStore((s) =>
    selectedPadId !== null ? s.currentProject?.pads[selectedPadId] : null
  );

  const supabase = isSupabaseConfigured ? createClient() : null;

  const loadSamples = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("samples")
      .select("*")
      .order("created_at", { ascending: false });
    setSamples((data as DbSample[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  const uploadFile = useCallback(async (file: File) => {
    if (!supabase) return;
    if (!file.type.startsWith("audio/") && !file.name.match(/\.(wav|mp3|ogg|flac|aif|aiff)$/i)) return;

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? "anonymous";
    const ext = file.name.split(".").pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    await supabase.storage.from("samples").upload(path, file, { contentType: file.type });
    await supabase.from("samples").insert({
      user_id: userId,
      name: file.name.replace(/\.[^.]+$/, ""),
      storage_path: path,
      file_size: file.size,
      mime_type: file.type || "audio/wav",
    });

    setUploading(false);
    await loadSamples();
  }, [supabase, loadSamples]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  }, [uploadFile]);

  const assignToSelectedPad = useCallback(async (sample: DbSample) => {
    if (!supabase || selectedPadId === null) return;
    const { data } = supabase.storage.from("samples").getPublicUrl(sample.storage_path);
    const url = data.publicUrl;
    updatePad(selectedPadId as PadId, { sampleUrl: url, sampleName: sample.name });
    await AudioEngine.getInstance().loadSample({
      padId: selectedPadId as PadId,
      url,
      volume: pad?.volume ?? 0.8,
      pitch: pad?.pitch ?? 0,
    });
  }, [supabase, selectedPadId, updatePad, pad]);

  const previewSample = useCallback(async (sample: DbSample) => {
    if (!supabase) return;
    setPreviewId(sample.id);
    const { data } = supabase.storage.from("samples").getPublicUrl(sample.storage_path);
    const audio = new Audio(data.publicUrl);
    audio.volume = 0.7;
    audio.play().catch(() => null);
    audio.onended = () => setPreviewId(null);
  }, [supabase]);

  const deleteSample = useCallback(async (sample: DbSample, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supabase) return;
    if (!confirm(`Deletar "${sample.name}"?`)) return;
    await supabase.storage.from("samples").remove([sample.storage_path]);
    await supabase.from("samples").delete().eq("id", sample.id);
    setSamples((prev) => prev.filter((s) => s.id !== sample.id));
  }, [supabase]);

  const filtered = samples.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}b`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}kb`;
    return `${(bytes / 1024 / 1024).toFixed(1)}mb`;
  };

  return (
    <div className="flex flex-col h-full bg-surface-1 border-r border-white/5">
      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {(["samples", "kits"] as LibraryTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors
              ${tab === t
                ? "text-white border-b-2 border-emerald-500 bg-surface-2"
                : "text-white/30 hover:text-white/60"
              }`}
          >
            {t === "samples" ? "⊞ Samples" : "◈ Kits"}
          </button>
        ))}
      </div>

      {tab === "samples" && (
        <>
          {/* Search */}
          <div className="px-2 py-2 border-b border-white/5">
            <div className="flex items-center gap-1 bg-surface-2 rounded px-2">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-white/30 flex-shrink-0">
                <path d="M6.5 6.5L9 9M1 4.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="buscar..."
                className="flex-1 bg-transparent py-1.5 text-xs font-mono text-white placeholder-white/20
                  focus:outline-none min-w-0"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-white/20 hover:text-white/50 text-sm">×</button>
              )}
            </div>
          </div>

          {/* Upload area */}
          <div
            className={`mx-2 mt-2 mb-1 border-2 border-dashed rounded-lg transition-all cursor-pointer
              ${dragOver
                ? "border-emerald-500/60 bg-emerald-500/10"
                : "border-white/10 hover:border-white/20"
              }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          >
            <div className="py-3 text-center">
              {uploading ? (
                <span className="text-xs font-mono text-emerald-400 animate-pulse">Uploading…</span>
              ) : (
                <span className="text-[10px] font-mono text-white/30">
                  {isSupabaseConfigured ? "↑ Upload / Arrastar samples" : "Configure Supabase para upload"}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.wav,.mp3,.ogg,.flac,.aif,.aiff"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={!isSupabaseConfigured || uploading}
            />
          </div>

          {/* Selected pad indicator */}
          {selectedPadId !== null && (
            <div className="mx-2 mb-1 px-2 py-1 bg-surface-2 rounded text-[10px] font-mono text-white/40">
              → click para atribuir ao <span className="text-white/70">{pad?.name ?? `Pad ${selectedPadId}`}</span>
            </div>
          )}

          {/* Sample list */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="py-6 text-center text-xs font-mono text-white/20">Carregando…</div>
            )}
            {!loading && !isSupabaseConfigured && (
              <div className="py-6 px-3 text-center text-xs font-mono text-white/20">
                Configure o Supabase para usar a biblioteca
              </div>
            )}
            {!loading && isSupabaseConfigured && filtered.length === 0 && (
              <div className="py-6 text-center text-xs font-mono text-white/20">
                {search ? "Nenhum resultado" : "Nenhum sample ainda"}
              </div>
            )}

            {filtered.map((sample) => (
              <div
                key={sample.id}
                onClick={() => assignToSelectedPad(sample)}
                className="group flex items-center gap-2 px-2 py-1.5 cursor-pointer
                  hover:bg-surface-2 transition-colors border-b border-white/[0.03]"
              >
                {/* Preview button */}
                <button
                  onClick={(e) => { e.stopPropagation(); previewSample(sample); }}
                  className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors
                    ${previewId === sample.id
                      ? "bg-emerald-500/30 text-emerald-400"
                      : "text-white/20 hover:text-white/60 hover:bg-white/10"
                    }`}
                >
                  {previewId === sample.id ? (
                    <span className="text-[8px]">■</span>
                  ) : (
                    <span className="text-[8px]">▶</span>
                  )}
                </button>

                {/* Name + size */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-white/70 truncate group-hover:text-white/90 transition-colors">
                    {sample.name}
                  </div>
                  <div className="text-[9px] font-mono text-white/25">
                    {formatSize(sample.file_size)}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => deleteSample(sample, e)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-rose-400
                    transition-all text-sm leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-2 py-1.5 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/20">{samples.length} samples</span>
            <button
              onClick={loadSamples}
              className="text-[9px] font-mono text-white/20 hover:text-white/50 transition-colors"
            >
              ↻ atualizar
            </button>
          </div>
        </>
      )}

      {tab === "kits" && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs font-mono text-white/20">Kits — em breve</span>
        </div>
      )}
    </div>
  );
}
