"use client";

import { useEffect } from "react";
import { PadGrid } from "./PadGrid/PadGrid";
import { Sequencer } from "./Sequencer/Sequencer";
import { MiniSequencer } from "./Sequencer/MiniSequencer";
import { Transport } from "./Transport/Transport";
import { PadInspector } from "./PadInspector/PadInspector";
import { SampleBrowser } from "./SampleBrowser/SampleBrowser";
import { ProjectManager } from "./ProjectManager/ProjectManager";
import { Library } from "./Library/Library";
import { AudioEngineProvider } from "@/components/providers/AudioEngineProvider";
import { useProjectStore } from "@/store";

export function StudioClient() {
  const initNewProject = useProjectStore((s) => s.initNewProject);

  useEffect(() => {
    initNewProject();
  }, [initNewProject]);

  return (
    <AudioEngineProvider>
      <div className="flex flex-col h-screen bg-surface text-white overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-1 border-b border-white/5">
          <span className="font-mono font-bold text-sm text-white/80 tracking-widest">BEATMAKER</span>
          <div className="w-px h-4 bg-white/10" />
          <ProjectManager />
          <div className="flex-1" />
          <span className="text-[10px] font-mono text-white/20">
            Press Z/X/C/V A/S/D/F Q/W/E/R 1/2/3/4 to trigger pads
          </span>
        </div>

        {/* Transport */}
        <Transport />

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Far left: Library */}
          <div className="flex-shrink-0 w-48">
            <Library />
          </div>

          {/* Pad grid */}
          <div className="flex-shrink-0 w-72 p-4 border-r border-white/5 border-l">
            <PadGrid />
          </div>

          {/* Center: Sequencer + mini overview */}
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            {/* Full sequencer for selected pad */}
            <div className="bg-surface-1 rounded-xl p-4 border border-white/5">
              <Sequencer />
            </div>

            {/* Mini overview of all pads */}
            <div className="bg-surface-1 rounded-xl p-4 border border-white/5 flex-1 overflow-auto">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-3">
                Pattern Overview
              </div>
              <MiniSequencer />
            </div>
          </div>

          {/* Right: Pad inspector */}
          <div className="flex-shrink-0 w-52 border-l border-white/5 overflow-y-auto">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider px-3 pt-3 pb-1">
              Pad Settings
            </div>
            <PadInspector />
          </div>
        </div>

        {/* Sample browser modal */}
        <SampleBrowser />
      </div>
    </AudioEngineProvider>
  );
}
