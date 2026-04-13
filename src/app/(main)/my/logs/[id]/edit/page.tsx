"use client";

import { use } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import LogForm from "@/components/log/LogForm";
import LoginPrompt from "@/components/common/LoginPrompt";
import { useAuthStore } from "@/stores/authStore";
import { usePlayLog, useUpdatePlayLog } from "@/hooks/usePlayLog";
import type { PlayLogFormData } from "@/types";

interface LogEditPageProps {
  params: Promise<{ id: string }>;
}

export default function LogEditPage({ params }: LogEditPageProps) {
  const { id } = use(params);
  const { isLoggedIn, isLoading: authLoading, user } = useAuthStore();
  const { data: log, isLoading: logLoading } = usePlayLog(id);
  const updatePlayLog = useUpdatePlayLog(id);

  if (authLoading || logLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt title="로그인이 필요해요" description="기록을 수정하려면 로그인해주세요" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-sm text-gray-400">기록을 찾을 수 없습니다</p>
      </div>
    );
  }

  // 본인 로그만 수정 가능
  if (log.userId !== user?.id) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-sm text-gray-400">수정 권한이 없습니다</p>
      </div>
    );
  }

  function handleSubmit(data: PlayLogFormData) {
    updatePlayLog.mutate(data);
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
            visibility: log.visibility,
          }}
          onSubmit={handleSubmit}
          submitLabel="수정 완료"
          loading={updatePlayLog.isPending}
        />
      </div>
    </div>
  );
}
