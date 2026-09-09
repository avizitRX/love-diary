import type { Memory } from "@/types/memory";

import { MemoryCard } from "./memory-card";

interface MemoryGridProps {
  memories: Memory[];
}

export function MemoryGrid({ memories }: MemoryGridProps) {
  if (memories.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed">
        <div className="text-center">
          <h2 className="font-semibold">No memories yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Start adding the moments you want to remember.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
