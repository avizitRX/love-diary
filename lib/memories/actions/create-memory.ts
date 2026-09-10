"use server";

import { createClient } from "@/lib/supabase/server";
import { createMemorySchema } from "../schemas";
import { extractMediaIds } from "./extract-media-ids";


export async function createMemory(coupleId: string, input: unknown) {
  const parsed = createMemorySchema.safeParse(input);

  if (!parsed.success) {
    console.error("Create memory validation failed:", parsed.error.issues);

    const firstIssue = parsed.error.issues[0];

    return {
      success: false as const,
      error: firstIssue?.message ?? "Please check your memory details.",
    };
  }

  const { title, memoryDate, content, thumbnailMediaId } = parsed.data;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Your session has expired. Please sign in again.",
    };
  }

  const mediaIds = extractMediaIds(content);

  if (thumbnailMediaId) {
    mediaIds.push(thumbnailMediaId);
  }

  const uniqueMediaIds = [...new Set(mediaIds)];

  /*
   * Verify all media belongs to this couple.
   */
  if (uniqueMediaIds.length > 0) {
    const { data: mediaRows, error: mediaError } = await supabase
      .from("media")
      .select("id, couple_id")
      .in("id", uniqueMediaIds);

    if (mediaError) {
      console.error("Media validation failed:", mediaError);

      return {
        success: false,
        error: "We couldn't verify the uploaded media.",
      };
    }

    if (
      !mediaRows ||
      mediaRows.length !== uniqueMediaIds.length ||
      mediaRows.some((media) => media.couple_id !== coupleId)
    ) {
      return {
        success: false,
        error: "One or more uploaded files are invalid.",
      };
    }
  }

  const { data: memory, error } = await supabase
    .from("memories")
    .insert({
      couple_id: coupleId,
      title,
      memory_date: memoryDate,
      content,
      thumbnail_media_id: thumbnailMediaId,
      updated_by_user_id: user.id,
    })
    .select("id")
    .single();

  if (error || !memory) {
    console.error("Memory creation failed:", error);

    return {
      success: false,
      error: "We couldn't save your memory. Please try again.",
    };
  }

  const contentMediaIds = extractMediaIds(content).filter(
    (id) => id !== thumbnailMediaId,
  );

  if (contentMediaIds.length > 0) {
    const rows = contentMediaIds.map((mediaId, index) => ({
      memory_id: memory.id,
      media_id: mediaId,
      sort_order: index,
    }));

    const { error: relationError } = await supabase
      .from("memory_media")
      .insert(rows);

    if (relationError) {
      console.error("Memory media attachment failed:", relationError);

      /*
       * Don't leave a half-created memory.
       */
      await supabase.from("memories").delete().eq("id", memory.id);

      return {
        success: false,
        error: "Your memory could not be saved with its media.",
      };
    }
  }

  return {
    success: true,
    memoryId: memory.id,
  };
}
