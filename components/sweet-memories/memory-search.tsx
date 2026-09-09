"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";

export function MemorySearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        key={searchParams.get("q") ?? ""}
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="Search memories..."
        className="pl-9"
        disabled={isPending}
      />
    </div>
  );
}
