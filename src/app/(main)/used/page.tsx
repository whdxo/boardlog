"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UsedPostCard } from "@/components/used/UsedPostCard";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES, USED_TYPE_OPTIONS } from "@/constants";
import type { UsedPost, UsedType } from "@/types";

const MOCK_USED: UsedPost[] = [
  { id: "u1", userId: "uu1", user: { id: "uu1", nickname: "보드마켓", email: "", createdAt: "" }, type: "sell",  status: "active", title: "카탄 판매합니다 (확장 포함)", content: "", price: 35000, condition: "good",   viewCount: 45, commentCount: 3, gameTags: [{ id: "4", title: "카탄", thumbnail: "", minPlayers: 3, maxPlayers: 4 }], createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),   updatedAt: "" },
  { id: "u2", userId: "uu2", user: { id: "uu2", nickname: "나눔천사", email: "", createdAt: "" }, type: "share", status: "active", title: "팬데믹 나눔해요 (미개봉)",    content: "", price: 0,     condition: "new",    viewCount: 72, commentCount: 8, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),   updatedAt: "" },
  { id: "u3", userId: "uu3", user: { id: "uu3", nickname: "스플렌더러", email: "", createdAt: "" }, type: "sell",  status: "done",   title: "스플렌더 판매 완료",         content: "", price: 20000, condition: "normal",  viewCount: 134,commentCount: 5, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),  updatedAt: "" },
  { id: "u4", userId: "uu4", user: { id: "uu4", nickname: "윙스팬러버", email: "", createdAt: "" }, type: "trade", status: "active", title: "윙스팬 ↔️ 아컴호러 교환",   content: "", condition: "good",   viewCount: 28, commentCount: 1, createdAt: new Date(Date.now() - 86400000).toISOString(),      updatedAt: "" },
];

export default function UsedPage() {
  const [typeFilter, setTypeFilter] = useState<UsedType | "all">("all");
  const filtered = MOCK_USED.filter((p) => typeFilter === "all" || p.type === typeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">중고거래</h1>
          <Link href={ROUTES.USED_WRITE} className={cn(buttonVariants({ size: "sm" }), "gap-1")}>
            <Plus className="w-4 h-4" />글쓰기
          </Link>
        </div>
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors", typeFilter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600")}
          >전체</button>
          {USED_TYPE_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setTypeFilter(opt.value)}
              className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors", typeFilter === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600")}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto bg-white">
        {filtered.map((post) => <UsedPostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
