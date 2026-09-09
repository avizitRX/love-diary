"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function hashInviteToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function acceptInvite(token: string) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect(
      `/login?next=${encodeURIComponent(`/invite/${token}`)}`,
    );
  }

  const tokenHash = hashInviteToken(token);

  const { data: coupleId, error } = await supabase.rpc(
    "accept_couple_invitation",
    {
      p_token_hash: tokenHash,
    },
  );

  if (error) {
    console.error("acceptInvite:", error);

    redirect(
      `/invite/${encodeURIComponent(token)}?error=accept_failed`,
    );
  }

  redirect("/dashboard");
}

export async function declineInvite(token: string) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const tokenHash = hashInviteToken(token);

  const { error } = await supabase.rpc(
    "decline_couple_invitation",
    {
      p_token_hash: tokenHash,
    },
  );

  if (error) {
    console.error("declineInvite:", error);

    redirect(
      `/invite/${encodeURIComponent(token)}?error=decline_failed`,
    );
  }

  redirect("/dashboard");
}