import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

// Mock user
const MOCK_USER = {
  nickname: "보드게이머",
  bio: "보드게임을 사랑하는 사람입니다 🎲",
  logCount: 12,
  collectionCount: 28,
  ratingCount: 15,
};

export default function ProfilePage() {
  return (
    <div className="max-w-lg mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
      {/* 프로필 헤더 */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
          <User size={36} className="text-primary-500" />
        </div>
        <div className="text-center">
          <p className="text-h1 font-bold text-gray-900">{MOCK_USER.nickname}</p>
          {MOCK_USER.bio && (
            <p className="text-body text-gray-500 mt-1">{MOCK_USER.bio}</p>
          )}
        </div>
        <Link href={ROUTES.PROFILE_EDIT} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          프로필 수정
        </Link>
      </div>

      {/* 활동 통계 */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
        <Stat value={MOCK_USER.logCount} label="기록" />
        <Stat value={MOCK_USER.collectionCount} label="컬렉션" />
        <Stat value={MOCK_USER.ratingCount} label="평점" />
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col">
        <MenuLink href={ROUTES.MY} icon={<User size={18} />} label="내 기록" />
        <MenuLink href={ROUTES.SETTINGS} icon={<Settings size={18} />} label="설정" />
        <button
          type="button"
          className="flex items-center gap-3 py-4 border-b border-gray-100 text-error hover:text-red-700 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-body">로그아웃</span>
        </button>
      </nav>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-h1 font-bold text-primary-500">{value}</p>
      <p className="text-caption text-gray-500">{label}</p>
    </div>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-4 border-b border-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
    >
      {icon}
      <span className="text-body">{label}</span>
    </Link>
  );
}
