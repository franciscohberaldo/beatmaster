import { create } from "zustand";

interface TransportStore {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;

  setBpm: (bpm: number) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
}

export const useTransportStore = create<TransportStore>((set) => ({
  bpm: 120,
  isPlaying: false,
  currentStep: -1,

  setBpm: (bpm) => set({ bpm }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));
