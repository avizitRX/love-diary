"use server";

import crypto from "node:crypto";

import { createClient } from "@/lib/supabase/server";

const INVITE_EXPIRATION_DAYS = 7;

export async function createInvite() {
  const supabase = await createClient();

  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims?.sub) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  const token = crypto.randomBytes(32).toString("base64url");

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date(
    Date.now() + INVITE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
  );

  const { error } = await supabase.rpc("create_couple_invitation", {
    p_token_hash: tokenHash,
    p_expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("createInvite:", error);

    if (error.message.includes("already_in_couple")) {
      return {
        success: false,
        error: "You are already part of a couple.",
      };
    }

    return {
      success: false,
      error: "Unable to create invitation.",
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
  }

  return {
    success: true,
    url: `${appUrl}/invite/${token}`,
    expiresAt: expiresAt.toISOString(),
  };
}
