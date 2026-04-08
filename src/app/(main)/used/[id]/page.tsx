"use client";

import { use } from "react";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { CommentInput } from "@/components/community/CommentInput";
import { cn } from "@/lib/utils";
import { USED_TYPE_OPTIONS, ITEM_CONDITION_OPTIONS, TRADE_METHOD_OPTIONS } from "@/constants";

export default function UsedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  void id;

  const post = {
    type: "sell" as const, status: "active" as const,
    title: "카탄 판매합니다 (확장 포함)",
    content: "카탄 기본판 + 5~6인 확장입니다.\n\n사용감 있지만 카드류 슬리브 씌워서 상태 좋습니다.\n박스도 큰 손상 없습니다.\n\n택배 거래 선호하며, 직거래는 홍대 가능합니다.",
    price: 35000, condition: "good" as const, tradeMethod: "both" as const,
    user: { nickname: "보드마켓", joinedYear: 2022, tradeCount: 12 },
    viewCount: 45,
    comments: [{ id: "c1", nickname: "게임수집가", content: "아직 판매 중인가요?" }],
  };

  const typeOpt = USED_TYPE_OPTIONS.find((t) => t.value === post.type);
  const condOpt = ITEM_CONDITION_OPTIONS.find((c) => c.value === post.condition);
  const tradeOpt = TRADE_METHOD_OPTIONS.find((t) => t.value === post.tradeMethod);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <button onClick={() => history.back()} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
        <button className="p-1"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
      </div>

      <div className="pb-28">
        <div className="bg-gray-100 h-64 flex items-center justify-center">
          <span className="text-5xl">🎲</span>
        </div>

        <div className="px-4 py-5">
          {typeOpt && (
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", typeOpt.color)}>{typeOpt.label}</span>
          )}
          <h1 className="text-xl font-bold text-gray-900 mt-2">{post.title}</h1>
          <p className="text-2xl font-bold text-primary-600 mt-1">{post.price.toLocaleString()}원</p>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">상태</span>
              <span className="font-medium text-gray-700">{condOpt?.label} ({condOpt?.description})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">거래 방식</span>
              <span className="font-medium text-gray-700">{tradeOpt?.label}</span>
            </div>
          </div>

          <div className="mt-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-5">
            {post.content}
          </div>

          <div className="mt-6 p-4 border border-gray-100 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
              {post.user.nickname[0]}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{post.user.nickname}</p>
              <p className="text-xs text-gray-400">가입 {post.user.joinedYear}년 · 거래 {post.user.tradeCount}회</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-4">댓글 {post.comments.length}개</h2>
            {post.comments.map((c) => (
              <div key={c.id} className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-gray-600">
                  {c.nickname[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{c.nickname}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CommentInput onSubmit={(text) => console.log("댓글:", text)} placeholder="댓글로 문의하세요..." />
    </div>
  );
}
