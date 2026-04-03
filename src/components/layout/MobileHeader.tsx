"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  /** "logo" → BoardLog 텍스트 로고, "back" → 뒤로가기 버튼 */
  variant?: "logo" | "back";
  title?: string;
  rightSlot?: React.ReactNode;
  className?: string;
}

export default function MobileHeader({
  variant = "back",
  title,
  rightSlot,
  className,
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 md:hidden h-14 flex items-center px-4 bg-white border-b border-gray-200",
        className
      )}
    >
      {/* 좌측 */}
      {variant === "logo" ? (
        <Link href="/" className="text-lg font-bold text-primary-500">
          BoardLog
        </Link>
      ) : (
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 text-gray-700"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* 중앙 타이틀 */}
      {title && (
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-900 max-w-[200px] truncate">
          {title}
        </span>
      )}

      {/* 우측 슬롯 */}
      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </header>
  );
}
