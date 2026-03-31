import { create } from "zustand";
import type { PadId } from "@/types";

interface UIStore {
  selectedPadId: PadId | null;
  activePadIds: Set<PadId>;
  isSampleBrowserOpen: boolean;
  sampleBrowserTargetPad: PadId | null;
  isProjectManagerOpen: boolean;
  midiState: {
    isConnected: boolean;
    deviceName: string | null;
    error: string | null;
  };
  midiLearn: {
    isActive: boolean;
    mapped: number; // 0-16, quantos pads já foram mapeados
    lastNote: number | null;
  };

  selectPad: (padId: PadId | null) => void;
  flashPad: (padId: PadId) => void;
  openSampleBrowser: (forPad: PadId) => void;
  closeSampleBrowser: () => void;
  toggleProjectManager: () => void;
  setMidiState: (connected: boolean, deviceName: string | null, error: string | null) => void;
  setMidiLearn: (isActive: boolean) => void;
  updateMidiLearnProgress: (mapped: number, lastNote: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedPadId: null,
  activePadIds: new Set<PadId>(),
  isSampleBrowserOpen: false,
  sampleBrowserTargetPad: null,
  isProjectManagerOpen: false,
  midiState: { isConnected: false, deviceName: null, error: null },
  midiLearn: { isActive: false, mapped: 0, lastNote: null },

  selectPad: (padId) => set({ selectedPadId: padId }),

  flashPad: (padId) => {
    set((state) => {
      const next = new Set(state.activePadIds);
      next.add(padId);
      return { activePadIds: next };
    });
    setTimeout(() => {
      set((state) => {
        const next = new Set(state.activePadIds);
        next.delete(padId);
        return { activePadIds: next };
      });
    }, 120);
  },

  openSampleBrowser: (forPad) =>
    set({ isSampleBrowserOpen: true, sampleBrowserTargetPad: forPad }),

  closeSampleBrowser: () =>
    set({ isSampleBrowserOpen: false, sampleBrowserTargetPad: null }),

  toggleProjectManager: () =>
    set((state) => ({ isProjectManagerOpen: !state.isProjectManagerOpen })),

  setMidiState: (isConnected, deviceName, error) =>
    set({ midiState: { isConnected, deviceName, error } }),

  setMidiLearn: (isActive) =>
    set((s) => ({ midiLearn: { ...s.midiLearn, isActive, mapped: isActive ? 0 : s.midiLearn.mapped } })),

  updateMidiLearnProgress: (mapped, lastNote) =>
    set({ midiLearn: { isActive: mapped < 16, mapped, lastNote } }),
}));
