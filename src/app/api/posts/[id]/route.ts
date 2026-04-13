import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";
import type { PostCategory } from "@/types";

// ── GET /api/posts/[id] ────────────────────────────────────────
// 공개. 상세 조회 + view_count +1
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: row, error } = await supabase
      .from("posts")
      .select(
        "id, user_id, category, title, content, images, like_count, comment_count, view_count, created_at, updated_at, profiles!user_id(id, nickname, profile_image, bio)"
      )
      .eq("id", id)
      .single();

    if (error || !row) {
      return fail(API_ERROR.NOT_FOUND, "게시글을 찾을 수 없습니다", 404);
    }

    // 조회수 원자적 증가
    await supabase.rpc("increment_view_count", { post_id: id });

    // isLiked 확인
    let isLiked = false;
    if (user) {
      const { data: like } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("post_id", id)
        .maybeSingle();

      isLiked = !!like;
    }

    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return ok({
      id: row.id,
      userId: row.user_id,
      user: profile
        ? {
            id: profile.id,
            nickname: profile.nickname,
            profileImage: profile.profile_image,
            bio: profile.bio,
          }
        : null,
      category: row.category,
      title: row.title,
      content: row.content,
      images: row.images,
      likeCount: row.like_count,
      commentCount: row.comment_count,
      viewCount: row.view_count + 1,
      isLiked,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── PATCH /api/posts/[id] ──────────────────────────────────────
// 로그인 필수. 본인 게시글만 수정.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const { category, title, content } = body as {
      category?: string;
      title?: string;
      content?: string;
    };

    // 소유권 확인
    const { data: existing, error: fetchError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return fail(API_ERROR.NOT_FOUND, "게시글을 찾을 수 없습니다", 404);
    }
    if (existing.user_id !== user.id) {
      return fail(API_ERROR.FORBIDDEN, "수정 권한이 없습니다", 403);
    }

    // 변경할 필드만 업데이트
    const updates: Record<string, unknown> = {};
    const validCategories: PostCategory[] = ["review", "info", "strategy", "free"];

    if (category !== undefined) {
      if (!validCategories.includes(category as PostCategory)) {
        return fail(API_ERROR.INVALID_PARAMS, "유효하지 않은 카테고리입니다", 400);
      }
      updates.category = category;
    }
    if (title !== undefined) {
      if (title.trim().length === 0 || title.length > 100) {
        return fail(API_ERROR.INVALID_PARAMS, "제목은 1~100자여야 합니다", 400);
      }
      updates.title = title.trim();
    }
    if (content !== undefined) {
      if (content.trim().length === 0 || content.length > 5000) {
        return fail(API_ERROR.INVALID_PARAMS, "내용은 1~5000자여야 합니다", 400);
      }
      updates.content = content.trim();
    }

    if (Object.keys(updates).length === 0) {
      return fail(API_ERROR.INVALID_PARAMS, "변경할 내용이 없습니다", 400);
    }

    const { error } = await supabase.from("posts").update(updates).eq("id", id);
    if (error) throw error;

    return ok({ id });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── DELETE /api/posts/[id] ─────────────────────────────────────
// 로그인 필수. 본인 게시글만 삭제.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser();

    // 소유권 확인
    const { data: existing, error: fetchError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return fail(API_ERROR.NOT_FOUND, "게시글을 찾을 수 없습니다", 404);
    }
    if (existing.user_id !== user.id) {
      return fail(API_ERROR.FORBIDDEN, "삭제 권한이 없습니다", 403);
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;

    return ok({ id });
  } catch (e) {
    return handleApiError(e);
  }
}
