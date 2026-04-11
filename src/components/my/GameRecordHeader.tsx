"use client";

import Image from "next/image";
import { Users, Clock } from "lucide-react";
import type { GameStats } from "@/types";

interface GameRecordHeaderProps {
  stats: GameStats;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function GameRecordHeader({ stats }: GameRecordHeaderProps) {
  const { game, firstPlayedAt, totalPlays, myRating } = stats;

  return (
    <div className="bg-white">
      {/* 게임 정보 */}
      <div className="flex gap-4 p-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {game.thumbnail ? (
            <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🎲</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">{game.title}</h1>
          {game.titleEn && (
            <p className="text-sm text-gray-400 truncate">{game.titleEn}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {game.minPlayers === game.maxPlayers
                ? `${game.minPlayers}명`
                : `${game.minPlayers}-${game.maxPlayers}명`}
            </span>
            {(game.minPlayTime || game.maxPlayTime) && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {game.minPlayTime && game.maxPlayTime && game.minPlayTime !== game.maxPlayTime
                  ? `${game.minPlayTime}-${game.maxPlayTime}분`
                  : `${game.maxPlayTime ?? game.minPlayTime}분`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 플레이 요약 */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">첫 플레이:</span>
          <span className="font-semibold text-gray-900">
            {firstPlayedAt ? formatDate(firstPlayedAt) : "-"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 플레이 횟수:</span>
          <span className="font-semibold text-gray-900">{totalPlays}회</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">내 평가 평점:</span>
          <span className="font-semibold text-gray-900">
            {myRating != null ? (
              <>
                <span className="text-amber-400">★</span>
                {(myRating / 2).toFixed(2)}
              </>
            ) : (
              "-"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
