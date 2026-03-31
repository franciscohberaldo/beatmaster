"use client";

import { useCallback } from "react";
import SequencerEngine from "@/engine/SequencerEngine";
import { useProjectStore, useTransportStore } from "@/store";

export function useTransport() {
  const { bpm, isPlaying, setBpm, setPlaying, setCurrentStep } = useTransportStore();
  const patterns = useProjectStore((s) => s.currentProject?.patterns ?? []);

  const play = useCallback(async () => {
    const engine = SequencerEngine.getInstance();

    // Sync all patterns to engine
    patterns.forEach((pattern) => {
      engine.setPattern(pattern.padId, pattern.steps);
    });

    engine.setOnStep(setCurrentStep);
    await engine.setBpm(bpm);
    await engine.play();
    setPlaying(true);
  }, [bpm, patterns, setPlaying, setCurrentStep]);

  const stop = useCallback(async () => {
    await SequencerEngine.getInstance().stop();
    setPlaying(false);
  }, [setPlaying]);

  const updateBpm = useCallback(
    async (newBpm: number) => {
      setBpm(newBpm);
      await SequencerEngine.getInstance().setBpm(newBpm);
    },
    [setBpm]
  );

  return { bpm, isPlaying, play, stop, updateBpm };
}
