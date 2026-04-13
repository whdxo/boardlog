"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES, POST_CATEGORIES } from "@/constants";
import { usePosts } from "@/hooks/usePosts";
import { useAuthStore } from "@/stores/authStore";
import type { PostCategory } from "@/types";

export default function CommunityPage() {
  const [feed, setFeed] = useState<"latest" | "best" | "following">("latest");
  const [category, setCategory] = useState<PostCategory | "all">("all");
  const { isLoggedIn } = useAuthStore();

  const { data, isLoading, isError } = usePosts({ category, feed });

  const posts = data?.posts ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-bold text-gray-900">커뮤니티</h1>
            <Link href={ROUTES.COMMUNITY_NEW} className={cn(buttonVariants({ size: "sm" }), "gap-1")}>
              <Plus className="w-4 h-4" />글쓰기
            </Link>
          </div>
          {/* 피드 탭 */}
          <div className="flex -mx-4 px-4 border-b border-gray-100">
            {(["latest", "best", "following"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFeed(f)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                  feed === f ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"
                )}
              >
                {f === "latest" ? "최신" : f === "best" ? "베스트" : "팔로우"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 카테고리 칩 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-lg mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCategory("all")}
            className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              category === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600")}
          >전체</button>
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                category === cat.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600")}
            >{cat.label}</button>
          ))}
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="max-w-screen-lg mx-auto">
        {isLoading && (
          <div className="flex flex-col gap-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-28 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">게시글을 불러오는 데 실패했습니다</p>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            {feed === "following" && !isLoggedIn ? (
              <>
                <p className="text-sm font-medium">로그인 후 팔로우 피드를 볼 수 있어요</p>
                <Link href={ROUTES.LOGIN} className="mt-3 text-sm text-primary-600 font-medium">로그인하기</Link>
              </>
            ) : feed === "following" ? (
              <p className="text-sm">팔로우한 유저의 게시글이 없어요</p>
            ) : (
              <p className="text-sm">아직 게시글이 없어요</p>
            )}
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="flex flex-col">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
