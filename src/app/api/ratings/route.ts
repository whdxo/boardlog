import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── POST /api/ratings ─────────────────────────────────────────
// 로그인 필수. 평점 저장/수정 (upsert). 저장 후 avg_rating 갱신.
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const { gameId, score } = body as { gameId?: string; score?: number };

    if (!gameId) {
      return fail(API_ERROR.INVALID_PARAMS, "gameId가 필요합니다", 400);
    }
    if (score === undefined || score < 1 || score > 10 || (score * 2) % 1 !== 0) {
      return fail(API_ERROR.INVALID_PARAMS, "평점은 1~10 사이의 0.5 단위 숫자여야 합니다", 400);
    }

    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        { user_id: user.id, game_id: gameId, score },
        { onConflict: "user_id,game_id" }
      )
      .select("id, user_id, game_id, score, created_at, updated_at")
      .single();

    if (error) throw error;
    // avg_rating / rating_count는 DB 트리거(ratings_update_avg)가 자동 갱신

    return ok({
      id: data.id,
      userId: data.user_id,
      gameId: data.game_id,
      score: data.score,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── DELETE /api/ratings ───────────────────────────────────────
// 로그인 필수. 평점 삭제 후 avg_rating 재계산.
export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return fail(API_ERROR.INVALID_PARAMS, "gameId가 필요합니다", 400);
    }

    const { error } = await supabase
      .from("ratings")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);

    if (error) throw error;
    // avg_rating / rating_count는 DB 트리거(ratings_update_avg)가 자동 갱신

    return ok({ gameId });
  } catch (e) {
    return handleApiError(e);
  }
}
