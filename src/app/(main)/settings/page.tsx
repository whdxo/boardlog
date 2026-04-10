"use client";

import Link from "next/link";
import { ChevronRight, User, Lock, Bell, AlertTriangle } from "lucide-react";
import MobileHeader from "@/components/layout/MobileHeader";
import LoginPrompt from "@/components/common/LoginPrompt";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";

const MENU_GROUPS = [
  {
    title: "계정",
    items: [
      { href: ROUTES.SETTINGS_ACCOUNT, icon: <User size={18} />, label: "계정 정보" },
      { href: ROUTES.SETTINGS_PASSWORD, icon: <Lock size={18} />, label: "비밀번호 변경" },
    ],
  },
  {
    title: "알림",
    items: [
      { href: ROUTES.SETTINGS_NOTIFICATIONS, icon: <Bell size={18} />, label: "알림 설정" },
    ],
  },
  {
    title: "기타",
    items: [
      { href: ROUTES.TERMS, icon: null, label: "이용약관" },
      { href: ROUTES.PRIVACY, icon: null, label: "개인정보처리방침" },
      { href: ROUTES.GUIDELINES, icon: null, label: "커뮤니티 가이드라인" },
      { href: ROUTES.SETTINGS_WITHDRAW, icon: <AlertTriangle size={18} className="text-error" />, label: "회원 탈퇴", danger: true },
    ],
  },
] as const;

export default function SettingsPage() {
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
      <MobileHeader variant="back" title="설정" />
      <div className="px-4 md:px-6 py-6">
        <h1 className="text-h1 font-bold text-gray-900 mb-6 hidden md:block">설정</h1>

        <div className="flex flex-col gap-6">
          {MENU_GROUPS.map((group) => (
            <section key={group.title}>
              <p className="text-tiny font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                {group.title}
              </p>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {group.items.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                      i < group.items.length - 1 ? "border-b border-gray-100" : ""
                    } ${"danger" in item && item.danger ? "text-error" : "text-gray-700"}`}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="text-body flex-1">{item.label}</span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-center text-tiny text-gray-400 mt-8">버전 1.0.0</p>
      </div>
    </div>
  );
}
