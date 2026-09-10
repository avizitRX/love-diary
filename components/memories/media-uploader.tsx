"use client";

import { useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type UploadedMedia = {
  id: string;
  storagePath: string;
  url: string;
  mediaType: "image" | "video";
  fileName: string;
  fileSizeBytes: number;
};

type MediaUploaderProps = {
  coupleId: string;
  onChange: (media: UploadedMedia[]) => void;
  maxFiles?: number;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export default function MediaUploader({
  coupleId,
  onChange,
  maxFiles = 50,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    setError(null);

    const supabase = createClient();

    const selected = Array.from(selectedFiles);

    if (files.length + selected.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} files.`);
      return;
    }

    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`${file.name} is not a supported file type.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} is larger than 50 MB.`);
        return;
      }
    }

    setUploading(true);

    try {
      const uploaded: UploadedMedia[] = [];

      for (const file of selected) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";

        const randomId = crypto.randomUUID();

        const storagePath = `${coupleId}/memories/${randomId}.${extension}`;

        /*
         * Upload file.
         */

        const { error: uploadError } = await supabase.storage
          .from("couple-media")
          .upload(storagePath, file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          console.error("Storage upload failed:", uploadError);

          throw new Error(`Unable to upload ${file.name}.`);
        }

        /*
         * Create media record.
         */

        const mediaType = file.type.startsWith("video/") ? "video" : "image";

        const { data: media, error: mediaError } = await supabase
          .from("media")
          .insert({
            couple_id: coupleId,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id,
            bucket: "couple-media",
            storage_path: storagePath,
            media_type: mediaType,
            mime_type: file.type,
            file_name: file.name,
            file_size_bytes: file.size,
          })
          .select("id")
          .single();

        if (mediaError || !media) {
          /*
           * DB creation failed.
           * Remove the uploaded Storage object.
           */

          await supabase.storage.from("couple-media").remove([storagePath]);

          throw new Error(`Unable to save ${file.name}.`);
        }

        /*
         * Signed URL.
         */

        const { data: signedUrl, error: urlError } = await supabase.storage
          .from("couple-media")
          .createSignedUrl(storagePath, 60 * 60);

        if (urlError || !signedUrl) {
          throw new Error(`Unable to prepare ${file.name}.`);
        }

        uploaded.push({
          id: media.id,
          storagePath,
          url: signedUrl.signedUrl,
          mediaType,
          fileName: file.name,
          fileSizeBytes: file.size,
        });
      }

      const next = [...files, ...uploaded];

      setFiles(next);
      onChange(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function removeFile(media: UploadedMedia) {
    const supabase = createClient();

    /*
     * Delete DB record.
     *
     * Storage accounting is handled by DB trigger.
     */

    const { error: dbError } = await supabase
      .from("media")
      .delete()
      .eq("id", media.id)
      .eq("couple_id", coupleId);

    if (dbError) {
      setError("Unable to remove this media.");
      return;
    }

    /*
     * Delete actual Storage object.
     */

    const { error: storageError } = await supabase.storage
      .from("couple-media")
      .remove([media.storagePath]);

    if (storageError) {
      console.error("Storage cleanup failed:", storageError);
    }

    const next = files.filter((file) => file.id !== media.id);

    setFiles(next);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed p-8 text-center transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="text-sm font-medium">
          {uploading ? "Uploading..." : "Add photos or videos"}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WebP, GIF, MP4, WebM, MOV · max 50 MB each
        </div>
      </button>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative overflow-hidden rounded-lg border"
            >
              {file.mediaType === "image" ? (
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <video
                  src={file.url}
                  className="aspect-square w-full object-cover"
                  controls
                />
              )}

              <button
                type="button"
                onClick={() => removeFile(file)}
                className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
