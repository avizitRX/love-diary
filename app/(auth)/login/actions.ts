"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

// Login
const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),

  password: z.string().min(1, "Please enter your password."),

  next: z.string().optional(),
});

function getSafeRedirectPath(next: string | undefined) {
  if (!next) {
    return "/dashboard";
  }

  // Only allow internal paths.
  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid login details.";

    const next = getSafeRedirectPath(formData.get("next")?.toString());

    redirect(
      `/login?error=${encodeURIComponent(
        "Unable to log in",
      )}&message=${encodeURIComponent(
        message,
      )}&next=${encodeURIComponent(next)}`,
    );
  }

  const { email, password, next } = parsed.data;

  const redirectPath = getSafeRedirectPath(next);

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Unable to log in",
      )}&message=${encodeURIComponent(
        error.message,
      )}&next=${encodeURIComponent(redirectPath)}`,
    );
  }

  redirect(redirectPath);
}

// Logout
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  redirect("/login");
}