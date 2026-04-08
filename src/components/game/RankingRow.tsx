"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { Game } from "@/types";

interface RankingRowProps {
  rank: number;
  game: Game;
}

export function RankingRow({ rank, game }: RankingRowProps) {
  const change = game.rankChange ?? 0;

  return (
    <Link
      href={ROUTES.GAME_DETAIL(game.id)}
      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      {/* 순위 */}
      <div className="w-7 flex-shrink-0 text-center">
        <span className={cn(
          "text-lg font-bold",
          rank <= 3 ? "text-primary-600" : "text-gray-400"
        )}>
          {rank}
        </span>
      </div>

      {/* 썸네일 */}
      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{game.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">{game.minPlayers}~{game.maxPlayers}인</span>
          {game.genres?.[0] && (
            <span className="text-xs text-gray-400">· {game.genres[0]}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-xs font-medium text-gray-700">{game.avgRating?.toFixed(1) ?? "-"}</span>
          {game.ratingCount && (
            <span className="text-xs text-gray-400">({game.ratingCount.toLocaleString()})</span>
          )}
        </div>
      </div>

      {/* 순위 변동 */}
      <div className="flex-shrink-0 flex flex-col items-center gap-0.5 w-10">
        {game.isNew ? (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">NEW</span>
        ) : change > 0 ? (
          <>
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-red-500">+{change}</span>
          </>
        ) : change < 0 ? (
          <>
            <TrendingDown className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-500">{change}</span>
          </>
        ) : (
          <Minus className="w-4 h-4 text-gray-300" />
        )}
      </div>
    </Link>
  );
}
