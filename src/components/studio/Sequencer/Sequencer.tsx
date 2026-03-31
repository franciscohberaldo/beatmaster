"use client";

import { useProjectStore, useTransportStore, useUIStore } from "@/store";
import { StepButton } from "./StepButton";
import type { PadId } from "@/types";
import SequencerEngine from "@/engine/SequencerEngine";

export function Sequencer() {
  const selectedPadId = useUIStore((s) => s.selectedPadId);
  const currentStep = useTransportStore((s) => s.currentStep);
  const toggleStep = useProjectStore((s) => s.toggleStep);
  const isPlaying = useTransportStore((s) => s.isPlaying);

  const pad = useProjectStore((s) =>
    selectedPadId !== null ? s.currentProject?.pads[selectedPadId] : null
  );
  const pattern = useProjectStore((s) =>
    selectedPadId !== null ? s.currentProject?.patterns[selectedPadId] : null
  );

  if (selectedPadId === null || !pattern || !pad) {
    return (
      <div className="flex items-center justify-center h-16 text-white/30 text-sm font-mono">
        Select a pad to edit its pattern
      </div>
    );
  }

  const handleToggle = (stepIndex: number) => {
    toggleStep(selectedPadId as PadId, stepIndex);
    // Sync to engine immediately
    const newSteps = [...pattern.steps] as typeof pattern.steps;
    newSteps[stepIndex] = !newSteps[stepIndex];
    SequencerEngine.getInstance().setPattern(selectedPadId as PadId, newSteps);
  };

  return (
    <div className="space-y-2">
      {/* Pad label */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-white/50">PATTERN —</span>
        <span className="text-xs font-mono font-semibold text-white/80">{pad.name}</span>
        {pad.sampleName && (
          <span className="text-xs font-mono text-white/40">{pad.sampleName}</span>
        )}
      </div>

      {/* Step grid */}
      <div className="grid grid-cols-16 gap-1" style={{ gridTemplateColumns: "repeat(16, 1fr)" }}>
        {pattern.steps.map((active, i) => (
          <StepButton
            key={i}
            stepIndex={i}
            active={active}
            isCurrentStep={isPlaying && currentStep === i}
            color={pad.color}
            onClick={() => handleToggle(i)}
          />
        ))}
      </div>

      {/* Beat markers */}
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(16, 1fr)" }}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="text-center">
            {i % 4 === 0 && (
              <span className="text-[9px] text-white/20 font-mono">{i / 4 + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
