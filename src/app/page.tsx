"use client";

import Link from "next/link";
import GNB from "@/components/layout/GNB";
import TabBar from "@/components/layout/TabBar";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/common/SearchBar";
import BannerSlide from "@/components/game/BannerSlide";
import GameGrid from "@/components/game/GameGrid";
import LoginPrompt from "@/components/common/LoginPrompt";
import { ROUTES } from "@/constants";
import type { BannerItem } from "@/components/game/BannerSlide";
import type { Game } from "@/types";

// Mock data — replace with API calls
const MOCK_BANNERS: BannerItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1200",
    title: "지금 인기 있는 보드게임",
    subtitle: "이번 주 가장 많이 플레이된 게임들을 확인해보세요",
    ctaLabel: "탐색하기",
    ctaHref: ROUTES.GAMES,
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=1200",
    title: "전략 게임의 세계",
    subtitle: "두뇌를 자극하는 전략 보드게임 추천",
    ctaLabel: "보러가기",
    ctaHref: ROUTES.GAMES,
  },
];

const MOCK_POPULAR: Game[] = [
  {
    id: "1",
    title: "카탄",
    minPlayers: 3,
    maxPlayers: 4,
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400",
    avgRating: 4.5,
    price: 45000,
  },
  {
    id: "2",
    title: "팬데믹",
    minPlayers: 2,
    maxPlayers: 4,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    avgRating: 4.3,
    price: 42000,
  },
  {
    id: "3",
    title: "스플렌더",
    minPlayers: 2,
    maxPlayers: 4,
    thumbnail: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400",
    avgRating: 4.2,
    price: 38000,
  },
  {
    id: "4",
    title: "아컴 호러",
    minPlayers: 1,
    maxPlayers: 6,
    thumbnail: "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400",
    avgRating: 4.7,
    price: 72000,
  },
];

const MOCK_RECOMMENDED: Game[] = [
  {
    id: "5",
    title: "도미니언",
    minPlayers: 2,
    maxPlayers: 4,
    thumbnail: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400",
    avgRating: 4.1,
    price: 35000,
  },
  {
    id: "6",
    title: "7 원더스",
    minPlayers: 2,
    maxPlayers: 7,
    thumbnail: "https://images.unsplash.com/photo-1615680022648-2db11101c73a?w=400",
    avgRating: 4.4,
    price: 48000,
  },
  {
    id: "7",
    title: "레시클라",
    minPlayers: 2,
    maxPlayers: 5,
    thumbnail: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400",
    avgRating: 3.9,
    price: 28000,
  },
  {
    id: "8",
    title: "코드네임",
    minPlayers: 2,
    maxPlayers: 8,
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
    avgRating: 4.6,
    price: 25000,
  },
];

// TODO: 실제 인증 연동 후 user 상태 주입
const user = null;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GNB user={user} />

      <main className="flex-1 pb-14 md:pb-0">
        <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-10">
          {/* 검색바 — readOnly, 클릭 시 탐색 페이지로 이동 */}
          <Link href={ROUTES.GAMES} className="block">
            <SearchBar
              value=""
              onChange={() => {}}
              readOnly
              placeholder="게임 이름을 검색해보세요"
            />
          </Link>

          {/* 배너 슬라이드 */}
          <BannerSlide items={MOCK_BANNERS} />

          {/* 인기 게임 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h1 font-bold text-gray-900">인기 게임</h2>
              <Link href={ROUTES.GAMES} className="text-caption text-primary-500 hover:underline">
                더보기
              </Link>
            </div>
            <GameGrid games={MOCK_POPULAR} />
          </section>

          {/* 최근 기록 / 로그인 유도 */}
          <section>
            {user ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h1 font-bold text-gray-900">최근 기록</h2>
                  <Link href={ROUTES.MY} className="text-caption text-primary-500 hover:underline">
                    전체보기
                  </Link>
                </div>
                {/* 실제 데이터 연동 시 LogCard 렌더 */}
                <p className="text-caption text-gray-400 text-center py-8">최근 기록이 없어요</p>
              </div>
            ) : (
              <LoginPrompt />
            )}
          </section>

          {/* 추천 게임 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h1 font-bold text-gray-900">추천 게임</h2>
              <Link href={ROUTES.GAMES} className="text-caption text-primary-500 hover:underline">
                더보기
              </Link>
            </div>
            <GameGrid games={MOCK_RECOMMENDED} />
          </section>
        </div>
      </main>

      <Footer />
      <TabBar />
    </div>
  );
}
