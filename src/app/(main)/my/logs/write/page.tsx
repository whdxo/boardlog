"use client";

import MobileHeader from "@/components/layout/MobileHeader";
import LogForm from "@/components/log/LogForm";
import LoginPrompt from "@/components/common/LoginPrompt";
import { useAuthStore } from "@/stores/authStore";
import type { PlayLogFormData } from "@/types";

export default function LogWritePage() {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt title="로그인이 필요해요" description="플레이 기록을 작성하려면 로그인해주세요" />
      </div>
    );
  }

  function handleSubmit(data: PlayLogFormData) {
    // TODO: API 연동
    console.log("submit", data);
  }

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="기록 작성" />
      <div className="px-4 md:px-6 py-6">
        <h1 className="text-h1 font-bold text-gray-900 mb-6 hidden md:block">기록 작성</h1>
        <LogForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
