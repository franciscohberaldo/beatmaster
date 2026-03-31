"use client";

import { useTransport } from "@/hooks/useTransport";
import { useMidi } from "@/hooks/useMidi";
import { useUIStore } from "@/store";
import { clamp } from "@/lib/utils";
import { MIN_BPM, MAX_BPM } from "@/lib/constants";
import { ProjectManager } from "../ProjectManager/ProjectManager";

export function Transport() {
  const { bpm, isPlaying, play, stop, updateBpm } = useTransport();
  const { enableMidi, startLearn, stopLearn } = useMidi();
  const midiConnected = useUIStore((s) => s.midiState.isConnected);
  const midiDeviceName = useUIStore((s) => s.midiState.deviceName);
  const learnActive = useUIStore((s) => s.midiLearn.isActive);
  const learnMapped = useUIStore((s) => s.midiLearn.mapped);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBpm(clamp(Number(e.target.value), MIN_BPM, MAX_BPM));
  };

  return (
    <div className="flex items-center h-12 px-3 bg-surface-1 border-b border-white/5 flex-shrink-0 gap-2">
      {/* Left: Logo + Project name */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center text-xs font-bold text-black select-none">
          B
        </div>
        <span className="font-mono font-bold text-sm text-white tracking-wider">BEATMAKER</span>
      </div>

      <ProjectManager />

      {/* Center: Transport controls */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <button
          className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
          title="Restart"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="1" width="2" height="12" rx="1"/>
            <path d="M5 7L13 2v10L5 7z"/>
          </svg>
        </button>

        <button
          onClick={() => (isPlaying ? stop() : play())}
          className={`flex items-center gap-1.5 px-5 py-1.5 rounded-md font-mono text-sm font-bold transition-all active:scale-95 ${
            isPlaying
              ? "bg-rose-500/80 text-white hover:bg-rose-500"
              : "bg-emerald-500 text-black hover:bg-emerald-400"
          }`}
        >
          {isPlaying ? <>■ STOP</> : <>▶ PLAY</>}
        </button>

        <button
          className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
          title="Skip forward"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="11" y="1" width="2" height="12" rx="1"/>
            <path d="M9 7L1 2v10L9 7z"/>
          </svg>
        </button>
      </div>

      {/* BPM + time sig */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-mono text-white/40">BPM</span>
        <input
          type="number"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={handleBpmChange}
          className="w-12 bg-transparent text-sm font-mono font-bold text-white text-center
            focus:outline-none focus:bg-surface-2 rounded px-1 border-none"
        />
        <span className="text-[11px] font-mono text-white/30">4/4</span>
        <div className="flex gap-0.5">
          <div className="w-2 h-3 rounded-sm bg-white/25" />
          <div className="w-2 h-3 rounded-sm bg-white/10" />
        </div>
      </div>

      {/* MIDI + settings */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-1">
        {learnActive && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300">Pad {learnMapped}/16</span>
            <button onClick={stopLearn} className="text-amber-400/60 hover:text-amber-400 text-xs leading-none ml-0.5">✕</button>
          </div>
        )}

        {midiConnected ? (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono
              bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {(midiDeviceName ?? "MIDI").slice(0, 14)}
            </div>
            {!learnActive && (
              <button
                onClick={startLearn}
                className="px-2 py-1 text-[10px] font-mono rounded
                  bg-surface-2 border border-white/10 text-white/40
                  hover:text-white/70 transition-colors"
              >
                Learn
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={enableMidi}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono
              bg-surface-2 border border-white/10 text-white/40
              hover:text-white/70 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="3" width="8" height="4" rx="1"/>
              <path d="M3 3V2M5 3V1.5M7 3V2"/>
            </svg>
            MIDI
          </button>
        )}

        <button className="w-7 h-7 flex items-center justify-center rounded text-white/25
          hover:text-white/50 hover:bg-surface-2 transition-colors">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="6.5" cy="6.5" r="2"/>
            <circle cx="6.5" cy="6.5" r="5.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
