"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { Game } from "@/types";

interface GameSearchSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (game: Game) => void;
}

// Mock search — replace with real API call
async function searchGames(query: string): Promise<Game[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (!query.trim()) return [];
  const MOCK: Game[] = [
    { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "" },
    { id: "2", title: "팬데믹", minPlayers: 2, maxPlayers: 4, thumbnail: "" },
    { id: "3", title: "스플렌더", minPlayers: 2, maxPlayers: 4, thumbnail: "" },
    { id: "4", title: "아컴 호러", minPlayers: 1, maxPlayers: 6, thumbnail: "" },
    { id: "5", title: "도미니언", minPlayers: 2, maxPlayers: 4, thumbnail: "" },
  ];
  return MOCK.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  );
}

export default function GameSearchSheet({
  open,
  onClose,
  onSelect,
}: GameSearchSheetProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    setLoading(true);
    const res = await searchGames(q);
    setResults(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) doSearch(query);
      else setResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <Sheet
      key={open ? "open" : "closed"}
      open={open}
      onOpenChange={(v) => !v && onClose()}
    >
      <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>게임 검색</SheetTitle>
        </SheetHeader>

        {/* 검색 입력 */}
        <div className="relative mt-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="게임 이름을 검색하세요"
            className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-body"
          />
        </div>

        {/* 결과 */}
        <div className="flex-1 overflow-y-auto mt-3">
          {loading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-2/3 mb-1" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-center text-body text-gray-400 mt-8">검색 결과가 없어요</p>
          )}

          {!loading && results.map((game) => (
            <button
              key={game.id}
              type="button"
              className="flex items-center gap-3 w-full py-3 text-left hover:bg-gray-50 rounded-xl px-2 transition-colors"
              onClick={() => { onSelect(game); onClose(); }}
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {game.thumbnail && (
                  <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
                )}
              </div>
              <div>
                <p className="text-body font-medium text-gray-900">{game.title}</p>
                <p className="text-caption text-gray-400">
                  {game.minPlayers}~{game.maxPlayers}인
                  {game.minPlayTime ? ` · ${game.minPlayTime}분~` : ""}
                </p>
              </div>
            </button>
          ))}

          {!query && (
            <p className="text-center text-caption text-gray-400 mt-8">
              게임 이름으로 검색해보세요
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
