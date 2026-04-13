"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/common/SearchBar";
import FilterChips from "@/components/game/FilterChips";
import FilterSheet from "@/components/game/FilterSheet";
import GameGrid from "@/components/game/GameGrid";
import EmptyState from "@/components/common/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/constants";
import type { GameFilter, Game } from "@/types";

async function fetchGames(): Promise<Game[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("games")
    .select("id, title, title_en, thumbnail, min_players, max_players, min_play_time, max_play_time, avg_rating, rating_count, price, genres, designer, publisher, release_year, bgg_id, rank, rank_change, is_new")
    .order("rank", { ascending: true, nullsFirst: false })
    .limit(1000);

  if (error) throw error;

  return (data ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    titleEn: g.title_en ?? undefined,
    thumbnail: g.thumbnail ?? "",
    minPlayers: g.min_players,
    maxPlayers: g.max_players,
    minPlayTime: g.min_play_time ?? undefined,
    maxPlayTime: g.max_play_time ?? undefined,
    avgRating: g.avg_rating ? Number(g.avg_rating) : undefined,
    ratingCount: g.rating_count ?? undefined,
    price: g.price ?? undefined,
    genres: g.genres ?? [],
    designer: g.designer ?? undefined,
    publisher: g.publisher ?? undefined,
    releaseYear: g.release_year ?? undefined,
    bggId: g.bgg_id ?? undefined,
    rank: g.rank ?? undefined,
    rankChange: g.rank_change ?? undefined,
    isNew: g.is_new ?? false,
  }));
}

export default function GamesPage() {
  const [filter, setFilter] = useState<GameFilter>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  function handleFilterChange(key: keyof GameFilter, value: string | undefined) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  function handleMoreFilters(partial: Partial<GameFilter>) {
    setFilter((prev) => ({ ...prev, ...partial }));
  }

  const activeGenre = filter.genre ?? filter.genres?.[0];

  const filtered = games
    .filter((g) => {
      if (filter.search && !g.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (activeGenre && !g.genres?.includes(activeGenre)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":    return (a.rank ?? 999999) - (b.rank ?? 999999);
        case "rating":     return (b.avgRating ?? 0) - (a.avgRating ?? 0);
        case "price_asc":  return (a.price ?? 999999) - (b.price ?? 999999);
        case "price_desc": return (b.price ?? 0) - (a.price ?? 0);
        case "newest":     return (b.releaseYear ?? 0) - (a.releaseYear ?? 0);
        default:           return 0;
      }
    });

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
      <SearchBar
        value={filter.search ?? ""}
        onChange={(v) => setFilter((prev) => ({ ...prev, search: v || undefined }))}
        placeholder="게임 이름으로 검색"
      />

      <div className="-mx-4 px-4 md:mx-0 md:px-0">
        <FilterChips
          filter={filter}
          onFilterChange={handleFilterChange}
          onMoreClick={() => setFilterSheetOpen(true)}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-caption text-gray-500 shrink-0">총 {filtered.length}개</p>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5">
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
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

      <FilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filter={filter}
        onApply={handleMoreFilters}
      />
    </div>
  );
}
