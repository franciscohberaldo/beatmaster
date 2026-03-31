"use client";

import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useProjectStore } from "@/store";
import { useEffect } from "react";

export function AudioEngineProvider({ children }: { children: React.ReactNode }) {
  const engine = useAudioEngine();
  useKeyboardShortcuts();
  // MIDI is enabled manually via the Connect MIDI button in Transport

  const pads = useProjectStore((s) => s.currentProject?.pads ?? null);

  // Sync pad settings to audio engine when project loads or pads change
  useEffect(() => {
    if (!pads) return;
    pads.forEach((pad) => {
      engine.setVolume(pad.id, pad.volume);
      engine.setPitch(pad.id, pad.pitch);
      engine.setMuted(pad.id, pad.isMuted);
      engine.setSolo(pad.id, pad.isSolo);
    });
  }, [pads, engine]);

  return <>{children}</>;
}
