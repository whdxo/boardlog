"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, User } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "홈", href: ROUTES.HOME, Icon: Home, exact: true },
  { label: "탐색", href: ROUTES.GAMES, Icon: Search },
  { label: "내기록", href: ROUTES.MY, Icon: BookOpen },
  { label: "프로필", href: ROUTES.PROFILE, Icon: User },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex h-14">
        {TABS.map(({ label, href, Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
                isActive ? "text-primary-500" : "text-gray-400"
              )}
            >
              <Icon
                size={24}
                className={cn(isActive ? "fill-primary-100" : "")}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
      {/* iOS safe area 여백 */}
      <div className="h-safe-bottom bg-white" />
    </nav>
  );
}
