// ── Core domain types ──────────────────────────────────────────────────────

export type PadId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type PadColor =
  | "amber"
  | "cyan"
  | "violet"
  | "emerald"
  | "rose"
  | "sky"
  | "orange"
  | "lime";

export interface PadConfig {
  id: PadId;
  name: string;
  sampleUrl: string | null;
  sampleName: string | null;
  volume: number; // 0-1
  pitch: number; // semitones, -24 to +24
  isMuted: boolean;
  isSolo: boolean;
  isLoading: boolean;
  color: PadColor;
}

// 16 booleans: step[n] = true means pad fires on step n
export type StepPattern = [
  boolean, boolean, boolean, boolean,
  boolean, boolean, boolean, boolean,
  boolean, boolean, boolean, boolean,
  boolean, boolean, boolean, boolean,
];

export interface SequencerPattern {
  padId: PadId;
  steps: StepPattern;
  velocity: number[]; // per-step velocity 0-127
}

// ── Project ────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  userId: string;
  name: string;
  bpm: number;
  pads: PadConfig[];
  patterns: SequencerPattern[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  bpm: number;
  updatedAt: string;
}

// ── Supabase DB row types ──────────────────────────────────────────────────

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  bpm: number;
  pad_configs: PadConfig[];
  sequencer_patterns: SequencerPattern[];
  created_at: string;
  updated_at: string;
}

export interface DbSample {
  id: string;
  user_id: string;
  name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

// ── MIDI ───────────────────────────────────────────────────────────────────

export interface MidiState {
  isEnabled: boolean;
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
}

export type MidiNoteMap = Record<number, PadId>;

// ── Audio Engine ───────────────────────────────────────────────────────────

export interface SampleLoadRequest {
  padId: PadId;
  url: string;
  volume: number;
  pitch: number;
}
