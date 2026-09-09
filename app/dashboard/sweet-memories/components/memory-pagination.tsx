import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MemoryPaginationProps {
  page: number;
  totalPages: number;
  search?: string;
}

function createHref(page: number, search?: string) {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (search) {
    params.set("q", search);
  }

  return `/memories?${params.toString()}`;
}

function getPages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export function MemoryPagination({
  page,
  totalPages,
  search,
}: MemoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPages(page, totalPages);

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? createHref(page - 1, search) : undefined}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {pages.map((item, index) => {
          if (typeof item !== "number") {
            return (
              <PaginationItem key={`${item}-${index}`}>
                <span className="px-2 text-muted-foreground">…</span>
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink isActive={item === page}>
                <Link href={createHref(item, search)}>{item}</Link>
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? createHref(page + 1, search) : undefined}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
