import crypto from "node:crypto";
import { redirect, notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InvitePage } from "@/components/invite/invite-page";

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

function hashInviteToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export default async function InvitationPage({
  params,
}: InvitePageProps) {
  const { token } = await params;

  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    const next = encodeURIComponent(`/invite/${token}`);

    redirect(`/login?next=${next}`);
  }

  const tokenHash = hashInviteToken(token);

  const { data, error } = await supabase.rpc(
    "get_couple_invitation",
    {
      p_token_hash: tokenHash,
    },
  );

  if (error) {
    notFound();
  }

  const invitation = data?.[0];

  if (!invitation) {
    notFound();
  }

  if (
    invitation.inviter_id === claimsData.claims.sub
  ) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground">
          You cannot accept your own invitation.
        </p>
      </div>
    );
  }

  return (
    <InvitePage
      token={token}
      inviterName={invitation.inviter_name}
      expiresAt={invitation.expires_at}
    />
  );
}