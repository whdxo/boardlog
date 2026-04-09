"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Clock, Star, BookOpen } from "lucide-react";
import StarRating from "@/components/common/StarRating";
import PurchaseBar from "@/components/game/PurchaseBar";
import PurchaseSideCard from "@/components/game/PurchaseSideCard";
import RatingModal from "@/components/game/RatingModal";
import { CollectionSheet } from "@/components/game/CollectionSheet";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { COLLECTION_STATUS_LABEL } from "@/constants";
import type { Game, CollectionStatus } from "@/types";

async function fetchGame(id: string): Promise<Game | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    titleEn: data.title_en ?? undefined,
    thumbnail: data.thumbnail ?? "",
    description: data.description ?? undefined,
    designer: data.designer ?? undefined,
    publisher: data.publisher ?? undefined,
    releaseYear: data.release_year ?? undefined,
    minPlayers: data.min_players,
    maxPlayers: data.max_players,
    minPlayTime: data.min_play_time ?? undefined,
    maxPlayTime: data.max_play_time ?? undefined,
    minAge: data.min_age ?? undefined,
    genres: data.genres ?? [],
    avgRating: data.avg_rating ? Number(data.avg_rating) : undefined,
    ratingCount: data.rating_count ?? undefined,
    price: data.price ?? undefined,
    bggId: data.bgg_id ?? undefined,
  };
}

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = use(params);

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id),
  });

  const [ratingOpen, setRatingOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [myRating, setMyRating] = useState<number | undefined>();
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

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
