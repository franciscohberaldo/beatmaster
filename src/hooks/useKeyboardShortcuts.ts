"use client";

import { useEffect } from "react";
import KeyboardController from "@/engine/KeyboardController";
import { usePadTrigger } from "./usePadTrigger";
import type { PadId } from "@/types";

export function useKeyboardShortcuts() {
  const trigger = usePadTrigger();

  useEffect(() => {
    const ctrl = KeyboardController.getInstance();
    ctrl.setTriggerFn((padIndex) => trigger(padIndex as PadId));
    ctrl.start();
    return () => ctrl.stop();
  }, [trigger]);
}
