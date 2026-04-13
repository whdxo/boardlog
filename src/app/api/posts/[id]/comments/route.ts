import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";
import { buildCommentTree } from "@/lib/comment-tree";
import type { Comment } from "@/types";

// ── GET /api/posts/[id]/comments ──────────────────────────────
// 공개. 댓글 목록 조회 + 트리 구조 변환
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();

    const { data: rows, error } = await supabase
      .from("comments")
      .select(
        "id, post_id, user_id, content, parent_id, like_count, created_at, profiles!user_id(id, nickname, profile_image)"
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // DB rows → Comment[] (camelCase 변환)
    const comments: Comment[] = (rows ?? []).map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
        id: row.id,
        postId: row.post_id,
        userId: row.user_id,
        user: profile
          ? {
              id: profile.id,
              nickname: profile.nickname,
              profileImage: profile.profile_image,
              email: "",
              createdAt: "",
            }
          : { id: row.user_id, nickname: "알 수 없음", email: "", createdAt: "" },
        content: row.content,
        parentId: row.parent_id ?? undefined,
        likeCount: row.like_count,
        createdAt: row.created_at,
      };
    });

    const tree = buildCommentTree(comments);

    return ok(tree);
  } catch (e) {
    return handleApiError(e);
  }
}

// ── POST /api/posts/[id]/comments ─────────────────────────────
// 로그인 필수. 댓글/대댓글 작성.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const { content, parentId } = body as {
      content?: string;
      parentId?: string;
    };

    if (!content || content.trim().length === 0 || content.length > 1000) {
      return fail(API_ERROR.INVALID_PARAMS, "댓글은 1~1000자여야 합니다", 400);
    }

    // 게시글 존재 확인
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, comment_count")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return fail(API_ERROR.NOT_FOUND, "게시글을 찾을 수 없습니다", 404);
    }

    // 대댓글 유효성 확인
    if (parentId) {
      const { data: parentComment } = await supabase
        .from("comments")
        .select("id, post_id, parent_id")
        .eq("id", parentId)
        .single();

      if (!parentComment) {
        return fail(API_ERROR.NOT_FOUND, "부모 댓글을 찾을 수 없습니다", 404);
      }
      if (parentComment.post_id !== postId) {
        return fail(API_ERROR.INVALID_PARAMS, "잘못된 게시글의 댓글입니다", 400);
      }
      // 1-depth만 허용: 부모 댓글이 이미 대댓글이면 거부
      if (parentComment.parent_id) {
        return fail(API_ERROR.INVALID_PARAMS, "대댓글의 대댓글은 작성할 수 없습니다", 400);
      }
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId ?? null,
      })
      .select(
        "id, post_id, user_id, content, parent_id, like_count, created_at, profiles!user_id(id, nickname, profile_image)"
      )
      .single();

    if (error) throw error;

    // comment_count 갱신
    await supabase
      .from("posts")
      .update({ comment_count: post.comment_count + 1 })
      .eq("id", postId);

    const profile = Array.isArray(comment.profiles)
      ? comment.profiles[0]
      : comment.profiles;

    return ok(
      {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        user: profile
          ? {
              id: profile.id,
              nickname: profile.nickname,
              profileImage: profile.profile_image,
              email: "",
              createdAt: "",
            }
          : { id: user.id, nickname: "알 수 없음", email: "", createdAt: "" },
        content: comment.content,
        parentId: comment.parent_id ?? undefined,
        likeCount: comment.like_count,
        createdAt: comment.created_at,
        replies: [],
      },
      201
    );
  } catch (e) {
    return handleApiError(e);
  }
}
