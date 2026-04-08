"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, user, isLoggedIn, isLoading, signOut } = useAuthStore();

  const displayName = profile?.nickname ?? user?.email?.split("@")[0] ?? "사용자";
  const bio = profile?.bio ?? "";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-body text-gray-500 mb-4">로그인이 필요합니다</p>
        <Link href={ROUTES.LOGIN} className={cn(buttonVariants({ size: "sm" }))}>
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
      {/* 프로필 헤더 */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <User size={36} className="text-primary-500" />
          )}
        </div>
        <div className="text-center">
          <p className="text-h1 font-bold text-gray-900">{displayName}</p>
          {bio && (
            <p className="text-body text-gray-500 mt-1">{bio}</p>
          )}
        </div>
        <Link href={ROUTES.PROFILE_EDIT} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          프로필 수정
        </Link>
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col">
        <MenuLink href={ROUTES.MY} icon={<User size={18} />} label="내 기록" />
        <MenuLink href={ROUTES.SETTINGS} icon={<Settings size={18} />} label="설정" />
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 py-4 border-b border-gray-100 text-error hover:text-red-700 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-body">로그아웃</span>
        </button>
      </nav>
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
