import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-56" />
          </div>

          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-72" />
        </div>

        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
