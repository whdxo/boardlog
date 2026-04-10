"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import GameRecordHeader from "@/components/my/GameRecordHeader";
import ScoreStatsTable from "@/components/my/ScoreStatsTable";
import PlayerStatsTable from "@/components/my/PlayerStatsTable";
import PlayerCountRatings from "@/components/my/PlayerCountRatings";
import LocationStats from "@/components/my/LocationStats";
import GamePlayLogList from "@/components/my/GamePlayLogList";
import LoginPrompt from "@/components/common/LoginPrompt";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import { useGameStats, useGamePlayLogs } from "@/hooks/useGameStats";

export default function MyGameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const { isLoggedIn, isLoading, user } = useAuthStore();
  const [logPage, setLogPage] = useState(0);

  const userId = user?.id;
  const { data: stats, isLoading: statsLoading } = useGameStats(userId, gameId);
  const { data: logsData } = useGamePlayLogs(userId, gameId, logPage);

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt title="로그인이 필요해요" description="내 게임 기록을 확인하려면 로그인해주세요" />
      </div>
    );
  }

  if (statsLoading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href={ROUTES.MY} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-base font-semibold text-gray-900">게임 기록</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href={ROUTES.MY} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 truncate">
          {stats.game.title}
        </h1>
      </div>

      <div className="max-w-screen-lg mx-auto space-y-2">
        {/* 게임 정보 + 플레이 요약 */}
        <GameRecordHeader stats={stats} />

        {/* 점수 통계 */}
        <ScoreStatsTable scoreStats={stats.scoreStats} />

        {/* 플레이어 통계 */}
        <PlayerStatsTable playerStats={stats.playerStats} />

        {/* 인원별 평점 */}
        <PlayerCountRatings data={stats.playerCountRatings} />

        {/* 장소 통계 */}
        <LocationStats data={stats.locationStats} />

        {/* 플레이 로그 */}
        <GamePlayLogList
          logs={logsData?.data ?? []}
          total={logsData?.total ?? 0}
          page={logPage}
          onPageChange={setLogPage}
        />
      </div>
    </div>
  );
}
