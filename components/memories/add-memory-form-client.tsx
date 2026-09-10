"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Editor, JSONContent } from "@tiptap/react";

import {
  CalendarDays,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { uploadMemoryContentMedia } from "@/lib/memories/actions/upload-media";

import { createMemory } from "@/lib/memories/actions/create-memory";

import { createMemoryMediaUpload } from "@/lib/memories/actions/upload-memory-media-action";

import RichTextEditor from "@/components/memories/rich-text-editor";

import { createClient } from "@/lib/supabase/client";

type AddMemoryFormClientProps = {
  coupleId: string;
};

type ThumbnailState = {
  file: File;
  previewUrl: string;
};

const initialContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export default function AddMemoryFormClient({
  coupleId,
}: AddMemoryFormClientProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [description, setDescription] = useState("");

  const [content, setContent] = useState<JSONContent>(initialContent);

  const [thumbnail, setThumbnail] = useState<ThumbnailState | null>(null);

  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);

  /*
   * This should never happen because the server wrapper
   * only renders this component when a couple exists.
   */
  if (!coupleId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
          <p className="font-medium text-destructive">
            Your couple could not be identified.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page or make sure your account is connected to a
            couple.
          </p>
        </div>
      </div>
    );
  }

  function handleThumbnailSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image for the thumbnail.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Thumbnail must be 10 MB or smaller.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setThumbnail((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.previewUrl);
      }

      return {
        file,
        previewUrl,
      };
    });

    /*
     * The previous uploaded media ID no longer belongs
     * to the newly selected file.
     */
    setThumbnailMediaId(null);
  }

  function removeThumbnail() {
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail.previewUrl);
    }

    setThumbnail(null);
    setThumbnailMediaId(null);
  }

  async function handleContentMediaUpload(
    file: File,
    editor: Editor,
  ): Promise<void> {
    setError(null);

    try {
      await uploadMemoryContentMedia(coupleId, file, editor);
    } catch (uploadError) {
      console.error("Content media upload failed:", uploadError);

      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Media upload failed.";

      setError(message);

      throw uploadError;
    }
  }

  async function uploadThumbnail(): Promise<string | null> {
    if (!thumbnail) {
      return null;
    }

    setThumbnailUploading(true);

    try {
      /*
       * coupleId comes from the server component.
       */
      const result = await createMemoryMediaUpload(
        coupleId,
        thumbnail.file.name,
        thumbnail.file.type,
        thumbnail.file.size,
      );

      if (!result.success || !result.media) {
        throw new Error(result.error ?? "Could not prepare thumbnail upload.");
      }

      const media = result.media;

      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from(media.bucket)
        .upload(media.storage_path, thumbnail.file, {
          contentType: thumbnail.file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Thumbnail storage upload failed:", uploadError);

        /*
         * Storage failed, so remove the pending
         * media database record.
         */
        await supabase.from("media").delete().eq("id", media.id);

        throw new Error(uploadError.message || "Thumbnail upload failed.");
      }

      setThumbnailMediaId(media.id);

      return media.id;
    } catch (uploadError) {
      console.error("Thumbnail upload failed:", uploadError);

      throw uploadError;
    } finally {
      setThumbnailUploading(false);
    }
  }

  function hasMeaningfulContent(document: JSONContent): boolean {
    function walk(node: JSONContent): boolean {
      if (
        node.type === "text" &&
        typeof node.text === "string" &&
        node.text.trim().length > 0
      ) {
        return true;
      }

      if (node.type === "mediaImage" || node.type === "mediaVideo") {
        return true;
      }

      return (node.content ?? []).some(walk);
    }

    return walk(document);
  }

  function validateForm(): string | null {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return "Please enter a title.";
    }

    if (trimmedTitle.length > 200) {
      return "Title must be 200 characters or less.";
    }

    if (!memoryDate) {
      return "Please select a date for this memory.";
    }

    if (!hasMeaningfulContent(content)) {
      return "Please write something about this memory.";
    }

    if (description.trim().length > 1000) {
      return "Description must be 1000 characters or less.";
    }

    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);
    setSuccess(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalThumbnailMediaId = thumbnailMediaId;

      /*
       * Upload the thumbnail before creating
       * the memory.
       */
      if (thumbnail && !finalThumbnailMediaId) {
        finalThumbnailMediaId = await uploadThumbnail();
      }

      const date = new Date(`${memoryDate}T00:00:00`);

      if (Number.isNaN(date.getTime())) {
        setError("The selected memory date is invalid.");
        return;
      }

      const result = await createMemory(coupleId, {
        title,
        description,
        memoryDate,
        content: JSON.parse(JSON.stringify(content)),
        thumbnailMediaId,
      });

      if (!result.success) {
        setError(result.error ?? "We couldn't save your memory.");

        return;
      }

      setSuccess("Memory saved successfully.");

      router.push(`/our-little-world/memories/${result.memoryId}`);

      router.refresh();
    } catch (submitError) {
      console.error("Create memory failed:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while saving your memory.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* =====================================================
          PAGE HEADER
      ====================================================== */}

        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium text-primary">
            Your little world
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Add a memory
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Capture a special moment, tell your story, and keep the memories you
            share together.
          </p>
        </div>

        {/* =====================================================
          GLOBAL ERROR
      ====================================================== */}

        {error && (
          <div
            role="alert"
            className="mx-auto mb-6 max-w-5xl rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3"
          >
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        {/* =====================================================
          SUCCESS
      ====================================================== */}

        {success && (
          <div
            role="status"
            className="mx-auto mb-6 max-w-5xl rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3"
          >
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {success}
            </p>
          </div>
        )}

        {/* =====================================================
          FORM CONTENT
      ====================================================== */}

        <div className="mx-auto max-w-5xl space-y-8">
          {/* ===================================================
            BASIC INFORMATION
        ==================================================== */}

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-6 py-6 sm:px-8">
              <h2 className="text-lg font-semibold">Memory details</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Give this moment a name and a date.
              </p>
            </div>

            <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
              {/* TITLE */}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="memory-title">Title</Label>

                <Input
                  id="memory-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Our first trip together"
                  maxLength={200}
                  disabled={isSubmitting}
                  className="h-12 text-base"
                />

                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {title.length}/200
                  </span>
                </div>
              </div>

              {/* DATE */}

              <div className="space-y-2">
                <Label htmlFor="memory-date">Memory date</Label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="memory-date"
                    type="date"
                    value={memoryDate}
                    onChange={(event) => setMemoryDate(event.target.value)}
                    disabled={isSubmitting}
                    className="h-12 pl-10"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  When did this moment happen?
                </p>
              </div>

              {/* DESCRIPTION */}

              <div className="space-y-2">
                <Label htmlFor="memory-description">
                  Short description
                  <span className="ml-1 font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <Textarea
                  id="memory-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="A short note about this memory..."
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="min-h-12 resize-none"
                />

                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    A quick summary for your memory card.
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {description.length}/1000
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
            THUMBNAIL
        ==================================================== */}

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-6 py-6 sm:px-8">
              <h2 className="text-lg font-semibold">Cover image</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose one image to represent this memory.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {!thumbnail ? (
                <label
                  htmlFor="memory-thumbnail"
                  className={[
                    "group flex min-h-56 cursor-pointer",
                    "flex-col items-center justify-center",
                    "rounded-2xl border-2 border-dashed",
                    "border-muted-foreground/25",
                    "bg-muted/20",
                    "transition-colors",
                    "hover:border-primary/50",
                    "hover:bg-muted/40",
                  ].join(" ")}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                    <ImagePlus className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>

                  <p className="font-medium">Add a cover image</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    PNG, JPG, WEBP up to 10 MB
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium shadow-sm">
                    <Upload className="h-4 w-4" />
                    Choose image
                  </span>

                  <input
                    id="memory-thumbnail"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={isSubmitting}
                    onChange={handleThumbnailSelected}
                  />
                </label>
              ) : (
                <div className="overflow-hidden rounded-2xl border bg-muted/20">
                  {/* IMAGE PREVIEW */}

                  <div className="relative aspect-[16/8] w-full overflow-hidden bg-muted">
                    <img
                      src={thumbnail.previewUrl}
                      alt="Memory cover preview"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                      <div className="min-w-0 text-white">
                        <p className="truncate text-sm font-medium">
                          {thumbnail.file.name}
                        </p>

                        <p className="text-xs text-white/70">
                          {(thumbnail.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={removeThumbnail}
                        disabled={isSubmitting || thumbnailUploading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* IMAGE ACTIONS */}

                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">
                        Cover image selected
                      </p>

                      <p className="text-xs text-muted-foreground">
                        The image will be uploaded when you save.
                      </p>
                    </div>

                    <label
                      htmlFor="memory-thumbnail-replace"
                      className={[
                        "cursor-pointer text-sm font-medium",
                        "text-primary hover:underline",
                        "has-[:disabled]:pointer-events-none",
                        "has-[:disabled]:opacity-50",
                      ].join(" ")}
                    >
                      Replace
                      <input
                        id="memory-thumbnail-replace"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isSubmitting || thumbnailUploading}
                        onChange={handleThumbnailSelected}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
            STORY EDITOR
        ==================================================== */}

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your story</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Write the story behind this moment. Add photos and videos
                    wherever you want.
                  </p>
                </div>

                <span className="hidden rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
                  Rich text
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-5">
              <RichTextEditor
                value={content}
                onChange={setContent}
                onUploadMedia={handleContentMediaUpload}
              />
            </div>
          </section>

          {/* ===================================================
            SAVE AREA
        ==================================================== */}

          <section className="rounded-2xl border bg-card shadow-sm">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="font-semibold">Ready to save?</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your memory and its media will be saved to your couple diary.
                </p>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                {/* CANCEL */}

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                  disabled={isSubmitting}
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>

                {/* SAVE */}

                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 sm:min-w-40 sm:flex-none"
                  disabled={isSubmitting || thumbnailUploading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : thumbnailUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save memory
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}