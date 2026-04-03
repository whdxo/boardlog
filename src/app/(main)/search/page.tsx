"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

const RECENT_SEARCHES = ["카탄", "협력 게임", "윙스팬", "팬데믹"];
const TRENDING = ["글룸헤이븐", "테라포밍 마스", "루트", "아컴 호러", "스플렌더"];

type SearchTab = "games" | "posts" | "users" | "local";

const MOCK_GAME_RESULTS = [
  { id: "1", title: "카탄", thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=100", minPlayers: 3, maxPlayers: 4, avgRating: 8.5 },
  { id: "2", title: "카르카손", thumbnail: "https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=100", minPlayers: 2, maxPlayers: 5, avgRating: 8.0 },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SearchTab>("games");
  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* 검색 입력 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="게임, 게시글, 유저, 장소 검색"
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-0.5 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isSearching ? (
        /* 검색 전: 최근/인기 */
        <div className="px-4 py-5 space-y-6">
          {RECENT_SEARCHES.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">최근 검색어</h2>
                <button className="text-xs text-gray-400">전체 삭제</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Clock className="w-3 h-3 text-gray-400" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">인기 검색어</h2>
            <div className="flex flex-col gap-2">
              {TRENDING.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="flex items-center gap-3 py-2 text-left hover:text-primary-600 transition-colors"
                >
                  <span className={cn("text-sm font-bold w-5 text-center", i < 3 ? "text-primary-600" : "text-gray-300")}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 검색 결과 */
        <div>
          {/* 결과 탭 */}
          <div className="flex border-b border-gray-100">
            {(["games", "posts", "users", "local"] as SearchTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  tab === t ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"
                )}
              >
                {t === "games" ? "게임" : t === "posts" ? "게시글" : t === "users" ? "유저" : "로컬"}
              </button>
            ))}
          </div>

          {/* 게임 탭 결과 */}
          {tab === "games" && (
            <div className="divide-y divide-gray-50">
              {MOCK_GAME_RESULTS.map((game) => (
                <Link key={game.id} href={ROUTES.GAME_DETAIL(game.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{game.title}</p>
                    <p className="text-xs text-gray-500">{game.minPlayers}~{game.maxPlayers}인 · ★ {game.avgRating}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab !== "games" && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search className="w-8 h-8 mb-2" />
              <p className="text-sm">&ldquo;{query}&rdquo; 검색 결과가 없어요</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
