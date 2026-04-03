"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogCard from "@/components/log/LogCard";
import GameCard from "@/components/game/GameCard";
import EmptyState from "@/components/common/EmptyState";
import LoginPrompt from "@/components/common/LoginPrompt";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES, COLLECTION_STATUS_LABEL } from "@/constants";
import type { PlayLog, Collection, Rating, Bookmark, CollectionStatus } from "@/types";

// Mock data
const MOCK_LOGS: PlayLog[] = [
  {
    id: "1",
    userId: "u1",
    gameId: "1",
    game: { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400" },
    playedAt: "2024-03-15",
    players: ["지수", "민준", "서연"],
    location: "보드게임 카페",
    rating: 4,
    memo: "정말 재밌었다! 다음에 또 하고 싶다.",
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
  {
    id: "2",
    userId: "u1",
    gameId: "2",
    game: { id: "2", title: "팬데믹", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    playedAt: "2024-03-10",
    players: ["민준"],
    rating: 5,
    createdAt: "2024-03-10T18:00:00Z",
    updatedAt: "2024-03-10T18:00:00Z",
  },
];

const MOCK_COLLECTIONS: Collection[] = [
  { id: "c1", userId: "u1", gameId: "1", status: "owned", game: { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400", avgRating: 4.5 }, createdAt: "2024-01-01T00:00:00Z" },
  { id: "c2", userId: "u1", gameId: "2", status: "wishlist", game: { id: "2", title: "팬데믹", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", avgRating: 4.3 }, createdAt: "2024-01-02T00:00:00Z" },
  { id: "c3", userId: "u1", gameId: "3", status: "completed", game: { id: "3", title: "스플렌더", minPlayers: 2, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400", avgRating: 4.2 }, createdAt: "2024-01-03T00:00:00Z" },
];

const MOCK_RATINGS: Rating[] = [
  { id: "r1", userId: "u1", gameId: "1", score: 4, game: { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400" }, createdAt: "2024-03-01T00:00:00Z", updatedAt: "2024-03-01T00:00:00Z" },
];

// TODO: replace with actual auth
const isLoggedIn = false;

const COLLECTION_TABS: { value: CollectionStatus; label: string }[] = [
  { value: "owned", label: "보유중" },
  { value: "wishlist", label: "위시리스트" },
  { value: "completed", label: "플레이완료" },
];

function groupLogsByMonth(logs: PlayLog[]) {
  const groups: Record<string, PlayLog[]> = {};
  for (const log of logs) {
    const key = log.playedAt.slice(0, 7); // "YYYY-MM"
    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

export default function MyPage() {
  const [collectionFilter, setCollectionFilter] = useState<CollectionStatus>("owned");

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-16 flex justify-center">
        <LoginPrompt />
      </div>
    );
  }

  const filteredCollections = MOCK_COLLECTIONS.filter((c) => c.status === collectionFilter);
  const logGroups = groupLogsByMonth(MOCK_LOGS);

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 font-bold text-gray-900">내 기록</h1>
        {/* 데스크톱 기록 작성 버튼 */}
        <Link href={ROUTES.MY_LOGS_WRITE} className={cn(buttonVariants(), "hidden md:flex gap-2")}>
          <Plus size={16} />
          기록 작성
        </Link>
      </div>

      <Tabs defaultValue="logs">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="logs" className="flex-1">기록</TabsTrigger>
          <TabsTrigger value="collection" className="flex-1">컬렉션</TabsTrigger>
          <TabsTrigger value="ratings" className="flex-1">평점</TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex-1">북마크</TabsTrigger>
        </TabsList>

        {/* 기록 탭 */}
        <TabsContent value="logs">
          {MOCK_LOGS.length === 0 ? (
            <EmptyState
              icon="📝"
              title="아직 기록이 없어요"
              description="보드게임을 플레이했다면 기록을 남겨보세요"
              ctaLabel="첫 기록 작성하기"
              ctaHref={ROUTES.MY_LOGS_WRITE}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {logGroups.map(([month, logs]) => (
                <div key={month}>
                  <p className="text-caption font-semibold text-gray-500 mb-3">
                    {month.replace("-", "년 ")}월
                  </p>
                  <div className="flex flex-col gap-2">
                    {logs.map((log) => <LogCard key={log.id} log={log} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 컬렉션 탭 */}
        <TabsContent value="collection">
          {/* 서브 필터 */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {COLLECTION_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setCollectionFilter(tab.value)}
                className={cn(
                  "h-8 px-4 rounded-full text-caption font-medium border whitespace-nowrap transition-colors",
                  collectionFilter === tab.value
                    ? "bg-primary-100 border-primary-200 text-primary-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {COLLECTION_STATUS_LABEL[tab.value]}
              </button>
            ))}
          </div>

          {filteredCollections.length === 0 ? (
            <EmptyState
              icon="🎲"
              title={`${COLLECTION_STATUS_LABEL[collectionFilter]} 게임이 없어요`}
              description="게임 상세에서 컬렉션에 추가해보세요"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {filteredCollections.map((c) => (
                <GameCard key={c.id} game={c.game} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* 평점 탭 */}
        <TabsContent value="ratings">
          {MOCK_RATINGS.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="아직 평점이 없어요"
              description="게임을 플레이하고 평점을 남겨보세요"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {MOCK_RATINGS.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-semibold">{r.game.title}</p>
                    <p className="text-caption text-accent-400">{"★".repeat(r.score)}{"☆".repeat(5 - r.score)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 북마크 탭 */}
        <TabsContent value="bookmarks">
          <EmptyState
            icon="🔖"
            title="북마크한 게임이 없어요"
            description="관심 있는 게임을 북마크해보세요"
          />
        </TabsContent>
      </Tabs>

      {/* 모바일 FAB */}
      <Link
        href={ROUTES.MY_LOGS_WRITE}
        className="fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="기록 작성"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}
