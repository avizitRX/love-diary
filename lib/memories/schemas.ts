import { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const memoryListSchema = z.object({
  coupleId: z.uuid(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(24).default(15),
  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
});

const tiptapContentSchema = z.custom<JSONContent>(
  (value): value is JSONContent => {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const node = value as Record<string, unknown>;

    return node.type === "doc";
  },
  {
    message: "Memory content is required.",
  },
);

export const createMemorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Please enter a title.")
    .max(200, "Title must be 200 characters or less."),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less.")
    .nullable(),

  memoryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide a valid memory date."),

  content: tiptapContentSchema,

  thumbnailMediaId: z.string().uuid().nullable(),
});

export type MemoryListInput = z.infer<typeof memoryListSchema>;
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
