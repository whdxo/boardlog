import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── POST /api/posts/[id]/like ──────────────────────────────────
// 로그인 필수. 좋아요 토글 (있으면 취소, 없으면 추가)
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { supabase, user } = await requireUser();

    // 게시글 존재 확인
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, like_count")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return fail(API_ERROR.NOT_FOUND, "게시글을 찾을 수 없습니다", 404);
    }

    // 현재 좋아요 상태 확인
    const { data: existing } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .maybeSingle();

    let liked: boolean;
    let newCount: number;

    if (existing) {
      // 좋아요 취소
      await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      newCount = Math.max(0, post.like_count - 1);
      liked = false;
    } else {
      // 좋아요 추가
      await supabase
        .from("post_likes")
        .insert({ user_id: user.id, post_id: postId });

      newCount = post.like_count + 1;
      liked = true;
    }

    // like_count 캐시 업데이트
    await supabase
      .from("posts")
      .update({ like_count: newCount })
      .eq("id", postId);

    return ok({ liked, likeCount: newCount });
  } catch (e) {
    return handleApiError(e);
  }
}
