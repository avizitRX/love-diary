"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const deleteMemorySchema = z.object({
  id: z.string().uuid(),
});

export async function deleteMemoryAction(input: unknown) {
  const parsed = deleteMemorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid memory ID",
    };
  }

  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    console.error("Failed to delete memory:", error);

    return {
      success: false,
      error: "Unable to delete memory",
    };
  }

  revalidatePath("/memories");

  return {
    success: true,
  };
}
