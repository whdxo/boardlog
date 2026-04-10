"use client";

import { COLLECTION_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";
import type { CollectionStatus } from "@/types";

interface CollectionCategoryBarProps {
  counts: Record<string, number>;
  total: number;
  selected: CollectionStatus | "all";
  onSelect: (status: CollectionStatus | "all") => void;
}

export default function CollectionCategoryBar({
  counts,
  total,
  selected,
  onSelect,
}: CollectionCategoryBarProps) {
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none">
      <button
        onClick={() => onSelect("all")}
        className={cn(
          "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
          selected === "all"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600"
        )}
      >
        전체 {total}
      </button>
      {COLLECTION_STATUSES.map((s) => {
        const count = counts[s.value] ?? 0;
        return (
          <button
            key={s.value}
            onClick={() => onSelect(s.value)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              selected === s.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
            )}
          >
            <span>{s.emoji}</span>
            {s.label} {count}
          </button>
        );
      })}
    </div>
  );
}
