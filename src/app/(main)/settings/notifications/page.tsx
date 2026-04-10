"use client";

import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import LoginPrompt from "@/components/common/LoginPrompt";
import { useAuthStore } from "@/stores/authStore";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <div>
        <p className="text-body font-medium text-gray-900">{label}</p>
        {description && <p className="text-caption text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-primary-500" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const [priceAlert, setPriceAlert] = useState(true);
  const [playReminder, setPlayReminder] = useState(false);
  const [system, setSystem] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const { isLoggedIn, isLoading } = useAuthStore();

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
      <MobileHeader variant="back" title="알림 설정" />
      <div className="px-4 md:px-6 py-6">
        <h1 className="text-h1 font-bold text-gray-900 mb-6 hidden md:block">알림 설정</h1>

        <ToggleRow label="가격 변동 알림" description="위시리스트 게임 가격이 변동되면 알려드려요" checked={priceAlert} onChange={setPriceAlert} />
        <ToggleRow label="플레이 리마인더" description="기록하지 않은 플레이가 있을 때 알려드려요" checked={playReminder} onChange={setPlayReminder} />
        <ToggleRow label="서비스 알림" description="업데이트 및 공지사항을 받아요" checked={system} onChange={setSystem} />
        <ToggleRow label="마케팅 알림" description="이벤트 및 혜택 정보를 받아요" checked={marketing} onChange={setMarketing} />
      </div>
    </div>
  );
}
