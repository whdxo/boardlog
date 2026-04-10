"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2, Grid3X3 } from "lucide-react";
import Link from "next/link";
import CollectionCategoryBar from "@/components/my/CollectionCategoryBar";
import CollectionList from "@/components/my/CollectionList";
import EmptyState from "@/components/common/EmptyState";
import { getProfileByNickname } from "@/lib/api/publicProfile";
import { getCollectionCounts, getCollectionGames } from "@/lib/api/collection";
import { ROUTES } from "@/constants";
import type { CollectionStatus } from "@/types";

export default function PublicProfilePage() {
  const params = useParams();
  const nickname = decodeURIComponent(params.nickname as string);
  const [collectionFilter, setCollectionFilter] = useState<CollectionStatus | "all">("all");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["users", "byNickname", nickname],
    queryFn: () => getProfileByNickname(nickname),
  });

  const userId = profile?.id;

  const { data: countsData } = useQuery({
    queryKey: ["users", "collectionCounts", userId],
    queryFn: () => getCollectionCounts(userId!),
    enabled: !!userId,
  });

  const { data: collectionData } = useQuery({
    queryKey: ["users", "collectionGames", userId, collectionFilter],
    queryFn: () => getCollectionGames(userId!, collectionFilter),
    enabled: !!userId,
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었어요!");
    } catch {
      // fallback
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmptyState icon="😕" title="사용자를 찾을 수 없어요" ctaLabel="홈으로 돌아가기" ctaHref={ROUTES.HOME} />
      </div>
    );
  }

  const collections = collectionData?.data ?? [];
  const counts = countsData?.counts ?? {};
  const total = countsData?.total ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-lg mx-auto px-4 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden">
              {profile.profile_image ? (
                <Image src={profile.profile_image} alt={profile.nickname} width={64} height={64} className="object-cover" />
              ) : (
                profile.nickname[0]
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900">{profile.nickname}</h1>
              {profile.bio && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">{profile.bio}</p>
              )}
            </div>
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 bg-gray-50 rounded-xl p-3">
            <Grid3X3 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              컬렉션 <span className="font-bold text-gray-900">{total}</span>개
            </span>
          </div>
        </div>
      </div>

      {/* 컬렉션 */}
      <div className="max-w-screen-lg mx-auto">
        <CollectionCategoryBar
          counts={counts}
          total={total}
          selected={collectionFilter}
          onSelect={setCollectionFilter}
        />

        {collections.length > 0 ? (
          <CollectionList collections={collections} isOwner={false} />
        ) : (
          <EmptyState
            icon="📦"
            title="컬렉션이 비어있어요"
          />
        )}
      </div>
    </div>
  );
}
