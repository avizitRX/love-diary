"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
    next: z
      .string()
      .nullable()
      .optional()
      .transform((val) => val || undefined),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupActionState = {
  error?: string;
  message?: string;
  inputs?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
} | null;

function getSafeRedirectPath(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function signup(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const firstName = formData.get("first-name")?.toString() || "";
  const lastName = formData.get("last-name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";

  const parsed = signupSchema.safeParse({
    firstName,
    lastName,
    email,
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      error: "Validation error",
      message:
        parsed.error.issues[0]?.message ?? "Please check your input details.",
      inputs: { firstName, lastName, email },
    };
  }

  const { password, next } = parsed.data;
  const redirectPath = getSafeRedirectPath(next);
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return {
      error: "Unable to create account",
      message: error.message,
      inputs: { firstName, lastName, email },
    };
  }

  redirect(redirectPath);
}
