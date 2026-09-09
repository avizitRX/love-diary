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

export type MemoryListInput = z.infer<typeof memoryListSchema>;
