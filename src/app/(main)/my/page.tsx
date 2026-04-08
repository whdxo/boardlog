"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Settings, BarChart2, Grid3X3, BookOpen, Star, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogCard from "@/components/log/LogCard";
import GameCard from "@/components/game/GameCard";
import EmptyState from "@/components/common/EmptyState";
import LoginPrompt from "@/components/common/LoginPrompt";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES, COLLECTION_STATUSES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import type { PlayLog, Collection, Rating, CollectionStatus, Selection } from "@/types";

// Mock 데이터
const MOCK_USER = {
  id: "u1",
  nickname: "보드게임러버",
  bio: "보드게임과 함께하는 일상 🎲",
  profileImage: undefined as string | undefined,
  followerCount: 42,
  followingCount: 18,
};

const MOCK_STATS = {
  gameCount: 42,
  logCount: 8,
  ratingCount: 128,
  selectionCount: 5,
};

const MOCK_LOGS: PlayLog[] = [
  {
    id: "1",
    userId: "u1",
    gameId: "1",
    game: { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400" },
    playedAt: "2025-03-15",
    players: ["지수", "민준", "서연"],
    location: "보드게임 카페",
    rating: 4,
    memo: "정말 재밌었다! 다음에 또 하고 싶다.",
    createdAt: "2025-03-15T12:00:00Z",
    updatedAt: "2025-03-15T12:00:00Z",
  },
  {
    id: "2",
    userId: "u1",
    gameId: "2",
    game: { id: "2", title: "팬데믹", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    playedAt: "2025-03-10",
    players: ["민준"],
    rating: 5,
    createdAt: "2025-03-10T18:00:00Z",
    updatedAt: "2025-03-10T18:00:00Z",
  },
];

const MOCK_COLLECTIONS: Collection[] = [
  { id: "c1", userId: "u1", gameId: "1", status: "owned",     game: { id: "1", title: "카탄",    minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400", avgRating: 4.5 }, createdAt: "" },
  { id: "c2", userId: "u1", gameId: "2", status: "wishlist",  game: { id: "2", title: "팬데믹",  minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", avgRating: 4.3 }, createdAt: "" },
  { id: "c3", userId: "u1", gameId: "3", status: "completed", game: { id: "3", title: "스플렌더", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400", avgRating: 4.2 }, createdAt: "" },
  { id: "c4", userId: "u1", gameId: "4", status: "fan",       game: { id: "4", title: "윙스팬",  minPlayers: 1, maxPlayers: 5, thumbnail: "https://images.unsplash.com/photo-1570979188870-5ed9bebe4dac?w=400", avgRating: 4.7 }, createdAt: "" },
];

const MOCK_RATINGS: Rating[] = [
  { id: "r1", userId: "u1", gameId: "1", game: { id: "1", title: "카탄",   minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400" }, score: 8.5, createdAt: "", updatedAt: "" },
  { id: "r2", userId: "u1", gameId: "2", game: { id: "2", title: "팬데믹", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" }, score: 9.0, createdAt: "", updatedAt: "" },
];

const MOCK_SELECTIONS: Selection[] = [
  { id: "s1", userId: "u1", title: "협력 게임 명작 모음", description: "같이 하면 더 재미있는 게임들", isPublic: true, games: [], gameCount: 5, createdAt: "", updatedAt: "" },
  { id: "s2", userId: "u1", title: "입문자 추천 게임", isPublic: false, games: [], gameCount: 8, createdAt: "", updatedAt: "" },
];

// 월별 그룹
function groupByMonth(logs: PlayLog[]) {
  const map: Record<string, PlayLog[]> = {};
  for (const log of logs) {
    const d = new Date(log.playedAt);
    const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    if (!map[key]) map[key] = [];
    map[key].push(log);
  }
  return Object.entries(map);
}

export default function MyPage() {
  const { isLoggedIn, isLoading } = useAuthStore();
  const [collectionFilter, setCollectionFilter] = useState<CollectionStatus | "all">("all");

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt title="로그인하고 내 게임을 관리해요" description="컬렉션, 기록, 평점을 한 곳에서 관리할 수 있어요" />
      </div>
    );
  }

  const filteredCollections =
    collectionFilter === "all"
      ? MOCK_COLLECTIONS
      : MOCK_COLLECTIONS.filter((c) => c.status === collectionFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 프로필 헤더 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-lg mx-auto px-4 pt-6 pb-5">
          <div className="flex items-start gap-4">
            {/* 아바타 */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden">
              {MOCK_USER.profileImage ? (
                <Image src={MOCK_USER.profileImage} alt={MOCK_USER.nickname} width={64} height={64} className="object-cover" />
              ) : (
                MOCK_USER.nickname[0]
              )}
            </div>
            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">{MOCK_USER.nickname}</h1>
                <Link href={ROUTES.SETTINGS} className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
              {MOCK_USER.bio && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">{MOCK_USER.bio}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{MOCK_USER.followerCount}</span> 팔로워
                </span>
                <span className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{MOCK_USER.followingCount}</span> 팔로잉
                </span>
              </div>
            </div>
            <Link href={ROUTES.PROFILE_EDIT} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              프로필 수정
            </Link>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "게임", value: MOCK_STATS.gameCount, Icon: Grid3X3 },
              { label: "기록", value: MOCK_STATS.logCount, Icon: BookOpen },
              { label: "평점", value: MOCK_STATS.ratingCount, Icon: Star },
              { label: "셀렉션", value: MOCK_STATS.selectionCount, Icon: List },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* 통계 대시보드 링크 */}
          <Link
            href={ROUTES.MY_STATS}
            className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 text-sm text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            내 게임 통계 보기
          </Link>
        </div>
      </div>

      {/* 탭 */}
      <div className="max-w-screen-lg mx-auto">
        <Tabs defaultValue="collection">
          <TabsList className="w-full bg-white border-b border-gray-100 rounded-none h-auto p-0 justify-start">
            {[
              { value: "collection", label: "컬렉션" },
              { value: "logs",       label: "기록" },
              { value: "ratings",    label: "평점" },
              { value: "selections", label: "셀렉션" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 py-3 text-sm font-medium text-gray-500"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 컬렉션 탭 */}
          <TabsContent value="collection" className="mt-0">
            {/* 8종 상태 필터 칩 */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setCollectionFilter("all")}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  collectionFilter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                전체 {MOCK_COLLECTIONS.length}
              </button>
              {COLLECTION_STATUSES.map((s) => {
                const count = MOCK_COLLECTIONS.filter((c) => c.status === s.value).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s.value}
                    onClick={() => setCollectionFilter(s.value)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      collectionFilter === s.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <span>{s.emoji}</span>
                    {s.label} {count}
                  </button>
                );
              })}
            </div>

            {filteredCollections.length > 0 ? (
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {filteredCollections.map((c) => (
                  <GameCard key={c.id} game={c.game} />
                ))}
              </div>
            ) : (
              <EmptyState icon="📦" title="컬렉션이 비어있어요" description="게임을 추가해 컬렉션을 채워보세요" ctaLabel="게임 탐색하기" ctaHref={ROUTES.GAMES} />
            )}
          </TabsContent>

          {/* 기록 탭 */}
          <TabsContent value="logs" className="mt-0">
            {MOCK_LOGS.length > 0 ? (
              <div className="relative pb-20">
                {groupByMonth(MOCK_LOGS).map(([month, logs]) => (
                  <div key={month}>
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-600">{month}</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {logs.map((log) => <LogCard key={log.id} log={log} />)}
                    </div>
                  </div>
                ))}
                {/* FAB */}
                <Link
                  href={ROUTES.MY_LOGS_WRITE}
                  className="fixed bottom-20 right-4 md:bottom-8 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center z-30 hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </Link>
              </div>
            ) : (
              <EmptyState icon="📖" title="아직 기록이 없어요" description="오늘 플레이한 게임을 기록해보세요" ctaLabel="기록 작성하기" ctaHref={ROUTES.MY_LOGS_WRITE} />
            )}
          </TabsContent>

          {/* 평점 탭 */}
          <TabsContent value="ratings" className="mt-0">
            {MOCK_RATINGS.length > 0 ? (
              <div className="divide-y divide-gray-50 bg-white">
                {MOCK_RATINGS.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {r.game?.thumbnail && (
                        <Image src={r.game.thumbnail} alt={r.game?.title ?? ""} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{r.game?.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="font-bold text-gray-800">{r.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="⭐" title="아직 평점이 없어요" description="게임에 별점을 남겨보세요" ctaLabel="게임 탐색하기" ctaHref={ROUTES.GAMES} />
            )}
          </TabsContent>

          {/* 셀렉션 탭 */}
          <TabsContent value="selections" className="mt-0">
            {MOCK_SELECTIONS.length > 0 ? (
              <div className="p-4 flex flex-col gap-3">
                <Link
                  href={ROUTES.MY_SELECTIONS}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "self-end gap-1")}
                >
                  <Plus className="w-3.5 h-3.5" />
                  셀렉션 만들기
                </Link>
                {MOCK_SELECTIONS.map((sel) => (
                  <Link
                    key={sel.id}
                    href={ROUTES.MY_SELECTION_DETAIL(sel.id)}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-2xl">
                      🎲
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{sel.title}</p>
                      {sel.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{sel.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{sel.gameCount}개 게임 · {sel.isPublic ? "공개" : "비공개"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon="📋" title="셀렉션이 없어요" description="좋아하는 게임을 큐레이션해 보세요" ctaLabel="셀렉션 만들기" ctaHref={ROUTES.MY_SELECTIONS} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
