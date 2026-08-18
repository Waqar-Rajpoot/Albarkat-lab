"use client";

import { cn } from "@/lib/utils";

export type SelectableService = {
  id: string;
  label: string;
  meta?: string;
  price: number;
};

export function ServiceSelectionList({
  items,
  selectedIds,
  onToggle,
  emptyMessage,
}: {
  items: SelectableService[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-text-secondary">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto rounded-md border border-border bg-surface p-2">
      {items.map((item) => {
        const checked = selectedIds.has(item.id);
        return (
          <label
            key={item.id}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors",
              checked
                ? "border-secondary bg-accent-blue-light"
                : "border-transparent hover:bg-background-light"
            )}
          >
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 shrink-0 rounded border-border accent-secondary"
              />
              <span>
                <span className="font-medium text-text">{item.label}</span>
                {item.meta && (
                  <span className="block text-xs text-text-secondary">{item.meta}</span>
                )}
              </span>
            </span>
            <span className="shrink-0 font-medium text-text">
              Rs. {item.price.toLocaleString()}
            </span>
          </label>
        );
      })}
    </div>
  );
}
