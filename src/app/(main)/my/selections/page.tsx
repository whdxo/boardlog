"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Lock, Globe } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { Selection } from "@/types";

const MOCK_SELECTIONS: Selection[] = [
  { id: "s1", userId: "u1", title: "협력 게임 명작 모음", description: "같이 하면 더 재미있는 게임들", isPublic: true,  games: [], gameCount: 5, createdAt: "", updatedAt: "" },
  { id: "s2", userId: "u1", title: "입문자 추천 게임",    description: "처음 보드게임을 시작하는 분들께",  isPublic: false, games: [], gameCount: 8, createdAt: "", updatedAt: "" },
  { id: "s3", userId: "u1", title: "2인 데이트 게임",     description: "둘이서 오붓하게 즐기기 좋은 게임", isPublic: true,  games: [], gameCount: 6, createdAt: "", updatedAt: "" },
];

export default function SelectionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={ROUTES.MY} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">내 셀렉션</h1>
          </div>
          <button className={cn(buttonVariants({ size: "sm" }), "gap-1")}>
            <Plus className="w-4 h-4" />
            만들기
          </button>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-4 flex flex-col gap-3">
        {MOCK_SELECTIONS.map((sel) => (
          <Link
            key={sel.id}
            href={ROUTES.MY_SELECTION_DETAIL(sel.id)}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              🎲
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 truncate">{sel.title}</h3>
                {sel.isPublic
                  ? <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  : <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
              </div>
              {sel.description && (
                <p className="text-sm text-gray-500 truncate mt-0.5">{sel.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{sel.gameCount}개 게임</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
