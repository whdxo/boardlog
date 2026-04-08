"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES, POST_CATEGORIES } from "@/constants";
import type { Post, PostCategory } from "@/types";

const MOCK_POSTS: Post[] = [
  { id: "1", userId: "u1", user: { id: "u1", nickname: "보드게임러버", createdAt: "", email: "" }, category: "review",   title: "카탄 5인 플레이 후기 — 3시간의 뜨거운 승부",          content: "드디어 5인으로 카탄을 플레이해봤는데 정말 재미있었어요...",           likeCount: 32,  commentCount: 12, viewCount: 234,  isLiked: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),       updatedAt: "" },
  { id: "2", userId: "u2", user: { id: "u2", nickname: "에디터",     createdAt: "", email: "" }, category: "info",     title: "2025년 보드게임 신작 총정리 — 기대작 20선",              content: "올해도 다양한 신작 보드게임이 출시될 예정이에요...",               likeCount: 128, commentCount: 45, viewCount: 1200, isLiked: true,  createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),      updatedAt: "" },
  { id: "3", userId: "u3", user: { id: "u3", nickname: "전략왕",     createdAt: "", email: "" }, category: "strategy", title: "팬데믹 입문자를 위한 완전 공략 가이드",                    content: "팬데믹은 협력 게임 중 가장 진입 장벽이 낮은 편이에요...",         likeCount: 56,  commentCount: 18, viewCount: 480,  isLiked: false, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),      updatedAt: "" },
  { id: "4", userId: "u4", user: { id: "u4", nickname: "게임수집가", createdAt: "", email: "" }, category: "free",     title: "보드게임 캐비넷 공유 — 수납 어떻게 하세요?",               content: "보드게임이 100개가 넘어가니 수납이 점점 고민이네요...",           likeCount: 14,  commentCount: 23, viewCount: 156,  isLiked: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),       updatedAt: "" },
  { id: "5", userId: "u5", user: { id: "u5", nickname: "파티게임러", createdAt: "", email: "" }, category: "review",   title: "코드네임 VS 텔레스트레이션 — 파티게임 비교 리뷰",          content: "비슷한 인원대의 파티게임 두 가지를 비교해봤어요...",             likeCount: 44,  commentCount: 8,  viewCount: 310,  isLiked: false, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),      updatedAt: "" },
];

export default function CommunityPage() {
  const [feed, setFeed] = useState<"latest" | "best" | "following">("latest");
  const [category, setCategory] = useState<PostCategory | "all">("all");

  const filtered = MOCK_POSTS.filter((p) => category === "all" || p.category === category);

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
        <div className="flex flex-col">
          {filtered.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
}
