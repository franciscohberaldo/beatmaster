"use client";

import { useCallback, useEffect, useState } from "react";
import { useUIStore, useProjectStore } from "@/store";
import { useProject } from "@/hooks/useProject";
import type { ProjectSummary } from "@/types";

export function ProjectManager() {
  const isOpen = useUIStore((s) => s.isProjectManagerOpen);
  const toggle = useUIStore((s) => s.toggleProjectManager);
  const isDirty = useProjectStore((s) => s.isDirty);
  const isSaving = useProjectStore((s) => s.isSaving);
  const projectName = useProjectStore((s) => s.currentProject?.name ?? "");
  const setProjectName = useProjectStore((s) => s.setProjectName);
  const initNewProject = useProjectStore((s) => s.initNewProject);

  const { listProjects, fetchProject, saveProject, deleteProject } = useProject();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listProjects();
      setProjects(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [listProjects]);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

  const handleSave = async () => {
    try {
      setError(null);
      await saveProject();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  const handleLoad = async (id: string) => {
    try {
      await fetchProject(id);
      toggle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    await load();
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono
          bg-surface-2 border border-white/10 text-white/60 hover:bg-surface-3
          hover:text-white/80 transition-all"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M1 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1H1V2zM1 5h10v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5z"/>
        </svg>
        {projectName || "Untitled"}
        {isDirty && <span className="text-amber-400">●</span>}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-surface-1 border border-white/10 rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="font-mono font-semibold text-white">Projects</h2>
              <button onClick={toggle} className="text-white/40 hover:text-white text-xl">×</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Project name + save */}
              <div className="space-y-2">
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project name"
                  className="w-full bg-surface-2 border border-white/10 rounded px-3 py-2
                    text-sm font-mono text-white focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-2 rounded-lg text-sm font-mono font-semibold
                    bg-emerald-600/20 border border-emerald-500/40 text-emerald-300
                    hover:bg-emerald-600/40 disabled:opacity-50 transition-all"
                >
                  {isSaving ? "Saving…" : "Save Project"}
                </button>
                <button
                  onClick={() => { initNewProject(); toggle(); }}
                  className="w-full py-2 rounded-lg text-sm font-mono
                    bg-surface-2 border border-white/10 text-white/50
                    hover:bg-surface-3 transition-all"
                >
                  New Project
                </button>
              </div>

              {error && (
                <p className="text-xs font-mono text-rose-400 bg-rose-500/10 rounded px-3 py-2">
                  {error}
                </p>
              )}

              {/* Project list */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
                  Saved Projects
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {loading && (
                    <p className="text-center py-3 text-white/30 text-sm font-mono">Loading…</p>
                  )}
                  {!loading && projects.length === 0 && (
                    <p className="text-center py-3 text-white/20 text-sm font-mono">No saved projects</p>
                  )}
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2
                        hover:bg-surface-3 transition-colors group"
                    >
                      <button
                        onClick={() => handleLoad(p.id)}
                        className="flex-1 text-left"
                      >
                        <div className="text-sm font-mono text-white/80">{p.name}</div>
                        <div className="text-[10px] font-mono text-white/30">{p.bpm} BPM</div>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="opacity-0 group-hover:opacity-100 text-rose-400/60
                          hover:text-rose-400 transition-all text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
