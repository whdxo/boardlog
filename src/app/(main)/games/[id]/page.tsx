"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { Users, Clock, Star, BookOpen } from "lucide-react";
import StarRating from "@/components/common/StarRating";
import PurchaseBar from "@/components/game/PurchaseBar";
import PurchaseSideCard from "@/components/game/PurchaseSideCard";
import RatingModal from "@/components/game/RatingModal";
import { CollectionSheet } from "@/components/game/CollectionSheet";
import { Badge } from "@/components/ui/badge";
import { COLLECTION_STATUS_LABEL } from "@/constants";
import type { Game, CollectionStatus } from "@/types";

// Mock game data
const MOCK_GAMES: Record<string, Game> = {
  "1": { id: "1", title: "카탄", titleEn: "Catan", minPlayers: 3, maxPlayers: 4, minPlayTime: 60, maxPlayTime: 120, minAge: 10, genres: ["전략", "경제"], thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800", avgRating: 4.5, ratingCount: 1243, price: 45000, description: "카탄은 섬 카탄을 배경으로 한 전략 보드게임입니다. 플레이어들은 자원을 수집하고 교역하며 섬을 개척해 나갑니다. 최대 4명이 함께 즐길 수 있으며 협상과 전략이 핵심입니다." },
  "2": { id: "2", title: "팬데믹", titleEn: "Pandemic", minPlayers: 2, maxPlayers: 4, minPlayTime: 45, maxPlayTime: 75, minAge: 8, genres: ["협력", "전략"], thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", avgRating: 4.3, ratingCount: 987, price: 42000, description: "팬데믹은 전세계를 위협하는 전염병을 막기 위해 플레이어들이 협력하는 협동 보드게임입니다." },
};

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = use(params);
  const game = MOCK_GAMES[id];

  const [ratingOpen, setRatingOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [myRating, setMyRating] = useState<number | undefined>();
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus | null>(null);

  if (!game) notFound();

  return (
    <>
      <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-8">
          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* 게임 헤더 */}
            <div className="flex gap-5">
              <div className="relative w-28 h-36 md:w-40 md:h-52 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {game.thumbnail && (
                  <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2 justify-center">
                <div className="flex flex-wrap gap-1.5">
                  {game.genres?.map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                </div>
                <h1 className="text-h1 md:text-display font-bold text-gray-900">{game.title}</h1>
                {game.titleEn && (
                  <p className="text-caption text-gray-400">{game.titleEn}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-1">
                  {game.avgRating && (
                    <span className="flex items-center gap-1 text-caption">
                      <Star size={14} className="text-accent-400 fill-accent-400" />
                      <span className="font-semibold text-gray-900">{game.avgRating}</span>
                      <span className="text-gray-400">({game.ratingCount?.toLocaleString()})</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-caption text-gray-600">
                    <Users size={14} />
                    {game.minPlayers}~{game.maxPlayers}인
                  </span>
                  {game.minPlayTime && (
                    <span className="flex items-center gap-1 text-caption text-gray-600">
                      <Clock size={14} />
                      {game.minPlayTime}~{game.maxPlayTime}분
                    </span>
                  )}
                  {game.minAge && (
                    <span className="flex items-center gap-1 text-caption text-gray-600">
                      <BookOpen size={14} />
                      {game.minAge}세 이상
                    </span>
                  )}
                </div>

                {/* 모바일: 내 활동 버튼 */}
                <div className="flex gap-2 mt-2 md:hidden">
                  <button
                    type="button"
                    className="flex-1 h-9 rounded-xl border border-gray-200 text-caption font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    onClick={() => setCollectionOpen(true)}
                  >
                    {collectionStatus
                      ? COLLECTION_STATUS_LABEL[collectionStatus]
                      : "+ 컬렉션"}
</button>
                  <button
                    type="button"
                    className="flex-1 h-9 rounded-xl border border-gray-200 text-caption font-medium text-accent-400 hover:border-accent-400 transition-colors"
                    onClick={() => setRatingOpen(true)}
                  >
                    {myRating ? `★ ${myRating}점` : "★ 평점"}
                  </button>
                </div>
              </div>
            </div>

            {/* 게임 소개 */}
            {game.description && (
              <section>
                <h2 className="text-body font-bold text-gray-900 mb-3">게임 소개</h2>
                <p className="text-body text-gray-600 leading-relaxed">{game.description}</p>
              </section>
            )}

            {/* 커뮤니티 평점 */}
            {game.avgRating && (
              <section>
                <h2 className="text-body font-bold text-gray-900 mb-3">커뮤니티 평점</h2>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-display font-bold text-primary-500">{game.avgRating}</p>
                    <StarRating value={Math.round(game.avgRating)} readOnly size={16} />
                    <p className="text-tiny text-gray-400 mt-1">{game.ratingCount?.toLocaleString()}명 평가</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* 데스크톱 사이드 카드 */}
          <PurchaseSideCard
            price={game.price ?? 0}
            purchaseUrl={game.purchaseUrl}
            collectionStatus={collectionStatus ?? undefined}
            onCollectionClick={() => setCollectionOpen(true)}
            onRatingClick={() => setRatingOpen(true)}
            myRating={myRating}
          />
        </div>
      </div>

      {/* 모바일 구매 바 */}
      {game.price && (
        <PurchaseBar
          price={game.price}
          purchaseUrl={game.purchaseUrl}
          onAddToWishlist={() => setCollectionOpen(true)}
        />
      )}

      {/* 평점 모달 */}
      <RatingModal
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
        gameName={game.title}
        initialRating={myRating}
        onSave={setMyRating}
        onDelete={myRating ? () => setMyRating(undefined) : undefined}
      />

      {/* 컬렉션 시트 */}
      <CollectionSheet
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
        currentStatus={collectionStatus}
        onSelect={setCollectionStatus}
      />
    </>
  );
}
