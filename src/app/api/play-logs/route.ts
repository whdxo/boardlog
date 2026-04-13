import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── POST /api/play-logs ───────────────────────────────────────
// 로그인 필수. 플레이 로그 생성.
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const {
      gameId,
      playedAt,
      players,
      playerCount,
      location,
      duration,
      rating,
      memo,
      scores,
      visibility = "public",
    } = body as {
      gameId?: string;
      playedAt?: string;
      players?: string[];
      playerCount?: number;
      location?: string;
      duration?: number;
      rating?: number;
      memo?: string;
      scores?: { playerName: string; score: number; isWinner?: boolean }[];
      visibility?: "public" | "private";
    };

    if (!gameId) {
      return fail(API_ERROR.INVALID_PARAMS, "gameId가 필요합니다", 400);
    }
    if (!playedAt) {
      return fail(API_ERROR.INVALID_PARAMS, "playedAt이 필요합니다", 400);
    }
    if (!["public", "private"].includes(visibility)) {
      return fail(API_ERROR.INVALID_PARAMS, "visibility는 public 또는 private이어야 합니다", 400);
    }

    // 플레이 로그 생성
    const { data: log, error: logError } = await supabase
      .from("play_logs")
      .insert({
        user_id: user.id,
        game_id: gameId,
        played_at: playedAt,
        players: players ?? [],
        player_count: playerCount ?? null,
        location: location ?? null,
        duration: duration ?? null,
        rating: rating ?? null,
        memo: memo ?? null,
        visibility,
      })
      .select("id")
      .single();

    if (logError) throw logError;

    // 점수 기록 저장
    if (scores && scores.length > 0) {
      const { error: scoresError } = await supabase
        .from("play_log_scores")
        .insert(
          scores.map((s) => ({
            play_log_id: log.id,
            player_name: s.playerName,
            score: s.score,
            is_winner: s.isWinner ?? false,
          }))
        );

      if (scoresError) throw scoresError;
    }

    return ok({ id: log.id }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
