"use client";

import { useCallback } from "react";
import MidiController from "@/engine/MidiController";
import { MIDI_NOTE_MAP } from "@/lib/constants";
import { useUIStore } from "@/store";
import { usePadTrigger } from "./usePadTrigger";
import type { PadId } from "@/types";

export function useMidi() {
  const trigger = usePadTrigger();
  const setMidiState = useUIStore((s) => s.setMidiState);
  const setMidiLearn = useUIStore((s) => s.setMidiLearn);
  const updateMidiLearnProgress = useUIStore((s) => s.updateMidiLearnProgress);

  const enableMidi = useCallback(() => {
    const ctrl = MidiController.getInstance();
    ctrl.setNoteMap(MIDI_NOTE_MAP);
    ctrl.setTriggerFn((padIndex, velocity) => trigger(padIndex as PadId, velocity));
    ctrl.setStatusFn((connected, deviceName, error) =>
      setMidiState(connected, deviceName, error)
    );
    ctrl.setLearnProgressFn((mapped, note, padIndex) => {
      updateMidiLearnProgress(mapped, note);
      // Também dispara o som do pad durante o learn
      trigger(padIndex as PadId);
    });
    ctrl.enable();
  }, [trigger, setMidiState, updateMidiLearnProgress]);

  const startLearn = useCallback(() => {
    setMidiLearn(true);
    MidiController.getInstance().startLearn();
  }, [setMidiLearn]);

  const stopLearn = useCallback(() => {
    MidiController.getInstance().stopLearn();
    setMidiLearn(false);
  }, [setMidiLearn]);

  return { enableMidi, startLearn, stopLearn };
}
