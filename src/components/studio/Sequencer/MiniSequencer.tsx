"use client";

import { useProjectStore, useTransportStore } from "@/store";
import { cn } from "@/lib/utils";
import type { PadId } from "@/types";

const COLOR_DOT: Record<string, string> = {
  amber: "bg-amber-500", cyan: "bg-cyan-500", violet: "bg-violet-500",
  emerald: "bg-emerald-500", rose: "bg-rose-500", sky: "bg-sky-500",
  orange: "bg-orange-500", lime: "bg-lime-500",
};

const VISIBLE_PADS: PadId[] = [0, 1, 2, 3, 4, 5, 6, 7];

export function MiniSequencer() {
  const currentStep = useTransportStore((s) => s.currentStep);
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const project = useProjectStore((s) => s.currentProject);

  if (!project) return null;

  return (
    <div className="space-y-0.5">
      {VISIBLE_PADS.map((padId) => {
        const pad = project.pads[padId];
        const pattern = project.patterns[padId];
        if (!pad || !pattern) return null;
        const dotColor = COLOR_DOT[pad.color] ?? "bg-white";

        return (
          <div key={padId} className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-white/30 w-10 truncate">{pad.name}</span>
            <div className="flex gap-px">
              {pattern.steps.map((on, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-sm transition-all duration-75",
                    on ? dotColor : "bg-white/5",
                    isPlaying && currentStep === i && "ring-1 ring-white/50",
                  )}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
