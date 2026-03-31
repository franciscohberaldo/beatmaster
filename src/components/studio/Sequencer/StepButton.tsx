"use client";

import { cn } from "@/lib/utils";

interface StepButtonProps {
  active: boolean;
  isCurrentStep: boolean;
  stepIndex: number;
  color: string;
  onClick: () => void;
}

const COLOR_ACTIVE: Record<string, string> = {
  amber:   "bg-amber-500   shadow-amber-500/50",
  cyan:    "bg-cyan-500    shadow-cyan-500/50",
  violet:  "bg-violet-500  shadow-violet-500/50",
  emerald: "bg-emerald-500 shadow-emerald-500/50",
  rose:    "bg-rose-500    shadow-rose-500/50",
  sky:     "bg-sky-500     shadow-sky-500/50",
  orange:  "bg-orange-500  shadow-orange-500/50",
  lime:    "bg-lime-500    shadow-lime-500/50",
};

export function StepButton({ active, isCurrentStep, color, onClick }: StepButtonProps) {
  const activeColor = COLOR_ACTIVE[color] ?? COLOR_ACTIVE.amber;

  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 rounded transition-all duration-75 border",
        active
          ? cn("shadow-sm", activeColor, "border-transparent")
          : "bg-surface-2 border-white/10 hover:bg-white/10",
        isCurrentStep && "ring-1 ring-white/60 ring-offset-1 ring-offset-surface",
      )}
    />
  );
}
