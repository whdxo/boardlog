"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Image as ImageIcon, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, POST_CATEGORIES } from "@/constants";
import type { PostCategory } from "@/types";

export default function NewPostPage() {
  const router = useRouter();
  const [category, setCategory] = useState<PostCategory>("review");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSubmit = title.trim() && content.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
        <button onClick={() => router.back()} className="p-1 text-gray-500">
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">새 글 작성</h1>
        <button
          onClick={() => canSubmit && router.push(ROUTES.COMMUNITY)}
          disabled={!canSubmit}
          className={cn(
            "text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors",
            canSubmit ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          발행
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {/* 게시판 */}
        <div className="px-4 py-4">
          <p className="text-xs font-medium text-gray-500 mb-2">게시판 선택</p>
          <div className="flex gap-2 flex-wrap">
            {POST_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  category === cat.value ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600"
                )}
              >{cat.label}</button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className="px-4 py-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="w-full text-lg font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
          />
        </div>

        {/* 본문 */}
        <div className="px-4 py-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows={12}
            className="w-full text-sm text-gray-700 leading-relaxed placeholder:text-gray-300 outline-none resize-none"
          />
        </div>
      </div>

      {/* 하단 툴바 */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <button className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700">
          <ImageIcon className="w-4 h-4" />사진 추가
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700">
          <Tag className="w-4 h-4" />게임 태그
        </button>
      </div>
    </div>
  );
}
