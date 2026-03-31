"use client";

import { useCallback } from "react";
import { useProjectStore, useUIStore } from "@/store";
import { usePadTrigger } from "@/hooks/usePadTrigger";
import { cn } from "@/lib/utils";
import type { PadId } from "@/types";

const COLOR_MAP: Record<string, string> = {
  amber:   "bg-amber-500/20   border-amber-500/40   data-[active=true]:bg-amber-500/70   data-[selected=true]:border-amber-400",
  cyan:    "bg-cyan-500/20    border-cyan-500/40    data-[active=true]:bg-cyan-500/70    data-[selected=true]:border-cyan-400",
  violet:  "bg-violet-500/20  border-violet-500/40  data-[active=true]:bg-violet-500/70  data-[selected=true]:border-violet-400",
  emerald: "bg-emerald-500/20 border-emerald-500/40 data-[active=true]:bg-emerald-500/70 data-[selected=true]:border-emerald-400",
  rose:    "bg-rose-500/20    border-rose-500/40    data-[active=true]:bg-rose-500/70    data-[selected=true]:border-rose-400",
  sky:     "bg-sky-500/20     border-sky-500/40     data-[active=true]:bg-sky-500/70     data-[selected=true]:border-sky-400",
  orange:  "bg-orange-500/20  border-orange-500/40  data-[active=true]:bg-orange-500/70  data-[selected=true]:border-orange-400",
  lime:    "bg-lime-500/20    border-lime-500/40    data-[active=true]:bg-lime-500/70    data-[selected=true]:border-lime-400",
};

interface PadProps {
  padId: PadId;
  onContextMenu?: (padId: PadId, e: React.MouseEvent) => void;
}

export function Pad({ padId, onContextMenu }: PadProps) {
  const pad = useProjectStore((s) => s.currentProject?.pads[padId]);
  const isSelected = useUIStore((s) => s.selectedPadId === padId);
  const isActive = useUIStore((s) => s.activePadIds.has(padId));
  const selectPad = useUIStore((s) => s.selectPad);
  const openSampleBrowser = useUIStore((s) => s.openSampleBrowser);
  const trigger = usePadTrigger();

  const handleClick = useCallback(() => {
    selectPad(padId);
    trigger(padId);
  }, [padId, selectPad, trigger]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      selectPad(padId);
      onContextMenu?.(padId, e);
    },
    [padId, selectPad, onContextMenu]
  );

  const handleDoubleClick = useCallback(() => {
    openSampleBrowser(padId);
  }, [padId, openSampleBrowser]);

  if (!pad) return null;

  const colorClass = COLOR_MAP[pad.color] ?? COLOR_MAP.amber;

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      data-active={isActive}
      data-selected={isSelected}
      className={cn(
        "relative flex flex-col items-start justify-end p-2 rounded-lg border-2",
        "transition-all duration-75 select-none cursor-pointer",
        "hover:brightness-125 active:scale-95",
        colorClass,
        pad.isMuted && "opacity-40",
      )}
      style={{ aspectRatio: "1" }}
      title={`${pad.name}${pad.sampleName ? ` — ${pad.sampleName}` : ""}\nDouble-click to load sample`}
    >
      {/* Solo indicator */}
      {pad.isSolo && (
        <span className="absolute top-1 right-1 text-[9px] font-bold text-yellow-300 bg-yellow-900/60 rounded px-1">
          S
        </span>
      )}

      {/* Loading spinner */}
      {pad.isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}

      {/* No sample indicator */}
      {!pad.sampleUrl && !pad.isLoading && (
        <span className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.5a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5a.5.5 0 0 1 .5-.5z"/>
          </svg>
        </span>
      )}

      {/* Pad name */}
      <span className="text-[10px] font-mono font-semibold text-white/70 leading-tight truncate w-full">
        {pad.name}
      </span>

      {/* Sample name */}
      {pad.sampleName && (
        <span className="text-[9px] font-mono text-white/40 leading-tight truncate w-full">
          {pad.sampleName}
        </span>
      )}
    </button>
  );
}
