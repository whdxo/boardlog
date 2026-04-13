import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── GET /api/users/[userId]/follow ────────────────────────────
// 팔로우 여부 확인. 비로그인이면 { isFollowing: false }
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return ok({ isFollowing: false });
    }

    const { data } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", userId)
      .maybeSingle();

    return ok({ isFollowing: !!data });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── POST /api/users/[userId]/follow ───────────────────────────
// 팔로우. 본인 팔로우 불가, 중복 팔로우 불가.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { supabase, user } = await requireUser();

    if (user.id === userId) {
      return fail(API_ERROR.INVALID_PARAMS, "본인을 팔로우할 수 없습니다", 400);
    }

    // 팔로우 대상 존재 확인
    const { data: target } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!target) {
      return fail(API_ERROR.NOT_FOUND, "유저를 찾을 수 없습니다", 404);
    }

    // 중복 확인
    const { data: existing } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", userId)
      .maybeSingle();

    if (existing) {
      return fail(API_ERROR.CONFLICT, "이미 팔로우하고 있습니다", 409);
    }

    // 팔로우 생성
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: userId });

    if (error) throw error;

    // follower_count / following_count 캐시 갱신
    const [{ count: followingCount }, { count: followerCount }] = await Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
    ]);
    await Promise.all([
      supabase.from("profiles").update({ following_count: followingCount ?? 0 }).eq("id", user.id),
      supabase.from("profiles").update({ follower_count: followerCount ?? 0 }).eq("id", userId),
    ]);

    return ok({ isFollowing: true }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}

// ── DELETE /api/users/[userId]/follow ─────────────────────────
// 언팔로우.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { supabase, user } = await requireUser();

    const { error, count } = await supabase
      .from("follows")
      .delete({ count: "exact" })
      .eq("follower_id", user.id)
      .eq("following_id", userId);

    if (error) throw error;

    if (!count || count === 0) {
      return fail(API_ERROR.NOT_FOUND, "팔로우 관계를 찾을 수 없습니다", 404);
    }

    // follower_count / following_count 캐시 갱신
    const [{ count: followingCount }, { count: followerCount }] = await Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
    ]);
    await Promise.all([
      supabase.from("profiles").update({ following_count: followingCount ?? 0 }).eq("id", user.id),
      supabase.from("profiles").update({ follower_count: followerCount ?? 0 }).eq("id", userId),
    ]);

    return ok({ isFollowing: false });
  } catch (e) {
    return handleApiError(e);
  }
}
