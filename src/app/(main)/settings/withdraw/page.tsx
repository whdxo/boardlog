"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileHeader from "@/components/layout/MobileHeader";
import LoginPrompt from "@/components/common/LoginPrompt";
import { useAuthStore } from "@/stores/authStore";

export default function WithdrawPage() {
  const [confirmed, setConfirmed] = useState("");
  const { isLoggedIn, isLoading } = useAuthStore();
  const canWithdraw = confirmed === "탈퇴";

  if (isLoading) return null;
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="회원 탈퇴" />
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        <h1 className="text-h1 font-bold text-gray-900 hidden md:block">회원 탈퇴</h1>

        {/* 경고 */}
        <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
          <AlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
          <div>
            <p className="text-body font-semibold text-error">탈퇴 전 꼭 확인하세요</p>
            <ul className="text-caption text-red-600 mt-2 flex flex-col gap-1 list-disc list-inside">
              <li>모든 기록, 컬렉션, 평점 데이터가 삭제됩니다</li>
              <li>삭제된 데이터는 복구할 수 없습니다</li>
              <li>동일 이메일로 재가입해도 데이터가 복구되지 않습니다</li>
            </ul>
          </div>
        </div>

        {/* 확인 입력 */}
        <div className="flex flex-col gap-2">
          <p className="text-body text-gray-700">
            탈퇴를 원하시면 아래에 <strong className="text-error">탈퇴</strong>를 입력하세요.
          </p>
          <Input
            value={confirmed}
            onChange={(e) => setConfirmed(e.target.value)}
            placeholder="탈퇴"
            className="h-11"
          />
        </div>

        <Button
          variant="destructive"
          className="w-full"
          disabled={!canWithdraw}
        >
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
}
