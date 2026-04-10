"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, USED_TYPE_OPTIONS, ITEM_CONDITION_OPTIONS, TRADE_METHOD_OPTIONS } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import LoginPrompt from "@/components/common/LoginPrompt";
import type { UsedType, ItemCondition, TradeMethod } from "@/types";

export default function UsedWritePage() {
  const router = useRouter();
  const [type, setType] = useState<UsedType>("sell");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("good");
  const [tradeMethod, setTradeMethod] = useState<TradeMethod>("both");
  const [content, setContent] = useState("");
  const { isLoggedIn, isLoading } = useAuthStore();

  const canSubmit = title.trim() && content.trim();

  if (isLoading) return null;
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt title="로그인이 필요해요" description="거래글을 작성하려면 로그인해주세요" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
        <button onClick={() => router.back()} className="p-1 text-gray-500"><X className="w-5 h-5" /></button>
        <h1 className="text-base font-bold text-gray-900">거래글 작성</h1>
        <button
          onClick={() => canSubmit && router.push(ROUTES.USED)}
          disabled={!canSubmit}
          className={cn("text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors",
            canSubmit ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed")}
        >등록</button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {/* 거래 유형 */}
        <div className="px-4 py-4">
          <p className="text-xs font-medium text-gray-500 mb-2">거래 유형</p>
          <div className="flex gap-2 flex-wrap">
            {USED_TYPE_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setType(opt.value)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  type === opt.value ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600")}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* 게임 태그 */}
        <div className="px-4 py-4">
          <p className="text-xs font-medium text-gray-500 mb-2">게임 태그 (선택)</p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-sm text-gray-500">
            <Plus className="w-3.5 h-3.5" />게임 추가
          </button>
        </div>

        {/* 제목 */}
        <div className="px-4 py-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요"
            className="w-full text-base font-semibold text-gray-900 placeholder:text-gray-300 outline-none" />
        </div>

        {/* 가격/상태/거래방식 */}
        <div className="px-4 py-4 space-y-4">
          {type !== "share" && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">가격</p>
              <div className="flex items-center gap-2">
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0"
                  className="flex-1 text-base text-gray-900 placeholder:text-gray-300 outline-none border-b border-gray-200 pb-1 focus:border-primary-500" />
                <span className="text-gray-500 text-sm">원</span>
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">상태</p>
            <div className="flex gap-2 flex-wrap">
              {ITEM_CONDITION_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setCondition(opt.value)}
                  className={cn("px-3 py-1.5 rounded-full text-sm border transition-colors",
                    condition === opt.value ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600")}
                >{opt.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">거래 방식</p>
            <div className="flex gap-2 flex-wrap">
              {TRADE_METHOD_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setTradeMethod(opt.value)}
                  className={cn("px-3 py-1.5 rounded-full text-sm border transition-colors",
                    tradeMethod === opt.value ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600")}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 사진 */}
        <div className="px-4 py-4">
          <p className="text-xs font-medium text-gray-500 mb-2">사진 (최대 5장)</p>
          <button className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-4 py-4">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="상세 내용을 입력하세요..." rows={6}
            className="w-full text-sm text-gray-700 placeholder:text-gray-300 outline-none resize-none" />
        </div>
      </div>
    </div>
  );
}
