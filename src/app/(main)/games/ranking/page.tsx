"use client";

import { useState } from "react";
import { RankingRow } from "@/components/game/RankingRow";
import { RANKING_PERIOD_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import type { Game } from "@/types";

const MOCK_RANKING: Game[] = [
  { id: "1", title: "아컴 호러: 카드 게임", thumbnail: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200&h=200&fit=crop", minPlayers: 1, maxPlayers: 4, genres: ["협력", "테마"], avgRating: 9.2, ratingCount: 1234, rankChange: 2 },
  { id: "2", title: "글룸헤이븐", thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop", minPlayers: 1, maxPlayers: 4, genres: ["전략", "협력"], avgRating: 9.0, ratingCount: 2100, rankChange: 0 },
  { id: "3", title: "윙스팬", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop", minPlayers: 1, maxPlayers: 5, genres: ["전략", "가족"], avgRating: 8.8, ratingCount: 987, rankChange: -1 },
  { id: "4", title: "카탄", thumbnail: "https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=200&h=200&fit=crop", minPlayers: 3, maxPlayers: 4, genres: ["전략", "가족"], avgRating: 8.5, ratingCount: 3200, rankChange: 1 },
  { id: "5", title: "팬데믹", thumbnail: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=200&h=200&fit=crop", minPlayers: 2, maxPlayers: 4, genres: ["협력"], avgRating: 8.3, ratingCount: 1500, rankChange: -2 },
  { id: "6", title: "스플렌더", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop", minPlayers: 2, maxPlayers: 4, genres: ["전략", "경제"], avgRating: 8.1, ratingCount: 890, rankChange: 3 },
  { id: "7", title: "도미니언", thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop", minPlayers: 2, maxPlayers: 4, genres: ["덱빌딩"], avgRating: 7.9, ratingCount: 760, rankChange: 0 },
  { id: "8", title: "테라포밍 마스", thumbnail: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200&h=200&fit=crop", minPlayers: 1, maxPlayers: 5, genres: ["전략", "경제"], avgRating: 8.7, ratingCount: 1100, rankChange: 4, isNew: true },
  { id: "9", title: "7 원더스", thumbnail: "https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=200&h=200&fit=crop", minPlayers: 2, maxPlayers: 7, genres: ["전략"], avgRating: 8.0, ratingCount: 650, rankChange: -1 },
  { id: "10", title: "루트", thumbnail: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=200&h=200&fit=crop", minPlayers: 2, maxPlayers: 4, genres: ["전략", "비대칭"], avgRating: 8.4, ratingCount: 920, rankChange: 2, isNew: true },
];

export default function RankingPage() {
  const [period, setPeriod] = useState("weekly");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="h-14 flex items-center">
            <h1 className="text-lg font-bold text-gray-900">게임 랭킹</h1>
          </div>
          <div className="flex gap-1 pb-3">
            {RANKING_PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                  period === opt.value
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto">
        <div className="bg-white divide-y divide-gray-50">
          {MOCK_RANKING.map((game, idx) => (
            <RankingRow key={game.id} rank={idx + 1} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
