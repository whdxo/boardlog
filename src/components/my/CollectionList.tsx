"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { CollectionGameRow } from "@/lib/api/collection";

interface CollectionListProps {
  collections: CollectionGameRow[];
  isOwner?: boolean;
}

export default function CollectionList({ collections, isOwner = true }: CollectionListProps) {
  const [sort, setSort] = useState<"newest" | "name">("newest");

  const sorted = [...collections].sort((a, b) => {
    if (sort === "name") return a.games.title.localeCompare(b.games.title);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div>
      {/* 정렬 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700">
          내 전체 컬렉션
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "name")}
          className="text-xs text-gray-500 bg-transparent border-none outline-none cursor-pointer"
        >
          <option value="newest">최신순</option>
          <option value="name">이름순</option>
        </select>
      </div>

      {/* 게임 목록 */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {sorted.map((c) => (
          <CollectionGameCard key={c.id} item={c} isOwner={isOwner} />
        ))}
      </div>
    </div>
  );
}

function CollectionGameCard({
  item,
  isOwner,
}: {
  item: CollectionGameRow;
  isOwner: boolean;
}) {
  const g = item.games;
  const href = isOwner
    ? ROUTES.MY_GAME_DETAIL(g.id)
    : ROUTES.GAME_DETAIL(g.id);

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        {g.thumbnail ? (
          <Image
            src={g.thumbnail}
            alt={g.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            🎲
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-2.5 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
          {g.title}
        </p>
        {g.title_en && (
          <p className="text-xs text-gray-400 truncate">{g.title_en}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          {g.avg_rating != null && (
            <span className="flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {g.avg_rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <Users size={11} />
            {g.min_players === g.max_players
              ? `${g.min_players}인`
              : `${g.min_players}~${g.max_players}인`}
          </span>
        </div>
      </div>
    </Link>
  );
}
