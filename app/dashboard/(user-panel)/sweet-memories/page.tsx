import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";


import { createClient } from "@/lib/supabase/server";
import { getMemories } from "@/lib/memories/queries";
import { MemorySearch } from "../../../../components/sweet-memories/memory-search";
import { MemoryGrid } from "../../../../components/sweet-memories/memory-grid";
import { MemoryPagination } from "../../../../components/sweet-memories/memory-pagination";

interface MemoriesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function MemoriesPage({
  searchParams,
}: MemoriesPageProps) {
  const params = await searchParams;

  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const userId = claimsData.claims.sub;

  /*
   * Do not take couple_id from an arbitrary query parameter
   * if the user has only one active couple.
   *
   * Ideally resolve the user's active couple from your
   * authenticated application data.
   */
  const { data: membership, error: membershipError } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) {
    throw new Error("Couple membership not found");
  }

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const search = params.q?.trim() || undefined;

  const result = await getMemories({
    coupleId: membership.couple_id,
    page,
    pageSize: 9,
    search,
  });

  /*
   * If someone visits /memories?page=999, don't render
   * an empty page. Redirect to the final valid page.
   */
  if (result.totalPages > 1 && page > result.totalPages) {
    redirect(
      `/memories?page=${result.totalPages}${
        search ? `&q=${encodeURIComponent(search)}` : ""
      }`,
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Memories</h1>

            <p className="mt-1 text-muted-foreground">
              All the beautiful moments
            </p>
          </div>

          <Button>
            <Link href="/memories/new">
              <Plus />
              Add Memory
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="flex justify-end">
          <MemorySearch />
        </div>

        {/* Content */}
        <MemoryGrid memories={result.memories} />

        {/* Pagination */}
        <MemoryPagination
          page={result.page}
          totalPages={result.totalPages}
          search={search}
        />
      </div>
    </main>
  );
}
