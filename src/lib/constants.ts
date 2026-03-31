import type { MidiNoteMap, PadColor, PadConfig, StepPattern, SequencerPattern } from "@/types";

export const PAD_COUNT = 16;
export const DEFAULT_BPM = 120;
export const MIN_BPM = 60;
export const MAX_BPM = 200;
export const STEP_COUNT = 16;

// AMW Xpad MIDI note mapping
// Pad layout (visual, matches hardware — bottom-left = 0, top-right = 15):
//   12  13  14  15   (top row)
//    8   9  10  11
//    4   5   6   7
//    0   1   2   3   (bottom row)
export const MIDI_NOTE_MAP: MidiNoteMap = {
  36: 0,  37: 1,  38: 2,  39: 3,
  40: 4,  41: 5,  42: 6,  43: 7,
  44: 8,  45: 9,  46: 10, 47: 11,
  48: 12, 49: 13, 50: 14, 51: 15,
};

// Keyboard shortcuts: keys map to pad indices
// Layout mirrors the pad grid (bottom-left to top-right)
export const KEYBOARD_MAP: Record<string, number> = {
  // Bottom row: pads 0-3
  z: 0, x: 1, c: 2, v: 3,
  // Row 2: pads 4-7
  a: 4, s: 5, d: 6, f: 7,
  // Row 3: pads 8-11
  q: 8, w: 9, e: 10, r: 11,
  // Top row: pads 12-15
  "1": 12, "2": 13, "3": 14, "4": 15,
};

export const PAD_COLORS: PadColor[] = [
  "amber", "cyan", "violet", "emerald",
  "rose",  "sky",  "orange", "lime",
  "amber", "cyan", "violet", "emerald",
  "rose",  "sky",  "orange", "lime",
];

export const PAD_NAMES = [
  "Kick",  "Snare", "HiHat", "Clap",
  "Tom 1", "Tom 2", "Open HH", "Perc 1",
  "Rim",   "Cowbell", "Shaker", "Tamb",
  "Crash", "Ride",  "FX 1",  "FX 2",
];

export function createDefaultPad(id: number): PadConfig {
  return {
    id: id as PadConfig["id"],
    name: PAD_NAMES[id],
    sampleUrl: null,
    sampleName: null,
    volume: 0.8,
    pitch: 0,
    isMuted: false,
    isSolo: false,
    isLoading: false,
    color: PAD_COLORS[id],
  };
}

export function createEmptyPattern(padId: number): SequencerPattern {
  return {
    padId: padId as SequencerPattern["padId"],
    steps: Array(16).fill(false) as StepPattern,
    velocity: Array(16).fill(100),
  };
}

export function createDefaultPads(): PadConfig[] {
  return Array.from({ length: PAD_COUNT }, (_, i) => createDefaultPad(i));
}

export function createDefaultPatterns(): SequencerPattern[] {
  return Array.from({ length: PAD_COUNT }, (_, i) => createEmptyPattern(i));
}
