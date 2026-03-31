"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProjectStore } from "@/store";
import type { DbProject, Project, ProjectSummary } from "@/types";
import { createDefaultPads, createDefaultPatterns } from "@/lib/constants";

function dbToProject(row: DbProject): Project {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    bpm: row.bpm,
    pads: row.pad_configs?.length ? row.pad_configs : createDefaultPads(),
    patterns: row.sequencer_patterns?.length ? row.sequencer_patterns : createDefaultPatterns(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useProject() {
  const { currentProject, markSaving, markSaved, loadProject } = useProjectStore();
  const supabase = createClient();

  const listProjects = useCallback(async (): Promise<ProjectSummary[]> => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, bpm, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      bpm: r.bpm,
      updatedAt: r.updated_at,
    }));
  }, [supabase]);

  const fetchProject = useCallback(async (id: string): Promise<Project> => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    const project = dbToProject(data as DbProject);
    loadProject(project);
    return project;
  }, [supabase, loadProject]);

  const saveProject = useCallback(async (): Promise<void> => {
    if (!supabase) throw new Error("Supabase not configured. Add credentials to .env.local");
    if (!currentProject) return;
    markSaving(true);
    const payload = {
      name: currentProject.name,
      bpm: currentProject.bpm,
      pad_configs: currentProject.pads,
      sequencer_patterns: currentProject.patterns,
    };
    const isUuid = /^[0-9a-f-]{36}$/i.test(currentProject.id);
    const { data, error } = isUuid
      ? await supabase.from("projects").update(payload).eq("id", currentProject.id).select().single()
      : await supabase.from("projects").insert({ ...payload, id: undefined }).select().single();
    if (error) { markSaving(false); throw error; }
    markSaved((data as DbProject).updated_at);
  }, [currentProject, supabase, markSaving, markSaved]);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  }, [supabase]);

  return { listProjects, fetchProject, saveProject, deleteProject };
}
