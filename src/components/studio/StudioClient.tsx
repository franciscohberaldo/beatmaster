"use client";

import { useEffect } from "react";
import { PadGrid } from "./PadGrid/PadGrid";
import { Transport } from "./Transport/Transport";
import { PadInspector } from "./PadInspector/PadInspector";
import { SampleBrowser } from "./SampleBrowser/SampleBrowser";
import { Library } from "./Library/Library";
import { WaveformDisplay } from "./WaveformDisplay";
import { PatternEditor } from "./Sequencer/PatternEditor";
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
        {/* Top navbar with Transport */}
        <Transport />

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Library */}
          <div className="flex-shrink-0 w-40 border-r border-white/5">
            <Library />
          </div>

          {/* Pad grid */}
          <div className="flex-shrink-0 w-52 border-r border-white/5">
            <PadGrid />
          </div>

          {/* Center: Waveform + Pattern Editor */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <WaveformDisplay />
            <div className="flex-1 overflow-hidden">
              <PatternEditor />
            </div>
          </div>

          {/* Right: Pad inspector */}
          <div className="flex-shrink-0 w-44 border-l border-white/5">
            <PadInspector />
          </div>
        </div>

        <SampleBrowser />
      </div>
    </AudioEngineProvider>
  );
}
