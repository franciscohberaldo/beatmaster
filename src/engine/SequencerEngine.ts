"use client";

import type { PadId, StepPattern } from "@/types";
import AudioEngine from "./AudioEngine";

type StepCallback = (step: number) => void;

class SequencerEngine {
  private static instance: SequencerEngine | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sequence: any = null;
  private patterns: StepPattern[] = Array(16).fill(null).map(() => Array(16).fill(false) as StepPattern);
  private onStepCallback: StepCallback | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Tone: any = null;

  private constructor() {}

  static getInstance(): SequencerEngine {
    if (!SequencerEngine.instance) {
      SequencerEngine.instance = new SequencerEngine();
    }
    return SequencerEngine.instance;
  }

  private async getTone() {
    if (!this.Tone) {
      this.Tone = await import("tone");
    }
    return this.Tone;
  }

  setPattern(padId: PadId, pattern: StepPattern) {
    this.patterns[padId] = [...pattern] as StepPattern;
  }

  setOnStep(cb: StepCallback) {
    this.onStepCallback = cb;
  }

  async setBpm(bpm: number) {
    const Tone = await this.getTone();
    Tone.getTransport().bpm.value = bpm;
  }

  async play() {
    const Tone = await this.getTone();
    const audioEngine = AudioEngine.getInstance();

    if (this.sequence) {
      this.sequence.dispose();
    }

    let step = 0;
    this.sequence = new Tone.Sequence(
      (time: number) => {
        const currentStep = step % 16;

        // Fire pads whose step is active
        for (let padId = 0; padId < 16; padId++) {
          if (this.patterns[padId]?.[currentStep]) {
            audioEngine.triggerPad(padId as PadId);
          }
        }

        // Update UI on next frame (not in audio callback)
        const stepSnapshot = currentStep;
        Tone.getDraw().schedule(() => {
          this.onStepCallback?.(stepSnapshot);
        }, time);

        step++;
      },
      Array.from({ length: 16 }, (_, i) => i),
      "16n"
    );

    this.sequence.start(0);
    Tone.getTransport().start();
  }

  async stop() {
    const Tone = await this.getTone();
    Tone.getTransport().stop();
    if (this.sequence) {
      this.sequence.dispose();
      this.sequence = null;
    }
    this.onStepCallback?.(-1);
  }

  dispose() {
    if (this.sequence) {
      this.sequence.dispose();
      this.sequence = null;
    }
    SequencerEngine.instance = null;
  }
}

export default SequencerEngine;
