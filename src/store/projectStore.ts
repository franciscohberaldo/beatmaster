import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PadConfig, PadId, Project, SequencerPattern, StepPattern } from "@/types";
import { createDefaultPads, createDefaultPatterns } from "@/lib/constants";

interface ProjectStore {
  currentProject: Project | null;
  isDirty: boolean;
  isSaving: boolean;

  loadProject: (project: Project) => void;
  initNewProject: (name?: string) => void;
  updatePad: (padId: PadId, update: Partial<PadConfig>) => void;
  toggleStep: (padId: PadId, stepIndex: number) => void;
  setStepPattern: (padId: PadId, pattern: StepPattern) => void;
  setProjectName: (name: string) => void;
  markDirty: () => void;
  markSaving: (saving: boolean) => void;
  markSaved: (updatedAt: string) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export const useProjectStore = create<ProjectStore>()(
  immer((set) => ({
    currentProject: null,
    isDirty: false,
    isSaving: false,

    loadProject: (project) =>
      set((state) => {
        state.currentProject = project;
        state.isDirty = false;
        state.isSaving = false;
      }),

    initNewProject: (name = "Untitled Project") =>
      set((state) => {
        const now = new Date().toISOString();
        state.currentProject = {
          id: generateId(),
          userId: "",
          name,
          bpm: 120,
          pads: createDefaultPads(),
          patterns: createDefaultPatterns(),
          createdAt: now,
          updatedAt: now,
        };
        state.isDirty = false;
        state.isSaving = false;
      }),

    updatePad: (padId, update) =>
      set((state) => {
        if (!state.currentProject) return;
        const pad = state.currentProject.pads[padId];
        if (pad) Object.assign(pad, update);
        state.isDirty = true;
      }),

    toggleStep: (padId, stepIndex) =>
      set((state) => {
        if (!state.currentProject) return;
        const pattern = state.currentProject.patterns[padId];
        if (pattern) {
          pattern.steps[stepIndex] = !pattern.steps[stepIndex];
          state.isDirty = true;
        }
      }),

    setStepPattern: (padId, pattern) =>
      set((state) => {
        if (!state.currentProject) return;
        const existing = state.currentProject.patterns[padId];
        if (existing) {
          existing.steps = [...pattern] as StepPattern;
          state.isDirty = true;
        }
      }),

    setProjectName: (name) =>
      set((state) => {
        if (!state.currentProject) return;
        state.currentProject.name = name;
        state.isDirty = true;
      }),

    markDirty: () => set((state) => { state.isDirty = true; }),

    markSaving: (saving) => set((state) => { state.isSaving = saving; }),

    markSaved: (updatedAt) =>
      set((state) => {
        if (state.currentProject) state.currentProject.updatedAt = updatedAt;
        state.isDirty = false;
        state.isSaving = false;
      }),
  }))
);

// Selector helpers
export const selectPad = (padId: PadId) => (state: ProjectStore) =>
  state.currentProject?.pads[padId] ?? null;

export const selectPattern = (padId: PadId) => (state: ProjectStore) =>
  state.currentProject?.patterns[padId] ?? null;
