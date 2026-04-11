"use client";

import { SlidersHorizontal } from "lucide-react";
import { GENRE_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import type { GameFilter } from "@/types";

interface FilterChipsProps {
  filter: GameFilter;
  onFilterChange: (key: keyof GameFilter, value: string | undefined) => void;
  onMoreClick: () => void;
}

const CHIP_BASE =
  "h-8 px-3.5 rounded-full text-caption font-medium transition-colors whitespace-nowrap border shrink-0";
const CHIP_DEFAULT = "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50";
const CHIP_ACTIVE = "bg-primary-500 text-white border-primary-500";

export default function FilterChips({
  filter,
  onFilterChange,
  onMoreClick,
}: FilterChipsProps) {
  const activeGenre = filter.genre;
  const hasDetailFilter = !!(filter.players || filter.priceRange || filter.playTime || filter.minAge);

  return (
    <div className="flex items-center gap-2">
      {/* 장르 칩 — 스크롤 영역 */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5 flex-1 min-w-0">
        {/* 전체 */}
        <button
          type="button"
          className={cn(CHIP_BASE, !activeGenre ? CHIP_ACTIVE : CHIP_DEFAULT)}
          onClick={() => onFilterChange("genre", undefined)}
        >
          전체
        </button>

        {GENRE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(CHIP_BASE, activeGenre === opt.value ? CHIP_ACTIVE : CHIP_DEFAULT)}
            onClick={() =>
              onFilterChange("genre", activeGenre === opt.value ? undefined : opt.value)
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-px h-5 bg-gray-200 shrink-0" />

      {/* 상세 필터 버튼 — 항상 고정 */}
      <button
        type="button"
        onClick={onMoreClick}
        className={cn(
          "shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-caption font-medium border transition-colors",
          hasDetailFilter
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        )}
      >
        <SlidersHorizontal size={13} />
        <span>필터</span>
        {hasDetailFilter && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white text-gray-900 text-[10px] font-bold leading-none">
            {[filter.players, filter.priceRange, filter.playTime, filter.minAge].filter(Boolean).length}
          </span>
        )}
      </button>
    </div>
  );
}
