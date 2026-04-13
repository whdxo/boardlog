import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, handleApiError, API_ERROR } from "@/lib/api-response";
import type { PostCategory } from "@/types";

const PAGE_SIZE = 20;

// ── GET /api/posts ─────────────────────────────────────────────
// 쿼리 파라미터: category, feed(latest|best|following), page
// 비회원 허용. isLiked는 로그인 시만 포함.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "all";
    const feed = searchParams.get("feed") ?? "latest";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const supabase = await createClient();

    // 현재 로그인 유저 확인 (선택적)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // feed=following은 로그인 필요, 비로그인이면 latest로 폴백
    const effectiveFeed = feed === "following" && !user ? "latest" : feed;

    let query = supabase
      .from("posts")
      .select(
        "id, user_id, category, title, content, images, like_count, comment_count, view_count, created_at, updated_at, profiles!user_id(id, nickname, profile_image, bio)",
        { count: "exact" }
      );

    // 카테고리 필터
    if (category !== "all") {
      const validCategories: PostCategory[] = ["review", "info", "strategy", "free"];
      if (!validCategories.includes(category as PostCategory)) {
        return fail(API_ERROR.INVALID_PARAMS, "유효하지 않은 카테고리입니다", 400);
      }
      query = query.eq("category", category);
    }

    // 팔로우 피드: 내가 팔로우한 유저 게시글만
    if (effectiveFeed === "following" && user) {
      const { data: followingRows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followingIds = followingRows?.map((r) => r.following_id) ?? [];

      if (followingIds.length === 0) {
        return ok({ posts: [], total: 0, page, pageSize: PAGE_SIZE });
      }

      query = query.in("user_id", followingIds);
    }

    // 정렬
    if (effectiveFeed === "best") {
      query = query.order("like_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data: rows, error, count } = await query.range(from, to);

    if (error) throw error;

    // isLiked 주입 (로그인 유저만)
    let likedSet = new Set<string>();
    if (user && rows && rows.length > 0) {
      const postIds = rows.map((r) => r.id);
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      likedSet = new Set(likes?.map((l) => l.post_id) ?? []);
    }

    const posts = (rows ?? []).map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
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
        viewCount: row.view_count,
        isLiked: user ? likedSet.has(row.id) : false,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });

    return ok({ posts, total: count ?? 0, page, pageSize: PAGE_SIZE });
  } catch (e) {
    return handleApiError(e);
  }
}

// ── POST /api/posts ────────────────────────────────────────────
// 로그인 필수. 게시글 생성.
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const body = await request.json();

    const { category, title, content } = body as {
      category?: string;
      title?: string;
      content?: string;
    };

    // 유효성 검사
    const validCategories = ["review", "info", "strategy", "free"];
    if (!category || !validCategories.includes(category)) {
      return fail(API_ERROR.INVALID_PARAMS, "유효하지 않은 카테고리입니다", 400);
    }
    if (!title || title.trim().length === 0 || title.length > 100) {
      return fail(API_ERROR.INVALID_PARAMS, "제목은 1~100자여야 합니다", 400);
    }
    if (!content || content.trim().length === 0 || content.length > 5000) {
      return fail(API_ERROR.INVALID_PARAMS, "내용은 1~5000자여야 합니다", 400);
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({ user_id: user.id, category, title: title.trim(), content: content.trim() })
      .select("id")
      .single();

    if (error) throw error;

    return ok({ id: post.id }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
