"use client";

import { useState, useCallback } from "react";
import { Pad } from "./Pad";
import { useUIStore } from "@/store";
import type { PadId } from "@/types";

const GRID_ROWS: PadId[][] = [
  [12, 13, 14, 15],
  [8, 9, 10, 11],
  [4, 5, 6, 7],
  [0, 1, 2, 3],
];

interface ContextMenu {
  padId: PadId;
  x: number;
  y: number;
}

export function PadGrid() {
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const openSampleBrowser = useUIStore((s) => s.openSampleBrowser);

  const handleContextMenu = useCallback((padId: PadId, e: React.MouseEvent) => {
    setContextMenu({ padId, x: e.clientX, y: e.clientY });
  }, []);

  const closeMenu = useCallback(() => setContextMenu(null), []);

  return (
    <div className="flex flex-col h-full">
      {/* PADS header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 flex-shrink-0">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Pads</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono bg-surface-2 px-1.5 py-0.5 rounded text-white/50 border border-white/10">
            A
          </span>
          <button className="text-white/20 hover:text-white/50 text-xs px-0.5 transition-colors">◄</button>
          <button className="text-white/20 hover:text-white/50 text-xs px-0.5 transition-colors">►</button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-3 flex flex-col justify-center" onClick={closeMenu}>
        <div className="relative grid grid-rows-4 gap-1.5">
          {GRID_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-4 gap-1.5">
              {row.map((padId) => (
                <Pad key={padId} padId={padId} onContextMenu={handleContextMenu} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-surface-2 border border-white/10 rounded-lg shadow-xl py-1 min-w-40"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={closeMenu}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors font-mono"
            onClick={() => { openSampleBrowser(contextMenu.padId); closeMenu(); }}
          >
            Load Sample…
          </button>
        </div>
      )}
    </div>
  );
}
