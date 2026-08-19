"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ListFilters({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
  hasActiveFilters,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-end sm:gap-4">
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="filter-search">Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            id="filter-search"
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-min-price">Min price</Label>
        <Input
          id="filter-min-price"
          type="number"
          min="0"
          placeholder="0"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="w-full sm:w-28"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-max-price">Max price</Label>
        <Input
          id="filter-max-price"
          type="number"
          min="0"
          placeholder="Any"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="w-full sm:w-28"
        />
      </div>
      {hasActiveFilters && (
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
