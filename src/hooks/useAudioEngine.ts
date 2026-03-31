"use client";

import { useEffect, useRef } from "react";
import AudioEngine from "@/engine/AudioEngine";
import { useProjectStore } from "@/store";
import type { PadId } from "@/types";

export function useAudioEngine() {
  const engine = AudioEngine.getInstance();
  const initialized = useRef(false);
  const updatePad = useProjectStore((s) => s.updatePad);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    engine.setCallbacks({
      onLoadStart: (padId: PadId) => updatePad(padId, { isLoading: true }),
      onLoadEnd: (padId: PadId) => updatePad(padId, { isLoading: false }),
      onLoadError: (padId: PadId, _err: Error) => updatePad(padId, { isLoading: false }),
    });
  }, [engine, updatePad]);

  return engine;
}
