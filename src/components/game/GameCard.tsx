import Link from "next/link";
import Image from "next/image";
import { Star, Users } from "lucide-react";
import { ROUTES, GENRE_MAP } from "@/constants";
import { cn } from "@/lib/utils";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
  className?: string;
}

export default function GameCard({ game, className }: GameCardProps) {
  return (
    <Link
      href={ROUTES.GAME_DETAIL(game.id)}
      className={cn(
        "group flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {/* 썸네일 (3:4) */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            🎲
          </div>
        )}
        {/* 순위 뱃지 */}
        {game.rank && game.rank <= 1000 && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
            #{game.rank}
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="p-2.5 flex flex-col gap-1">
        {/* 장르 뱃지 */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {game.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded-md leading-none font-medium"
              >
                {GENRE_MAP[g] ?? g}
              </span>
            ))}
          </div>
        )}

        <p className="text-h3 font-semibold text-gray-900 truncate leading-tight">
          {game.title}
        </p>

        <div className="flex items-center gap-2 text-caption text-gray-500">
          {game.avgRating !== undefined && (
            <span className="flex items-center gap-0.5">
              <Star size={11} className="fill-accent-400 text-accent-400" />
              <span>{game.avgRating.toFixed(1)}</span>
              {game.ratingCount !== undefined && (
                <span className="text-gray-400">({game.ratingCount.toLocaleString()})</span>
              )}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <Users size={11} />
            {game.minPlayers === game.maxPlayers
              ? `${game.minPlayers}인`
              : `${game.minPlayers}~${game.maxPlayers}인`}
          </span>
        </div>

        {game.price !== undefined && (
          <p className="text-body font-semibold text-primary-600">
            {game.price.toLocaleString()}원
          </p>
        )}
      </div>
    </Link>
  );
}
