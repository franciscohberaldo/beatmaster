type TriggerFn = (padIndex: number, velocity: number) => void;
type StatusFn = (connected: boolean, deviceName: string | null, error: string | null) => void;
type LearnProgressFn = (mapped: number, note: number, padIndex: number) => void;

class MidiController {
  private static instance: MidiController | null = null;
  private triggerFn: TriggerFn | null = null;
  private statusFn: StatusFn | null = null;
  private learnProgressFn: LearnProgressFn | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private webmidi: any = null;
  private noteMap: Record<number, number> = {};

  // MIDI Learn state
  private isLearning = false;
  private learnedNotes: number[] = []; // notes received in order, one per pad

  private constructor() {}

  static getInstance(): MidiController {
    if (!MidiController.instance) {
      MidiController.instance = new MidiController();
    }
    return MidiController.instance;
  }

  setTriggerFn(fn: TriggerFn) { this.triggerFn = fn; }
  setStatusFn(fn: StatusFn) { this.statusFn = fn; }
  setLearnProgressFn(fn: LearnProgressFn) { this.learnProgressFn = fn; }

  setNoteMap(map: Record<number, number>) {
    this.noteMap = map;
  }

  startLearn() {
    this.isLearning = true;
    this.learnedNotes = [];
    console.log("[MIDI Learn] Iniciado — aperte os 16 pads na ordem: 0→15");
  }

  stopLearn(): Record<number, number> | null {
    this.isLearning = false;
    if (this.learnedNotes.length === 0) return null;

    const newMap: Record<number, number> = {};
    this.learnedNotes.forEach((note, padIndex) => {
      newMap[note] = padIndex;
    });
    this.noteMap = newMap;
    console.log("[MIDI Learn] Mapa salvo:", newMap);
    return newMap;
  }

  async enable() {
    try {
      const { WebMidi } = await import("webmidi");
      this.webmidi = WebMidi;

      await WebMidi.enable({ sysex: false });

      const input = WebMidi.inputs[0];
      if (!input) {
        this.statusFn?.(false, null, "Nenhum dispositivo MIDI. Conecte o AMW Xpad.");
        return;
      }

      this.statusFn?.(true, input.name, null);

      input.addListener("noteon", (e) => {
        const note = e.note.number;
        const rawVel = (e as unknown as { rawVelocity?: number }).rawVelocity ?? e.note.rawAttack ?? 127;

        // MIDI Learn mode: captura notas em ordem
        if (this.isLearning) {
          if (!this.learnedNotes.includes(note) && this.learnedNotes.length < 16) {
            const padIndex = this.learnedNotes.length;
            this.learnedNotes.push(note);
            console.log(`[MIDI Learn] Pad ${padIndex} = nota ${note}`);
            this.learnProgressFn?.(this.learnedNotes.length, note, padIndex);

            if (this.learnedNotes.length === 16) {
              this.stopLearn();
            }
          }
          return;
        }

        // Playback normal
        const padIndex = this.noteMap[note];
        if (padIndex === undefined) {
          console.log(`[MIDI] Nota não mapeada: ${note} — clique em "MIDI Learn" para mapear`);
          return;
        }

        const velocity = rawVel > 1 ? 127 : 0;
        if (velocity > 0) {
          this.triggerFn?.(padIndex, velocity);
        }
      });

      WebMidi.addListener("connected", () => {
        const newInput = WebMidi.inputs[0];
        if (newInput) this.statusFn?.(true, newInput.name, null);
      });

      WebMidi.addListener("disconnected", () => {
        this.statusFn?.(false, null, "MIDI desconectado.");
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "MIDI não disponível";
      this.statusFn?.(false, null, msg);
    }
  }

  disable() {
    if (this.webmidi?.enabled) {
      this.webmidi.disable();
    }
  }
}

export default MidiController;
