import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";

// ── DELETE /api/comments/[id] ──────────────────────────────────
// 로그인 필수. 본인 댓글만 삭제.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser();

    // 댓글 소유권 + post_id 확인
    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("id, user_id, post_id")
      .eq("id", id)
      .single();

    if (fetchError || !comment) {
      return fail(API_ERROR.NOT_FOUND, "댓글을 찾을 수 없습니다", 404);
    }
    if (comment.user_id !== user.id) {
      return fail(API_ERROR.FORBIDDEN, "삭제 권한이 없습니다", 403);
    }

    // 삭제 전 대댓글 개수 조회 (CASCADE 삭제 전에 카운트)
    const { count: replyCount } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", id);

    // 댓글 삭제 (CASCADE로 대댓글도 함께 삭제)
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // comment_count 갱신: 본 댓글 1 + 대댓글 수
    const totalDeleted = 1 + (replyCount ?? 0);
    const { data: post } = await supabase
      .from("posts")
      .select("comment_count")
      .eq("id", comment.post_id)
      .single();

    if (post) {
      await supabase
        .from("posts")
        .update({ comment_count: Math.max(0, post.comment_count - totalDeleted) })
        .eq("id", comment.post_id);
    }

    return ok({ id });
  } catch (e) {
    return handleApiError(e);
  }
}
