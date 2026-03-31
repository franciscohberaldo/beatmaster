"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PadId } from "@/types";

interface UploadResult {
  url: string;
  name: string;
  storagePath: string;
}

export function useSampleUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const supabase = createClient();

  const upload = useCallback(async (file: File, padId: PadId): Promise<UploadResult> => {
    if (!supabase) { setUploading(false); throw new Error("Login necessário para fazer upload de samples."); }
    setUploading(true);
    setProgress(0);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); throw new Error("LOGIN_REQUIRED"); }

    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const storagePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("samples")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;
    setProgress(70);

    // Save metadata to samples table
    const { error: dbError } = await supabase.from("samples").insert({
      user_id: user.id,
      name: file.name.replace(/\.[^.]+$/, ""), // name without extension
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
    });
    if (dbError) throw dbError;
    setProgress(90);

    // Get public URL (bucket must allow authenticated reads)
    const { data: urlData } = supabase.storage
      .from("samples")
      .getPublicUrl(storagePath);

    setProgress(100);
    setUploading(false);
    void padId;

    return {
      url: urlData.publicUrl,
      name: file.name.replace(/\.[^.]+$/, ""),
      storagePath,
    };
  }, [supabase]);

  return { upload, uploading, progress };
}
