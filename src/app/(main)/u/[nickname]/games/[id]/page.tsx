"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import GameRecordHeader from "@/components/my/GameRecordHeader";
import ScoreStatsTable from "@/components/my/ScoreStatsTable";
import PlayerStatsTable from "@/components/my/PlayerStatsTable";
import PlayerCountRatings from "@/components/my/PlayerCountRatings";
import LocationStats from "@/components/my/LocationStats";
import GamePlayLogList from "@/components/my/GamePlayLogList";
import { getProfileByNickname } from "@/lib/api/publicProfile";
import { getGameStats, getGamePlayLogs } from "@/lib/api/gameStats";
import { ROUTES } from "@/constants";

export default function PublicGameDetailPage() {
  const params = useParams();
  const nickname = decodeURIComponent(params.nickname as string);
  const gameId = params.id as string;
  const [logPage, setLogPage] = useState(0);

  const { data: profile } = useQuery({
    queryKey: ["users", "byNickname", nickname],
    queryFn: () => getProfileByNickname(nickname),
  });

  const userId = profile?.id;

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["users", "gameStats", userId, gameId],
    queryFn: () => getGameStats(userId!, gameId),
    enabled: !!userId,
  });

  const { data: logsData } = useQuery({
    queryKey: ["users", "gamePlayLogs", userId, gameId, logPage],
    queryFn: () => getGamePlayLogs(userId!, gameId, logPage),
    enabled: !!userId,
  });

  if (statsLoading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href={ROUTES.USER_PROFILE(nickname)} className="text-gray-500 hover:text-gray-700">
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
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href={ROUTES.USER_PROFILE(nickname)} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 truncate">
          {profile?.nickname}의 {stats.game.title}
        </h1>
      </div>

      <div className="max-w-screen-lg mx-auto space-y-2">
        <GameRecordHeader stats={stats} />
        <ScoreStatsTable scoreStats={stats.scoreStats} />
        <PlayerStatsTable playerStats={stats.playerStats} />
        <PlayerCountRatings data={stats.playerCountRatings} />
        <LocationStats data={stats.locationStats} />
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
