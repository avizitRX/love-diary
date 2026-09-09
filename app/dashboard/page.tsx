import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard/our-little-world");
  } else {
    redirect("/login");
  }
}
