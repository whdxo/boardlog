import { createClient } from "@/lib/supabase/client";
import type {
  GameStats,
  PlayerStatRow,
  PlayerCountRating,
  LocationStat,
  Game,
} from "@/types";

function toGame(row: Record<string, unknown>): Game {
  return {
    id: row.id as string,
    title: row.title as string,
    titleEn: (row.title_en as string) ?? undefined,
    thumbnail: (row.thumbnail as string) ?? "",
    minPlayers: row.min_players as number,
    maxPlayers: row.max_players as number,
    minPlayTime: (row.min_play_time as number) ?? undefined,
    maxPlayTime: (row.max_play_time as number) ?? undefined,
    avgRating: (row.avg_rating as number) ?? undefined,
    description: (row.description as string) ?? undefined,
    designer: (row.designer as string) ?? undefined,
    publisher: (row.publisher as string) ?? undefined,
  };
}

export async function getGameStats(
  userId: string,
  gameId: string
): Promise<GameStats> {
  const supabase = createClient();

  // 1. Game info
  const { data: gameRow } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  const game = gameRow ? toGame(gameRow) : {
    id: gameId, title: "알 수 없는 게임", thumbnail: "", minPlayers: 0, maxPlayers: 0,
  };

  // 2. Play summary
  const { data: logs } = await supabase
    .from("play_logs")
    .select("id, played_at, player_count, rating, location")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("played_at", { ascending: true });

  const playLogs = logs ?? [];
  const firstPlayedAt = playLogs.length > 0 ? playLogs[0].played_at : null;
  const totalPlays = playLogs.length;

  // 3. My rating
  const { data: ratingRow } = await supabase
    .from("ratings")
    .select("score")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .maybeSingle();

  const myRating = ratingRow?.score ?? null;

  // 4. Scores from play_log_scores
  const logIds = playLogs.map((l) => l.id);
  let allScores: { play_log_id: string; player_name: string; score: number; is_winner: boolean }[] = [];

  if (logIds.length > 0) {
    const { data: scores } = await supabase
      .from("play_log_scores")
      .select("play_log_id, player_name, score, is_winner")
      .in("play_log_id", logIds);
    allScores = scores ?? [];
  }

  // Score stats
  const scoreValues = allScores.map((s) => s.score).filter((s) => s != null);
  const highest = scoreValues.length > 0 ? Math.max(...scoreValues) : null;
  const lowest = scoreValues.length > 0 ? Math.min(...scoreValues) : null;
  const average =
    scoreValues.length > 0
      ? Math.round((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) * 10) / 10
      : null;

  // Most winner
  const winnerCounts: Record<string, number> = {};
  for (const s of allScores) {
    if (s.is_winner) {
      winnerCounts[s.player_name] = (winnerCounts[s.player_name] ?? 0) + 1;
    }
  }
  const winnerEntries = Object.entries(winnerCounts);
  const mostWinner =
    winnerEntries.length > 0
      ? winnerEntries.sort((a, b) => b[1] - a[1])[0]
      : null;

  // 5. Player stats
  const playerMap: Record<string, { plays: number; wins: number; scores: number[]; highScore: number }> = {};
  for (const s of allScores) {
    if (!playerMap[s.player_name]) {
      playerMap[s.player_name] = { plays: 0, wins: 0, scores: [], highScore: 0 };
    }
    const p = playerMap[s.player_name];
    p.plays++;
    if (s.is_winner) p.wins++;
    if (s.score != null) {
      p.scores.push(s.score);
      if (s.score > p.highScore) p.highScore = s.score;
    }
  }

  const playerStats: PlayerStatRow[] = Object.entries(playerMap)
    .map(([name, p]) => ({
      playerName: name,
      totalPlays: p.plays,
      wins: p.wins,
      winRate: p.plays > 0 ? Math.round((p.wins / p.plays) * 100) : 0,
      avgScore:
        p.scores.length > 0
          ? Math.round((p.scores.reduce((a, b) => a + b, 0) / p.scores.length) * 10) / 10
          : 0,
      highScore: p.highScore,
    }))
    .sort((a, b) => b.wins - a.wins);

  // 6. Player count ratings
  const pcMap: Record<number, { count: number; ratings: number[] }> = {};
  for (const l of playLogs) {
    if (l.player_count != null) {
      if (!pcMap[l.player_count]) pcMap[l.player_count] = { count: 0, ratings: [] };
      pcMap[l.player_count].count++;
      if (l.rating != null) pcMap[l.player_count].ratings.push(l.rating);
    }
  }

  const playerCountRatings: PlayerCountRating[] = Object.entries(pcMap)
    .map(([pc, v]) => ({
      playerCount: Number(pc),
      playCount: v.count,
      avgRating:
        v.ratings.length > 0
          ? Math.round((v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length) * 100) / 100
          : 0,
    }))
    .sort((a, b) => a.playerCount - b.playerCount);

  // 7. Location stats
  const locMap: Record<string, number> = {};
  for (const l of playLogs) {
    if (l.location) {
      locMap[l.location] = (locMap[l.location] ?? 0) + 1;
    }
  }

  const locationStats: LocationStat[] = Object.entries(locMap)
    .map(([location, playCount]) => ({ location, playCount }))
    .sort((a, b) => b.playCount - a.playCount);

  return {
    gameId,
    game,
    firstPlayedAt,
    totalPlays,
    myRating,
    scoreStats: {
      highest,
      lowest,
      average,
      mostWinner: mostWinner ? { name: mostWinner[0], wins: mostWinner[1] } : null,
    },
    playerStats,
    playerCountRatings,
    locationStats,
  };
}

export async function getGamePlayLogs(
  userId: string,
  gameId: string,
  page = 0,
  pageSize = 10
) {
  const supabase = createClient();
  const { data, count, error } = await supabase
    .from("play_logs")
    .select(
      "id, played_at, player_count, players, rating, location, duration, memo, created_at, updated_at",
      { count: "exact" }
    )
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("played_at", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasNext: (count ?? 0) > (page + 1) * pageSize,
  };
}
