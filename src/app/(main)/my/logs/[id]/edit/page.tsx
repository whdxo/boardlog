"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import LogForm from "@/components/log/LogForm";
import LoginPrompt from "@/components/common/LoginPrompt";
import { useAuthStore } from "@/stores/authStore";
import type { PlayLog, PlayLogFormData } from "@/types";

// Mock data — same as detail page
const MOCK_LOGS: Record<string, PlayLog> = {
  "1": {
    id: "1",
    userId: "u1",
    gameId: "1",
    game: { id: "1", title: "카탄", minPlayers: 3, maxPlayers: 4, thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400" },
    playedAt: "2024-03-15",
    players: ["지수", "민준", "서연"],
    location: "보드게임 카페",
    rating: 4,
    memo: "정말 재밌었다! 다음에 또 하고 싶다.",
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
};

interface LogEditPageProps {
  params: Promise<{ id: string }>;
}

export default function LogEditPage({ params }: LogEditPageProps) {
  const { id } = use(params);
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt title="로그인이 필요해요" description="기록을 수정하려면 로그인해주세요" />
      </div>
    );
  }

  const log = MOCK_LOGS[id];

  if (!log) notFound();

  function handleSubmit(data: PlayLogFormData) {
    // TODO: API 연동
    console.log("update", id, data);
  }

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="기록 수정" />
      <div className="px-4 md:px-6 py-6">
        <h1 className="text-h1 font-bold text-gray-900 mb-6 hidden md:block">기록 수정</h1>
        <LogForm
          initialGame={log.game}
          initialData={{
            gameId: log.gameId,
            playedAt: log.playedAt,
            players: log.players ?? [],
            location: log.location ?? "",
            rating: log.rating,
            memo: log.memo ?? "",
          }}
          onSubmit={handleSubmit}
          submitLabel="수정 완료"
        />
      </div>
    </div>
  );
}
