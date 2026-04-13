import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── PATCH /api/profile ────────────────────────────────────────
// 로그인 필수. 본인 프로필(닉네임, bio, profile_image) 수정.
export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const { nickname, bio, profile_image } = body as {
      nickname?: string;
      bio?: string;
      profile_image?: string;
    };

    const updates: Record<string, unknown> = {};

    if (nickname !== undefined) {
      const trimmed = nickname.trim();
      if (trimmed.length < 2 || trimmed.length > 20) {
        return fail(API_ERROR.INVALID_PARAMS, "닉네임은 2~20자여야 합니다", 400);
      }

      // 중복 확인 (본인 제외)
      const { data: dup } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname", trimmed)
        .neq("id", user.id)
        .maybeSingle();

      if (dup) {
        return fail(API_ERROR.CONFLICT, "이미 사용 중인 닉네임입니다", 409);
      }

      updates.nickname = trimmed;
    }

    if (bio !== undefined) {
      updates.bio = bio.trim() || null;
    }

    if (profile_image !== undefined) {
      updates.profile_image = profile_image || null;
    }

    if (Object.keys(updates).length === 0) {
      return fail(API_ERROR.INVALID_PARAMS, "변경할 내용이 없습니다", 400);
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select("id, nickname, bio, profile_image")
      .single();

    if (error) throw error;

    return ok({
      id: profile.id,
      nickname: profile.nickname,
      bio: profile.bio,
      profileImage: profile.profile_image,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
