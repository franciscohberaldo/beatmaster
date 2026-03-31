"use client";

import type { PadId, SampleLoadRequest } from "@/types";

// Synthetic drum definitions — used when no sample is loaded on a pad
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function triggerSynth(Tone: any, padId: PadId) {
  const now = Tone.now();

  switch (padId) {
    case 0: { // Kick
      const synth = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 } }).toDestination();
      synth.triggerAttackRelease("C1", "8n", now);
      setTimeout(() => synth.dispose(), 800);
      break;
    }
    case 1: { // Snare
      const noise = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination();
      noise.volume.value = -6;
      noise.triggerAttackRelease("16n", now);
      setTimeout(() => noise.dispose(), 400);
      break;
    }
    case 2: { // HiHat closed
      const hh = new Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
      hh.volume.value = -10;
      hh.triggerAttackRelease("32n", now);
      setTimeout(() => hh.dispose(), 300);
      break;
    }
    case 3: { // Clap
      const clap = new Tone.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 } }).toDestination();
      clap.volume.value = -4;
      clap.triggerAttackRelease("16n", now);
      // Double clap
      clap.triggerAttackRelease("16n", now + 0.01);
      setTimeout(() => clap.dispose(), 400);
      break;
    }
    case 4: { // Tom 1
      const t1 = new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 4, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
      t1.triggerAttackRelease("G1", "8n", now);
      setTimeout(() => t1.dispose(), 700);
      break;
    }
    case 5: { // Tom 2
      const t2 = new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 4, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
      t2.triggerAttackRelease("D2", "8n", now);
      setTimeout(() => t2.dispose(), 700);
      break;
    }
    case 6: { // Open HH
      const ohh = new Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 0.3, release: 0.1 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
      ohh.volume.value = -10;
      ohh.triggerAttackRelease("8n", now);
      setTimeout(() => ohh.dispose(), 700);
      break;
    }
    case 7: { // Perc 1
      const p1 = new Tone.MembraneSynth({ pitchDecay: 0.02, octaves: 2, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.05 } }).toDestination();
      p1.volume.value = -8;
      p1.triggerAttackRelease("A3", "32n", now);
      setTimeout(() => p1.dispose(), 500);
      break;
    }
    case 8: { // Rim
      const rim = new Tone.MetalSynth({ frequency: 800, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 8, modulationIndex: 40, resonance: 5000, octaves: 0.5 }).toDestination();
      rim.volume.value = -14;
      rim.triggerAttackRelease("32n", now);
      setTimeout(() => rim.dispose(), 300);
      break;
    }
    case 9: { // Cowbell
      const cow = new Tone.MetalSynth({ frequency: 562, envelope: { attack: 0.001, decay: 0.4, release: 0.1 }, harmonicity: 5.1, modulationIndex: 16, resonance: 3000, octaves: 0.5 }).toDestination();
      cow.volume.value = -12;
      cow.triggerAttackRelease("8n", now);
      setTimeout(() => cow.dispose(), 800);
      break;
    }
    case 10: { // Shaker
      const shk = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.02 } }).toDestination();
      shk.volume.value = -18;
      shk.triggerAttackRelease("32n", now);
      setTimeout(() => shk.dispose(), 200);
      break;
    }
    case 11: { // Tamb
      const tmb = new Tone.MetalSynth({ frequency: 600, envelope: { attack: 0.001, decay: 0.12, release: 0.05 }, harmonicity: 3.1, modulationIndex: 20, resonance: 5000, octaves: 1 }).toDestination();
      tmb.volume.value = -14;
      tmb.triggerAttackRelease("16n", now);
      setTimeout(() => tmb.dispose(), 400);
      break;
    }
    case 12: { // Crash
      const crash = new Tone.MetalSynth({ frequency: 300, envelope: { attack: 0.001, decay: 0.8, release: 0.3 }, harmonicity: 5.1, modulationIndex: 32, resonance: 3000, octaves: 2 }).toDestination();
      crash.volume.value = -10;
      crash.triggerAttackRelease("4n", now);
      setTimeout(() => crash.dispose(), 2000);
      break;
    }
    case 13: { // Ride
      const ride = new Tone.MetalSynth({ frequency: 450, envelope: { attack: 0.001, decay: 0.5, release: 0.2 }, harmonicity: 5.1, modulationIndex: 24, resonance: 3500, octaves: 1.5 }).toDestination();
      ride.volume.value = -12;
      ride.triggerAttackRelease("8n", now);
      setTimeout(() => ride.dispose(), 1500);
      break;
    }
    case 14: { // FX 1 — pitch sweep
      const fx1 = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
      fx1.volume.value = -10;
      fx1.triggerAttackRelease("C4", "16n", now);
      setTimeout(() => fx1.dispose(), 600);
      break;
    }
    case 15: { // FX 2 — high blip
      const fx2 = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 } }).toDestination();
      fx2.volume.value = -14;
      fx2.triggerAttackRelease("G5", "32n", now);
      setTimeout(() => fx2.dispose(), 400);
      break;
    }
  }
}

type LoadCallback = (padId: PadId) => void;
type ErrorCallback = (padId: PadId, error: Error) => void;

export interface AudioEngineCallbacks {
  onLoadStart: LoadCallback;
  onLoadEnd: LoadCallback;
  onLoadError: ErrorCallback;
}

class AudioEngine {
  private static instance: AudioEngine | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private players: Map<PadId, any> = new Map(); // Tone.Player instances
  private soloedPads: Set<PadId> = new Set();
  private mutedPads: Set<PadId> = new Set();
  private callbacks: AudioEngineCallbacks | null = null;
  private toneStarted = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Tone: any = null;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  setCallbacks(callbacks: AudioEngineCallbacks) {
    this.callbacks = callbacks;
  }

  private async getTone() {
    if (!this.Tone) {
      this.Tone = await import("tone");
    }
    return this.Tone;
  }

  async ensureStarted() {
    if (this.toneStarted) return;
    const Tone = await this.getTone();
    await Tone.start();
    this.toneStarted = true;
  }

  async loadSample(req: SampleLoadRequest) {
    const Tone = await this.getTone();
    const { padId, url, volume, pitch } = req;

    // Dispose existing player
    const existing = this.players.get(padId);
    if (existing) {
      existing.dispose();
      this.players.delete(padId);
    }

    this.callbacks?.onLoadStart(padId);

    const player = new Tone.Player({
      url,
      onload: () => {
        this.callbacks?.onLoadEnd(padId);
      },
      onerror: (err: Error) => {
        this.callbacks?.onLoadError(padId, err);
      },
    }).toDestination();

    // Set volume (convert 0-1 to dB)
    player.volume.value = Tone.gainToDb(Math.max(0.001, volume));
    // Set pitch via playback rate
    player.playbackRate = Math.pow(2, pitch / 12);

    this.players.set(padId, player);
  }

  async triggerPad(padId: PadId, velocity = 127) {
    await this.ensureStarted();
    void velocity;

    if (this.mutedPads.has(padId)) return;
    if (this.soloedPads.size > 0 && !this.soloedPads.has(padId)) return;

    const Tone = await this.getTone();
    const player = this.players.get(padId);

    if (player && player.loaded) {
      // Use loaded sample
      player.stop();
      player.start(Tone.now());
    } else {
      // No sample — use synthesized fallback
      await triggerSynth(Tone, padId);
    }
  }

  setVolume(padId: PadId, volume: number) {
    const player = this.players.get(padId);
    if (!player) return;
    // Need Tone synchronously — use cached reference
    if (!this.Tone) return;
    player.volume.value = this.Tone.gainToDb(Math.max(0.001, volume));
  }

  setPitch(padId: PadId, semitones: number) {
    const player = this.players.get(padId);
    if (!player) return;
    player.playbackRate = Math.pow(2, semitones / 12);
  }

  setMuted(padId: PadId, muted: boolean) {
    if (muted) {
      this.mutedPads.add(padId);
    } else {
      this.mutedPads.delete(padId);
    }
  }

  setSolo(padId: PadId, solo: boolean) {
    if (solo) {
      this.soloedPads.add(padId);
    } else {
      this.soloedPads.delete(padId);
    }
  }

  unloadSample(padId: PadId) {
    const player = this.players.get(padId);
    if (player) {
      player.dispose();
      this.players.delete(padId);
    }
  }

  dispose() {
    this.players.forEach((p) => p.dispose());
    this.players.clear();
    this.soloedPads.clear();
    this.mutedPads.clear();
    AudioEngine.instance = null;
  }
}

export default AudioEngine;
