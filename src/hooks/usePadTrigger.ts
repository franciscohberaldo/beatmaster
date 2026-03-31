"use client";

import { useCallback } from "react";
import AudioEngine from "@/engine/AudioEngine";
import { useUIStore } from "@/store";
import type { PadId } from "@/types";

export function usePadTrigger() {
  const flashPad = useUIStore((s) => s.flashPad);

  const trigger = useCallback(
    (padId: PadId, velocity = 127) => {
      AudioEngine.getInstance().triggerPad(padId, velocity);
      flashPad(padId);
    },
    [flashPad]
  );

  return trigger;
}
