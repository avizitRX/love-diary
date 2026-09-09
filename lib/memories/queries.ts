import "server-only";

import { createClient } from "@/utils/supabase/server";
import type { Memory, MemoryListResult } from "@/types/memory";

import { memoryListSchema, type MemoryListInput } from "./schemas";

export async function getMemories(
  input: MemoryListInput,
): Promise<MemoryListResult> {
  const parsed = memoryListSchema.parse(input);

  const supabase = await createClient();

  const from = (parsed.page - 1) * parsed.pageSize;
  const to = from + parsed.pageSize - 1;

  let query = supabase
    .from("memories")
    .select(
      `
        id,
        couple_id,
        title,
        content,
        event_date,
        updated_by_user_id,
        created_at,
        updated_at
      `,
      {
        count: "exact",
      },
    )
    .eq("couple_id", parsed.coupleId)
    .order("event_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (parsed.search) {
    query = query.or(
      `title.ilike.%${parsed.search}%,content.ilike.%${parsed.search}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch memories:", error);
    throw new Error("Unable to load memories");
  }

  const total = count ?? 0;

  return {
    memories: (data ?? []) as Memory[],
    page: parsed.page,
    pageSize: parsed.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / parsed.pageSize)),
  };
}