"use client";

import { useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import FilterChips from "@/components/game/FilterChips";
import FilterSheet from "@/components/game/FilterSheet";
import GameGrid from "@/components/game/GameGrid";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/constants";
import type { GameFilter } from "@/types";
import type { Game } from "@/types";

// Mock data
const ALL_GAMES: Game[] = [
  { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400", avgRating: 4.5, price: 45000 },
  { id: "2", title: "팬데믹", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", avgRating: 4.3, price: 42000 },
  { id: "3", title: "스플렌더", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400", avgRating: 4.2, price: 38000 },
  { id: "4", title: "아컴 호러", minPlayers: 1, maxPlayers: 6, thumbnail: "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400", avgRating: 4.7, price: 72000 },
  { id: "5", title: "도미니언", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400", avgRating: 4.1, price: 35000 },
  { id: "6", title: "7 원더스", minPlayers: 2, maxPlayers: 7, thumbnail: "https://images.unsplash.com/photo-1615680022648-2db11101c73a?w=400", avgRating: 4.4, price: 48000 },
  { id: "7", title: "코드네임", minPlayers: 2, maxPlayers: 8, thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400", avgRating: 4.6, price: 25000 },
  { id: "8", title: "킹 오브 도쿄", minPlayers: 2, maxPlayers: 6, thumbnail: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400", avgRating: 3.9, price: 42000 },
];

export default function GamesPage() {
  const [filter, setFilter] = useState<GameFilter>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  function handleFilterChange(key: keyof GameFilter, value: string | undefined) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  function handleMoreFilters(partial: Partial<GameFilter>) {
    setFilter((prev) => ({ ...prev, ...partial }));
  }

  // Simple client-side filter (replace with API)
  const filtered = ALL_GAMES.filter((g) => {
    if (filter.search && !g.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
      {/* 검색 */}
      <SearchBar
        value={filter.search ?? ""}
        onChange={(v) => setFilter((prev) => ({ ...prev, search: v || undefined }))}
        placeholder="게임 이름으로 검색"
      />

      {/* 필터 칩 */}
      <div className="-mx-4 px-4 md:mx-0 md:px-0">
        <FilterChips
          filter={filter}
          onFilterChange={handleFilterChange}
          onMoreClick={() => setFilterSheetOpen(true)}
        />
      </div>

      {/* 정렬 + 결과 수 */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-caption text-gray-500 shrink-0">총 {filtered.length}개</p>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4 md:mx-0 md:px-0">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSortBy(opt.value)}
              className={cn(
                "h-7 px-3 rounded-full text-tiny font-medium transition-colors whitespace-nowrap shrink-0",
                sortBy === opt.value
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 게임 그리드 */}
      {filtered.length > 0 ? (
        <GameGrid games={filtered} />
      ) : (
        <EmptyState
          icon="🎲"
          title="검색 결과가 없어요"
          description="다른 검색어나 필터를 사용해보세요"
          ctaLabel="필터 초기화"
          onCta={() => setFilter({})}
        />
      )}

      {/* 필터 시트 */}
      <FilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filter={filter}
        onApply={handleMoreFilters}
      />
    </div>
  );
}
