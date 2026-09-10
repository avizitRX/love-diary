import Link from "next/link";
import { CalendarDays, ImageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Memory } from "@/types/memory";

interface MemoryCardProps {
  memory: Memory;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Link href={`/memories/${memory.id}`} className="group block">
      <Card className="overflow-hidden border-border/60 shadow-none transition-shadow hover:shadow-md">
        <div className="aspect-4/3 bg-muted">
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-10 text-muted-foreground/50" />
          </div>
        </div>

        <CardContent className="space-y-2 p-4">
          <h2 className="line-clamp-1 font-semibold tracking-tight">
            {memory.title}
          </h2>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <time dateTime={memory.memory_date}>
              {formatDate(memory.memory_date)}
            </time>
          </div>

          {/* {memory.content && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {memory.content}
            </p>
          )} */}
        </CardContent>
      </Card>
    </Link>
  );
}
