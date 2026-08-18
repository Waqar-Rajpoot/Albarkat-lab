"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CatalogFilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {categories && categories.length > 0 && onCategoryChange && (
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-text outline-none transition-colors focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20 sm:w-48"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
