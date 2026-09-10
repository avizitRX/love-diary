"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const uploadSchema = z.object({
  coupleId: z.string().uuid(),
  fileName: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  fileSize: z.number().int().positive(),
});

export async function createMemoryMediaUpload(
  coupleId: string,
  fileName: string,
  mimeType: string,
  fileSize: number,
) {
  const parsed = uploadSchema.safeParse({
    coupleId,
    fileName,
    mimeType,
    fileSize,
  });

  if (!parsed.success) {
    console.error("Invalid media upload input:", parsed.error.flatten());

    return {
      success: false as const,
      error: "Invalid upload information.",
    };
  }

  const {
    coupleId: validCoupleId,
    fileName: validFileName,
    mimeType: validMimeType,
    fileSize: validFileSize,
  } = parsed.data;

  const isImage = validMimeType.startsWith("image/");

  const isVideo = validMimeType.startsWith("video/");

  if (!isImage && !isVideo) {
    return {
      success: false as const,
      error: "Only images and videos are allowed.",
    };
  }

  if (isImage && validFileSize > MAX_IMAGE_SIZE) {
    return {
      success: false as const,
      error: "Images must be 10 MB or smaller.",
    };
  }

  if (isVideo && validFileSize > MAX_VIDEO_SIZE) {
    return {
      success: false as const,
      error: "Videos must be 100 MB or smaller.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false as const,
      error: "You must be logged in.",
    };
  }

  /*
   * Verify that the current user belongs to
   * the requested couple.
   */
  const { data: membership, error: membershipError } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("couple_id", validCoupleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    console.error("Couple membership lookup failed:", membershipError);

    return {
      success: false as const,
      error: "Could not verify couple access.",
    };
  }

  if (!membership) {
    return {
      success: false as const,
      error: "You do not have access to this couple.",
    };
  }

  /*
   * Never use the original filename as the storage path.
   * Generate a UUID to avoid collisions and unsafe paths.
   */
  const mediaId = crypto.randomUUID();

  const extension =
    validFileName
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "bin";

  const storagePath = `${validCoupleId}/memories/${mediaId}.${extension}`;

  const { data: media, error: insertError } = await supabase
    .from("media")
    .insert({
      id: mediaId,
      couple_id: validCoupleId,
      uploaded_by: user.id,
      bucket: "couple-media",
      storage_path: storagePath,
      media_type: isImage ? "image" : "video",
      mime_type: validMimeType,
      file_name: validFileName,
      file_size_bytes: validFileSize,
    })
    .select("id, couple_id, bucket, storage_path, media_type")
    .single();

  if (insertError || !media) {
    console.error("Failed to create media record:", insertError);

    return {
      success: false as const,
      error: "Could not prepare the media upload.",
    };
  }

  return {
    success: true as const,
    media,
  };
}
