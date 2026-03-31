"use client";

import { useCallback } from "react";
import { useProjectStore, useUIStore } from "@/store";
import { usePadTrigger } from "@/hooks/usePadTrigger";
import { cn } from "@/lib/utils";
import type { PadId } from "@/types";

const CIRCLE_COLOR: Record<string, string> = {
  amber:   "bg-amber-400",
  cyan:    "bg-cyan-400",
  violet:  "bg-violet-500",
  emerald: "bg-emerald-500",
  rose:    "bg-rose-500",
  sky:     "bg-sky-400",
  orange:  "bg-orange-500",
  lime:    "bg-lime-400",
};

const ACTIVE_SHADOW: Record<string, string> = {
  amber:   "shadow-amber-500/70",
  cyan:    "shadow-cyan-500/70",
  violet:  "shadow-violet-500/70",
  emerald: "shadow-emerald-500/70",
  rose:    "shadow-rose-500/70",
  sky:     "shadow-sky-500/70",
  orange:  "shadow-orange-500/70",
  lime:    "shadow-lime-500/70",
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

  const circleColor = CIRCLE_COLOR[pad.color] ?? CIRCLE_COLOR.amber;
  const shadowColor = ACTIVE_SHADOW[pad.color] ?? ACTIVE_SHADOW.amber;

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      style={{ aspectRatio: "1" }}
      title={`${pad.name}${pad.sampleName ? ` — ${pad.sampleName}` : ""}\nDouble-click: load sample`}
      className={cn(
        "relative flex flex-col items-center justify-between py-2 px-1 rounded-lg",
        "transition-all duration-75 select-none cursor-pointer",
        "border",
        isSelected
          ? "bg-surface-3 border-white/25"
          : "bg-surface-2 border-white/[0.06] hover:border-white/15 hover:bg-surface-3",
        isActive && "brightness-130",
        pad.isMuted && "opacity-35",
      )}
    >
      {/* Colored circle */}
      <div
        className={cn(
          "rounded-full transition-all duration-75",
          circleColor,
          isActive ? cn("w-4 h-4 shadow-lg", shadowColor) : "w-3.5 h-3.5",
        )}
      />

      {/* Pad name */}
      <span className="text-[9px] font-mono font-medium text-white/55 leading-none truncate w-full text-center">
        {pad.name}
      </span>

      {/* Pad number */}
      <span className="text-[8px] font-mono text-white/20 leading-none">
        {padId + 1}
      </span>

      {/* Solo badge */}
      {pad.isSolo && (
        <span className="absolute top-0.5 right-0.5 text-[7px] font-bold text-yellow-300 leading-none">S</span>
      )}

      {/* Loading spinner */}
      {pad.isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}
