"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
  next: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || undefined),
});

export type ActionState = {
  error?: string;
  message?: string;
} | null;

function getSafeRedirectPath(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function login(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      error: "Validation error",
      message:
        parsed.error.issues[0]?.message ?? "Please check your input details.",
    };
  }

  const { email, password, next } = parsed.data;
  const redirectPath = getSafeRedirectPath(next);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error: "Unable to log in",
      message: error.message,
    };
  }

  redirect(redirectPath);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
