"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function PaginationControls({
  pagination,
  loading,
  onPageChange,
}: {
  pagination: Pagination | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-text-secondary">
        {pagination
          ? `Page ${pagination.page} of ${totalPages} · ${pagination.total} total`
          : "Page 1 of 1"}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={loading || page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={loading || page >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
