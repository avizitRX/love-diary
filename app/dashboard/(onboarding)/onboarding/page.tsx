import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { OnboardingInvite } from "@/components/onboarding/onboarding-invite";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  const { data: membership, error: membershipError } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) {
    throw new Error("Unable to load couple membership.");
  }

  if (membership) {
    redirect("/dashboard");
  }

  return <OnboardingInvite />;
}
