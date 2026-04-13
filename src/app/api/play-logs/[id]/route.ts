import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── GET /api/play-logs/[id] ────────────────────────────────────
// public이면 누구나, private이면 본인만 조회 가능.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: log, error } = await supabase
      .from("play_logs")
      .select(
        "id, user_id, game_id, played_at, players, player_count, location, duration, rating, memo, visibility, created_at, updated_at, games!game_id(id, title, thumbnail), play_log_scores(id, player_name, score, is_winner)"
      )
      .eq("id", id)
      .single();

    if (error || !log) {
      return fail(API_ERROR.NOT_FOUND, "플레이 로그를 찾을 수 없습니다", 404);
    }

    // private 로그는 본인만
    if (log.visibility === "private" && log.user_id !== user?.id) {
      return fail(API_ERROR.FORBIDDEN, "비공개 로그입니다", 403);
    }

    const game = Array.isArray(log.games) ? log.games[0] : log.games;

    return ok({
      id: log.id,
      userId: log.user_id,
      gameId: log.game_id,
      game: game ?? null,
      playedAt: log.played_at,
      players: log.players,
      playerCount: log.player_count,
      location: log.location,
      duration: log.duration,
      rating: log.rating,
      memo: log.memo,
      visibility: log.visibility,
      scores: (log.play_log_scores ?? []).map((s: { id: string; player_name: string; score: number; is_winner: boolean }) => ({
        playerName: s.player_name,
        score: s.score,
        isWinner: s.is_winner,
      })),
      createdAt: log.created_at,
      updatedAt: log.updated_at,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── PATCH /api/play-logs/[id] ──────────────────────────────────
// 로그인 필수. 본인 로그만 수정.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser();
    const body = await request.json();

    // 소유권 확인
    const { data: existing, error: fetchError } = await supabase
      .from("play_logs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return fail(API_ERROR.NOT_FOUND, "플레이 로그를 찾을 수 없습니다", 404);
    }
    if (existing.user_id !== user.id) {
      return fail(API_ERROR.FORBIDDEN, "수정 권한이 없습니다", 403);
    }

    const {
      playedAt,
      players,
      playerCount,
      location,
      duration,
      rating,
      memo,
      scores,
      visibility,
    } = body as {
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

    const updates: Record<string, unknown> = {};
    if (playedAt !== undefined) updates.played_at = playedAt;
    if (players !== undefined) updates.players = players;
    if (playerCount !== undefined) updates.player_count = playerCount;
    if (location !== undefined) updates.location = location;
    if (duration !== undefined) updates.duration = duration;
    if (rating !== undefined) updates.rating = rating;
    if (memo !== undefined) updates.memo = memo;
    if (visibility !== undefined) {
      if (!["public", "private"].includes(visibility)) {
        return fail(API_ERROR.INVALID_PARAMS, "visibility는 public 또는 private이어야 합니다", 400);
      }
      updates.visibility = visibility;
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from("play_logs").update(updates).eq("id", id);
      if (error) throw error;
    }

    // scores 재동기화 (전달된 경우)
    if (scores !== undefined) {
      await supabase.from("play_log_scores").delete().eq("play_log_id", id);
      if (scores.length > 0) {
        await supabase.from("play_log_scores").insert(
          scores.map((s) => ({
            play_log_id: id,
            player_name: s.playerName,
            score: s.score,
            is_winner: s.isWinner ?? false,
          }))
        );
      }
    }

    return ok({ id });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── DELETE /api/play-logs/[id] ─────────────────────────────────
// 로그인 필수. 본인 로그만 삭제.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser();

    // 소유권 확인
    const { data: existing, error: fetchError } = await supabase
      .from("play_logs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return fail(API_ERROR.NOT_FOUND, "플레이 로그를 찾을 수 없습니다", 404);
    }
    if (existing.user_id !== user.id) {
      return fail(API_ERROR.FORBIDDEN, "삭제 권한이 없습니다", 403);
    }

    // play_log_scores는 FK CASCADE로 자동 삭제
    const { error } = await supabase.from("play_logs").delete().eq("id", id);
    if (error) throw error;

    return ok({ id });
  } catch (e) {
    return handleApiError(e);
  }
}
