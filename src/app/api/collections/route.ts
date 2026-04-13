import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

const VALID_STATUSES = ["owned", "fan", "wishlist", "completed", "preorder", "selling", "lent", "borrowed"];

// ── POST /api/collections ──────────────────────────────────────
// 로그인 필수. 컬렉션 상태 추가/변경 (upsert).
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const { gameId, status } = body as { gameId?: string; status?: string };

    if (!gameId) {
      return fail(API_ERROR.INVALID_PARAMS, "gameId가 필요합니다", 400);
    }
    if (!status || !VALID_STATUSES.includes(status)) {
      return fail(API_ERROR.INVALID_PARAMS, "유효하지 않은 상태입니다", 400);
    }

    const { data, error } = await supabase
      .from("collections")
      .upsert(
        { user_id: user.id, game_id: gameId, status },
        { onConflict: "user_id,game_id" }
      )
      .select("id, user_id, game_id, status, created_at")
      .single();

    if (error) throw error;

    return ok({
      id: data.id,
      userId: data.user_id,
      gameId: data.game_id,
      status: data.status,
      createdAt: data.created_at,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── DELETE /api/collections ────────────────────────────────────
// 로그인 필수. 컬렉션에서 게임 제거.
export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return fail(API_ERROR.INVALID_PARAMS, "gameId가 필요합니다", 400);
    }

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);

    if (error) throw error;

    return ok({ gameId });
  } catch (e) {
    return handleApiError(e);
  }
}
