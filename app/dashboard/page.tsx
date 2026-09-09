import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const userId = claimsData.claims.sub;

  const { data: membership, error: membershipError } = await supabase
    .from("couple_members")
    .select("id, couple_id, user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!membership) {
    redirect("/dashboard/onboarding");
  }

  redirect("/dashboard/our-little-world");
}
