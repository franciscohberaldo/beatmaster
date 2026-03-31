"use client";

import { useProjectStore, useTransportStore } from "@/store";
import { cn } from "@/lib/utils";
import type { PadId } from "@/types";
import SequencerEngine from "@/engine/SequencerEngine";

const STEP_ACTIVE: Record<string, string> = {
  amber:   "bg-amber-500/70 hover:bg-amber-500",
  cyan:    "bg-cyan-500/70  hover:bg-cyan-500",
  violet:  "bg-violet-500/70 hover:bg-violet-500",
  emerald: "bg-emerald-500/70 hover:bg-emerald-500",
  rose:    "bg-rose-500/70  hover:bg-rose-500",
  sky:     "bg-sky-500/70   hover:bg-sky-500",
  orange:  "bg-orange-500/70 hover:bg-orange-500",
  lime:    "bg-lime-500/70  hover:bg-lime-500",
};

const ALL_PADS: PadId[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export function PatternEditor() {
  const project = useProjectStore((s) => s.currentProject);
  const toggleStep = useProjectStore((s) => s.toggleStep);
  const currentStep = useTransportStore((s) => s.currentStep);
  const isPlaying = useTransportStore((s) => s.isPlaying);

  if (!project) return null;

  const handleToggle = (padId: PadId, stepIndex: number) => {
    toggleStep(padId, stepIndex);
    const newSteps = [...project.patterns[padId].steps] as typeof project.patterns[0]["steps"];
    newSteps[stepIndex] = !newSteps[stepIndex];
    SequencerEngine.getInstance().setPattern(padId, newSteps);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-500 rounded-full" />
          <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Pattern Editor</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono bg-surface-2 px-1.5 py-0.5 rounded text-white/50 border border-white/10">A</span>
          <button className="text-white/20 hover:text-white/50 text-xs px-0.5 transition-colors">◄</button>
          <button className="text-white/20 hover:text-white/50 text-xs px-0.5 transition-colors">►</button>
        </div>
      </div>

      {/* Beat numbers */}
      <div className="flex items-center flex-shrink-0 border-b border-white/[0.04]">
        <div className="w-16 flex-shrink-0" />
        <div className="flex flex-1 pr-4 py-1">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 text-center",
                isPlaying && currentStep === i && "bg-white/5 rounded",
              )}
            >
              {i % 2 === 0 && (
                <span className="text-[9px] font-mono text-white/25">{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pad rows */}
      <div className="flex-1 overflow-y-auto">
        {ALL_PADS.map((padId) => {
          const pad = project.pads[padId];
          const pattern = project.patterns[padId];
          if (!pad || !pattern) return null;
          const activeClass = STEP_ACTIVE[pad.color] ?? STEP_ACTIVE.amber;

          return (
            <div
              key={padId}
              className="flex items-center hover:bg-white/[0.015] transition-colors border-b border-white/[0.04]"
            >
              <span className="w-16 px-3 text-[10px] font-mono text-white/35 truncate flex-shrink-0">
                {pad.name}
              </span>
              <div className="flex flex-1 gap-px pr-4 py-1">
                {pattern.steps.map((active, step) => {
                  const isCurrent = isPlaying && currentStep === step;
                  return (
                    <button
                      key={step}
                      onClick={() => handleToggle(padId, step)}
                      className={cn(
                        "flex-1 h-5 rounded-sm transition-all duration-75",
                        active
                          ? activeClass
                          : cn(
                              "hover:bg-white/10",
                              step % 4 === 0 ? "bg-white/[0.06]" : "bg-white/[0.03]",
                            ),
                        isCurrent && "ring-1 ring-white/40 ring-inset",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
