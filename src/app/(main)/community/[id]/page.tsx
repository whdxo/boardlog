"use client";

import { useState, use } from "react";
import { ArrowLeft, ThumbsUp, Share2, MoreHorizontal } from "lucide-react";
import { CommentInput } from "@/components/community/CommentInput";
import { cn } from "@/lib/utils";
import { POST_CATEGORIES } from "@/constants";
import type { Comment } from "@/types";

const MOCK_COMMENTS: Comment[] = [
  { id: "c1", postId: "1", userId: "u2", user: { id: "u2", nickname: "전략왕", createdAt: "", email: "" }, content: "오 5인 카탄 저도 해보고 싶었는데! 도적 매너가 제일 중요하죠 ㅋㅋ", likeCount: 5, isLiked: false, createdAt: new Date(Date.now() - 3600000).toISOString(),
    replies: [
      { id: "c1r1", postId: "1", userId: "u1", user: { id: "u1", nickname: "보드게임러버", createdAt: "", email: "" }, content: "맞아요 ㅋㅋ 특히 5인이면 도적이 더 아프게 느껴지더라고요", likeCount: 2, isLiked: false, createdAt: new Date(Date.now() - 1800000).toISOString(), parentId: "c1" },
    ],
  },
  { id: "c2", postId: "1", userId: "u3", user: { id: "u3", nickname: "파티게임러", createdAt: "", email: "" }, content: "역전 승리하셨군요! 카탄은 막판 반전이 있어서 재미있죠 ㅎㅎ", likeCount: 3, isLiked: false, createdAt: new Date(Date.now() - 2700000).toISOString() },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: _id } = use(params);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(32);

  const cat = POST_CATEGORIES.find((c) => c.value === "review");

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((p) => liked ? p - 1 : p + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center gap-3 px-4 h-14">
        <button onClick={() => history.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1" />
        <button className="p-1"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
      </div>

      <article className="px-4 pt-4 pb-32">
        {cat && (
          <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3", cat.color)}>
            {cat.label}
          </span>
        )}
        <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4">
          카탄 5인 플레이 후기 — 3시간의 뜨거운 승부
        </h1>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">보</div>
          <div>
            <p className="text-sm font-medium text-gray-700">보드게임러버</p>
            <p className="text-xs text-gray-400">2시간 전 · 조회 234</p>
          </div>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
          {`드디어 5인으로 카탄을 플레이해봤는데 정말 재미있었어요!

보통 3~4인이 권장이지만 5인 확장팩으로 플레이하니 협상과 트레이드가 훨씬 활발해지더라고요.

처음에는 좋은 위치를 선점하려는 눈치싸움이 치열했어요. 저는 광석이 풍부한 위치를 선택했는데 도시 발전 전략이 꽤 잘 먹혔습니다.

중반부에 한 플레이어가 도적을 계속 저한테만 보내서 많이 힘들었는데 ㅠㅠ 결국 막판 역전으로 승리했어요!

5인은 한 라운드가 꽤 길어지기 때문에 시간 여유가 있을 때 추천해요.`}
        </div>

        {/* 액션 */}
        <div className="flex items-center gap-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors",
              liked ? "border-primary-500 bg-primary-50 text-primary-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <ThumbsUp className="w-4 h-4" />
            추천 {likeCount}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            <Share2 className="w-4 h-4" />공유
          </button>
        </div>

        {/* 댓글 */}
        <div className="mt-4">
          <h2 className="font-semibold text-gray-900 mb-4">댓글 {MOCK_COMMENTS.length}개</h2>
          <div className="flex flex-col gap-4">
            {MOCK_COMMENTS.map((c) => (
              <div key={c.id}>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-gray-600">
                    {c.user.nickname[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">{c.user.nickname}</span>
                      <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{c.content}</p>
                  </div>
                </div>
                {c.replies?.map((r) => (
                  <div key={r.id} className="ml-11 mt-3 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                      {r.user.nickname[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">{r.user.nickname}</span>
                        <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </article>

      <CommentInput onSubmit={(text) => console.log("댓글:", text)} />
    </div>
  );
}
