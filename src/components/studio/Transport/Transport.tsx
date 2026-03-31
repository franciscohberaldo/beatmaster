"use client";

import { useTransport } from "@/hooks/useTransport";
import { useMidi } from "@/hooks/useMidi";
import { useUIStore } from "@/store";
import { clamp } from "@/lib/utils";
import { MIN_BPM, MAX_BPM } from "@/lib/constants";

export function Transport() {
  const { bpm, isPlaying, play, stop, updateBpm } = useTransport();
  const { enableMidi, startLearn, stopLearn } = useMidi();
  const midiConnected = useUIStore((s) => s.midiState.isConnected);
  const midiDeviceName = useUIStore((s) => s.midiState.deviceName);
  const midiError = useUIStore((s) => s.midiState.error);
  const learnActive = useUIStore((s) => s.midiLearn.isActive);
  const learnMapped = useUIStore((s) => s.midiLearn.mapped);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = clamp(Number(e.target.value), MIN_BPM, MAX_BPM);
    updateBpm(val);
  };

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-surface-1 border-b border-white/5">
      {/* Play/Stop */}
      <button
        onClick={() => isPlaying ? stop() : play()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-all
          bg-emerald-600/20 border border-emerald-500/40 text-emerald-300
          hover:bg-emerald-600/40 active:scale-95"
      >
        {isPlaying ? <><span className="text-xs">■</span> STOP</> : <><span className="text-xs">▶</span> PLAY</>}
      </button>

      {/* BPM */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-white/40">BPM</span>
        <input
          type="number" min={MIN_BPM} max={MAX_BPM} value={bpm}
          onChange={handleBpmChange}
          className="w-16 bg-surface-2 border border-white/10 rounded px-2 py-1
            text-sm font-mono text-white text-center focus:outline-none focus:border-white/30"
        />
        <input
          type="range" min={MIN_BPM} max={MAX_BPM} value={bpm}
          onChange={handleBpmChange}
          className="w-24 accent-emerald-500"
        />
      </div>

      <div className="flex-1" />

      {/* MIDI Learn mode banner */}
      {learnActive && (
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono text-amber-300">
            Aperte o pad <span className="font-bold">{learnMapped}</span> no Xpad ({learnMapped}/16)
          </span>
          <button
            onClick={stopLearn}
            className="text-xs font-mono text-amber-400/60 hover:text-amber-400 ml-1"
          >
            cancelar
          </button>
        </div>
      )}

      {/* MIDI controls */}
      <div className="flex items-center gap-2">
        {midiError && !learnActive && (
          <span className="text-[10px] font-mono text-rose-400 max-w-48 truncate" title={midiError}>
            {midiError}
          </span>
        )}

        {midiConnected ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-300 max-w-36 truncate">
                {midiDeviceName ?? "MIDI"}
              </span>
            </div>
            {!learnActive && (
              <button
                onClick={startLearn}
                className="px-2 py-1.5 rounded-lg text-xs font-mono
                  bg-amber-500/10 border border-amber-500/30 text-amber-400
                  hover:bg-amber-500/20 transition-all"
                title="Mapear pads do Xpad manualmente"
              >
                MIDI Learn
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={enableMidi}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono
              bg-surface-2 border border-white/10 text-white/50
              hover:bg-surface-3 hover:text-white/80 transition-all active:scale-95"
          >
            Connect MIDI
          </button>
        )}
      </div>
    </div>
  );
}
