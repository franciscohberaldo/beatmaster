import { KEYBOARD_MAP } from "@/lib/constants";

type TriggerFn = (padIndex: number) => void;

class KeyboardController {
  private static instance: KeyboardController | null = null;
  private triggerFn: TriggerFn | null = null;
  private bound = false;

  private constructor() {}

  static getInstance(): KeyboardController {
    if (!KeyboardController.instance) {
      KeyboardController.instance = new KeyboardController();
    }
    return KeyboardController.instance;
  }

  setTriggerFn(fn: TriggerFn) {
    this.triggerFn = fn;
  }

  start() {
    if (this.bound) return;
    window.addEventListener("keydown", this.handleKeyDown);
    this.bound = true;
  }

  stop() {
    window.removeEventListener("keydown", this.handleKeyDown);
    this.bound = false;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Skip if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.repeat) return;

    const padIndex = KEYBOARD_MAP[e.key.toLowerCase()];
    if (padIndex !== undefined) {
      this.triggerFn?.(padIndex);
    }
  };
}

export default KeyboardController;
