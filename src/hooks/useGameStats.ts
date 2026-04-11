"use client";

import { useQuery } from "@tanstack/react-query";
import { getGameStats, getGamePlayLogs } from "@/lib/api/gameStats";

export function useGameStats(userId: string | undefined, gameId: string | undefined) {
  return useQuery({
    queryKey: ["my", "gameStats", userId, gameId],
    queryFn: () => getGameStats(userId!, gameId!),
    enabled: !!userId && !!gameId,
  });
}

export function useGamePlayLogs(
  userId: string | undefined,
  gameId: string | undefined,
  page = 0
) {
  return useQuery({
    queryKey: ["my", "gamePlayLogs", userId, gameId, page],
    queryFn: () => getGamePlayLogs(userId!, gameId!, page),
    enabled: !!userId && !!gameId,
  });
}
