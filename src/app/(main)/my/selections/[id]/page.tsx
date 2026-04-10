"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";

export default function SelectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  void id;
  const { isLoggedIn } = useAuthStore();

  const sel = {
    title: "협력 게임 명작 모음",
    description: "같이 하면 더 재미있는 게임들을 모았어요. 팀워크가 중요한 게임 위주로 큐레이션했습니다.",
    gameCount: 5,
    isPublic: true,
    games: [
      { id: "1", title: "팬데믹", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200", memo: "입문자에게 강력 추천" },
      { id: "2", title: "아컴 호러", thumbnail: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200", memo: "어둡고 긴장감 넘치는 협력의 정수" },
      { id: "3", title: "글룸헤이븐", thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200", memo: "캠페인형 최고의 협력 게임" },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <Link href={ROUTES.MY_SELECTIONS} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        {isLoggedIn && (
          <button className="p-1">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="px-4 pt-6 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{sel.title}</h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{sel.description}</p>
          <p className="text-xs text-gray-400 mt-3">{sel.gameCount}개 게임 · {sel.isPublic ? "공개" : "비공개"}</p>
        </div>

        <div className="flex flex-col gap-4">
          {sel.games.map((g, i) => (
            <Link
              key={g.id}
              href={ROUTES.GAME_DETAIL(g.id)}
              className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-all"
            >
              <span className="text-lg font-bold text-gray-300 w-5 text-center">{i + 1}</span>
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image src={g.thumbnail} alt={g.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{g.title}</p>
                {g.memo && <p className="text-xs text-gray-500 mt-0.5 truncate">{g.memo}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
