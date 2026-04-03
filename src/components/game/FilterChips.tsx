"use client";

import { SlidersHorizontal } from "lucide-react";
import { PLAYER_OPTIONS, PRICE_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import type { GameFilter } from "@/types";

interface FilterChipsProps {
  filter: GameFilter;
  onFilterChange: (key: keyof GameFilter, value: string | undefined) => void;
  onMoreClick: () => void;
}

const CHIP_BASE =
  "h-8 px-3.5 rounded-full text-caption font-medium transition-colors whitespace-nowrap border";
const CHIP_DEFAULT = "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200";
const CHIP_ACTIVE = "bg-primary-100 text-primary-700 border-primary-200";

export default function FilterChips({
  filter,
  onFilterChange,
  onMoreClick,
}: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
      {/* 인원수 */}
      {PLAYER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn(
            CHIP_BASE,
            filter.players === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT
          )}
          onClick={() =>
            onFilterChange(
              "players",
              filter.players === opt.value ? undefined : opt.value
            )
          }
        >
          {opt.label}
        </button>
      ))}

      {/* 가격대 */}
      {PRICE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn(
            CHIP_BASE,
            filter.priceRange === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT
          )}
          onClick={() =>
            onFilterChange(
              "priceRange",
              filter.priceRange === opt.value ? undefined : opt.value
            )
          }
        >
          {opt.label}
        </button>
      ))}

      {/* 더보기 */}
      <button
        type="button"
        className={cn(CHIP_BASE, CHIP_DEFAULT, "flex items-center gap-1 shrink-0")}
        onClick={onMoreClick}
      >
        <SlidersHorizontal size={12} />
        필터
      </button>
    </div>
  );
}
