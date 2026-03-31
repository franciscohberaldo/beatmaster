"use client";

import { useState, useCallback } from "react";
import { Pad } from "./Pad";
import { useUIStore } from "@/store";
import type { PadId } from "@/types";

// Layout: visual grid matches hardware (row 3 = top, row 0 = bottom)
// Row 3: pads 12,13,14,15
// Row 2: pads 8,9,10,11
// Row 1: pads 4,5,6,7
// Row 0: pads 0,1,2,3
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
    <div className="relative" onClick={closeMenu}>
      <div className="grid grid-rows-4 gap-2">
        {GRID_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-4 gap-2">
            {row.map((padId) => (
              <Pad key={padId} padId={padId} onContextMenu={handleContextMenu} />
            ))}
          </div>
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-surface-2 border border-white/10 rounded-lg shadow-xl py-1 min-w-40"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            onClick={() => { openSampleBrowser(contextMenu.padId); closeMenu(); }}
          >
            Load Sample…
          </button>
        </div>
      )}
    </div>
  );
}
