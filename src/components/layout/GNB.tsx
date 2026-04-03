"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, User } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "홈", href: ROUTES.HOME },
  { label: "탐색", href: ROUTES.GAMES },
  { label: "내기록", href: ROUTES.MY },
];

interface GNBProps {
  /** 로그인한 유저 정보. undefined면 비로그인 상태로 렌더 */
  user?: { nickname: string; profileImage?: string } | null;
}

export default function GNB({ user }: GNBProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center gap-8">
        {/* 로고 */}
        <Link
          href={ROUTES.HOME}
          className="text-xl font-bold text-primary-500 shrink-0"
        >
          BoardLog
        </Link>

        {/* 메뉴 */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative pb-0.5",
                  isActive
                    ? "text-primary-500 after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-0.5 after:bg-primary-500"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측 액션 */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              {/* 알림 */}
              <Link
                href={ROUTES.NOTIFICATIONS}
                className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Bell size={20} />
              </Link>

              {/* 프로필 드롭다운 */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.nickname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={16} className="text-primary-600" />
                    </span>
                  )}
                  {user.nickname}
                  <ChevronDown size={14} className="text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
                    내 프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                    설정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-error">
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                로그인
              </Link>
              <Link href={ROUTES.SIGNUP} className={cn(buttonVariants({ size: "sm" }))}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
