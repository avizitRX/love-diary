"use client";

import type { Editor } from "@tiptap/react";

import { createClient } from "@/lib/supabase/client";
import { createMemoryMediaUpload } from "./upload-memory-media-action";

export async function uploadMemoryContentMedia(
  coupleId: string,
  file: File,
  editor: Editor,
): Promise<string> {
  if (!coupleId) {
    throw new Error("Your couple could not be identified.");
  }

  const result = await createMemoryMediaUpload(
    coupleId,
    file.name,
    file.type,
    file.size,
  );

  if (!result.success || !result.media) {
    throw new Error(result.error ?? "Could not prepare media upload.");
  }

  const media = result.media;

  const supabase = createClient();

  const { error: uploadError } = await supabase.storage
    .from(media.bucket)
    .upload(media.storage_path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload failed:", uploadError);

    /*
     * Remove the pending database record.
     */
    await supabase.from("media").delete().eq("id", media.id);

    throw new Error(uploadError.message || "Media upload failed.");
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(media.bucket)
    .createSignedUrl(media.storage_path, 60 * 60 * 24); // It will be valid for 24 hours

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("Failed to create signed URL:", signedUrlError);

    await supabase.from("media").delete().eq("id", media.id);

    throw new Error("Could not create a URL for the uploaded media.");
  }

  const src = signedUrlData.signedUrl;

  let inserted = false;

  if (media.media_type === "image") {
    inserted = editor
      .chain()
      .focus()
      .insertContent({
        type: "mediaImage",
        attrs: {
          mediaId: media.id,
          src,
          alt: file.name,
        },
      })
      .run();
  } else if (media.media_type === "video") {
    inserted = editor
      .chain()
      .focus()
      .insertContent({
        type: "mediaVideo",
        attrs: {
          mediaId: media.id,
          src,
        },
      })
      .run();
  }

  if (!inserted) {
    await supabase.from("media").delete().eq("id", media.id);

    throw new Error("The media could not be inserted into the editor.");
  }

  return media.id;
}
