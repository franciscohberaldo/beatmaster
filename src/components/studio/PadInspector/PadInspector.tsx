"use client";

import { useProjectStore, useUIStore } from "@/store";
import { useCallback } from "react";
import AudioEngine from "@/engine/AudioEngine";
import { clamp } from "@/lib/utils";
import type { PadId } from "@/types";

export function PadInspector() {
  const selectedPadId = useUIStore((s) => s.selectedPadId);
  const pad = useProjectStore((s) =>
    selectedPadId !== null ? s.currentProject?.pads[selectedPadId] : null
  );
  const updatePad = useProjectStore((s) => s.updatePad);
  const openSampleBrowser = useUIStore((s) => s.openSampleBrowser);

  const update = useCallback(
    (field: string, value: unknown) => {
      if (selectedPadId === null) return;
      updatePad(selectedPadId as PadId, { [field]: value });
      // Immediately sync to audio engine
      const engine = AudioEngine.getInstance();
      if (field === "volume") engine.setVolume(selectedPadId as PadId, value as number);
      if (field === "pitch") engine.setPitch(selectedPadId as PadId, value as number);
      if (field === "isMuted") engine.setMuted(selectedPadId as PadId, value as boolean);
      if (field === "isSolo") engine.setSolo(selectedPadId as PadId, value as boolean);
    },
    [selectedPadId, updatePad]
  );

  if (!pad || selectedPadId === null) {
    return (
      <div className="p-4 text-white/30 text-sm font-mono text-center">
        Select a pad
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Pad name */}
      <div className="space-y-1">
        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Name</label>
        <input
          value={pad.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full bg-surface-2 border border-white/10 rounded px-2 py-1
            text-sm font-mono text-white focus:outline-none focus:border-white/30"
        />
      </div>

      {/* Sample */}
      <div className="space-y-1">
        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Sample</label>
        <button
          onClick={() => openSampleBrowser(selectedPadId as PadId)}
          className="w-full text-left bg-surface-2 border border-white/10 rounded px-2 py-1.5
            text-sm font-mono text-white/70 hover:bg-surface-3 transition-colors truncate"
        >
          {pad.sampleName ?? "Click to load sample…"}
        </button>
      </div>

      {/* Volume */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Volume</label>
          <span className="text-[10px] font-mono text-white/50">{Math.round(pad.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={pad.volume}
          onChange={(e) => update("volume", clamp(Number(e.target.value), 0, 1))}
          className="w-full accent-emerald-500"
        />
      </div>

      {/* Pitch */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Pitch</label>
          <span className="text-[10px] font-mono text-white/50">{pad.pitch > 0 ? "+" : ""}{pad.pitch} st</span>
        </div>
        <input
          type="range"
          min={-24}
          max={24}
          step={1}
          value={pad.pitch}
          onChange={(e) => update("pitch", Number(e.target.value))}
          className="w-full accent-violet-500"
        />
        <button
          onClick={() => update("pitch", 0)}
          className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Mute / Solo */}
      <div className="flex gap-2">
        <button
          onClick={() => update("isMuted", !pad.isMuted)}
          className={`flex-1 py-1.5 rounded text-xs font-mono font-semibold transition-all
            ${pad.isMuted
              ? "bg-rose-500/30 border border-rose-500/60 text-rose-300"
              : "bg-surface-2 border border-white/10 text-white/50 hover:bg-surface-3"
            }`}
        >
          MUTE
        </button>
        <button
          onClick={() => update("isSolo", !pad.isSolo)}
          className={`flex-1 py-1.5 rounded text-xs font-mono font-semibold transition-all
            ${pad.isSolo
              ? "bg-yellow-500/30 border border-yellow-500/60 text-yellow-300"
              : "bg-surface-2 border border-white/10 text-white/50 hover:bg-surface-3"
            }`}
        >
          SOLO
        </button>
      </div>
    </div>
  );
}
