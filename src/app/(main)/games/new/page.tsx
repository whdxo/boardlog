import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import type { Game } from "@/types";

const MOCK_NEW: Game[] = [
  { id: "n1", title: "스카이팀", titleEn: "Sky Team", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", minPlayers: 2, maxPlayers: 2, genres: ["협력"], avgRating: 8.9, ratingCount: 340, releaseYear: 2025, price: 39000, isNew: true },
  { id: "n2", title: "크리처 컴포트", titleEn: "Creature Comforts", thumbnail: "https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=400&h=400&fit=crop", minPlayers: 1, maxPlayers: 5, genres: ["전략", "가족"], avgRating: 8.4, ratingCount: 210, releaseYear: 2025, price: 62000, isNew: true },
  { id: "n3", title: "보물을 찾아서", titleEn: "Treasure Hunt", thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop", minPlayers: 1, maxPlayers: 4, genres: ["가족", "모험"], avgRating: 8.1, ratingCount: 128, releaseYear: 2025, price: 45000, isNew: true },
  { id: "n4", title: "아레나: 더 컨테스트", titleEn: "Arena: The Contest", thumbnail: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop", minPlayers: 2, maxPlayers: 5, genres: ["전략", "전투"], avgRating: 8.2, ratingCount: 175, releaseYear: 2025, price: 72000, isNew: true },
  { id: "n5", title: "스탠리의 집", titleEn: "Stanley's House", thumbnail: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=400&fit=crop", minPlayers: 2, maxPlayers: 4, genres: ["추리", "협력"], avgRating: 7.8, ratingCount: 95, releaseYear: 2025, price: 38000, isNew: true },
  { id: "n6", title: "요새 벽돌", titleEn: "Fort", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", minPlayers: 2, maxPlayers: 4, genres: ["덱빌딩", "파티"], avgRating: 7.5, ratingCount: 88, releaseYear: 2025, price: 35000, isNew: true },
];

export default function NewGamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">신작 게임</h1>
          <span className="text-sm text-gray-400">{new Date().getFullYear()}년 최신</span>
        </div>
      </div>

      {/* 배너 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-screen-lg mx-auto px-4 py-8">
          <p className="text-sm font-medium opacity-80 mb-1">✨ NEW ARRIVALS</p>
          <h2 className="text-2xl font-bold">따끈따끈 신작 보드게임</h2>
          <p className="text-sm opacity-80 mt-1">방금 국내 출시된 최신 보드게임을 만나보세요</p>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_NEW.map((game) => (
            <Link
              key={game.id}
              href={ROUTES.GAME_DETAIL(game.id)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 border-0">NEW</Badge>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 truncate">{game.title}</h3>
                {game.titleEn && <p className="text-xs text-gray-400 truncate mt-0.5">{game.titleEn}</p>}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-xs">★</span>
                    <span className="text-xs font-medium text-gray-700">{game.avgRating?.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{game.minPlayers}~{game.maxPlayers}인</span>
                </div>
                {game.price && (
                  <p className="text-sm font-bold text-primary-600 mt-1.5">{game.price.toLocaleString()}원</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
