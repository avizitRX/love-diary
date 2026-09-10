import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AddMemoryFormClient from "./add-memory-form-client";

export default async function AddMemoryForm() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    console.error("Failed to load couple membership:", membershipError);

    throw new Error("Could not load your couple.");
  }

  if (!membership?.couple_id) {
    redirect("/dashboard?error=no-couple");
  }

  return <AddMemoryFormClient coupleId={membership.couple_id} />;
}
