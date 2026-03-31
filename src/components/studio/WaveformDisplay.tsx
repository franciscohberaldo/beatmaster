"use client";

import { useState } from "react";
import { useUIStore, useProjectStore } from "@/store";

type Tab = "SAMPLE" | "LFO" | "ENV" | "FX";

export function WaveformDisplay() {
  const [tab, setTab] = useState<Tab>("SAMPLE");
  const selectedPadId = useUIStore((s) => s.selectedPadId);
  const pad = useProjectStore((s) =>
    selectedPadId !== null ? s.currentProject?.pads[selectedPadId] : null
  );

  return (
    <div className="flex flex-col border-b border-white/5 flex-shrink-0" style={{ height: 130 }}>
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-4 py-1.5 flex-shrink-0">
        <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Waveform</span>
        <div className="flex items-center gap-4">
          {(["SAMPLE", "LFO", "ENV", "FX"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] font-mono font-semibold transition-colors ${
                tab === t ? "text-white" : "text-white/25 hover:text-white/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Waveform area */}
      <div className="flex-1 relative overflow-hidden bg-[#0d1017]">
        {/* Vertical grid lines */}
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute top-0 bottom-0 border-l border-white/[0.04]"
            style={{ left: `${pct}%` }}
          />
        ))}

        {/* Center line */}
        <div className="absolute left-0 right-0 border-t border-white/[0.06]" style={{ top: "50%" }} />

        {tab === "SAMPLE" && (
          <>
            <svg
              viewBox="0 0 800 80"
              className="w-full h-full"
              preserveAspectRatio="none"
              style={{ display: "block" }}
            >
              {pad?.sampleUrl ? (
                <path
                  d="M0,40 C15,15 30,65 60,35 C90,10 120,62 160,40 C200,20 230,58 270,38 C310,18 340,62 380,40 C420,22 450,58 490,36 C530,16 560,64 600,40 C640,18 680,60 720,38 C750,22 775,52 800,40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              ) : (
                <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              )}
            </svg>
            {!pad?.sampleUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono text-white/15">
                  {selectedPadId !== null ? "Nenhum sample carregado" : "Selecione um pad"}
                </span>
              </div>
            )}
          </>
        )}

        {tab !== "SAMPLE" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono text-white/15">{tab} — em breve</span>
          </div>
        )}
      </div>
    </div>
  );
}
