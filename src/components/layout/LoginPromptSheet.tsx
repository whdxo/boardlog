"use client";

import Link from "next/link";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

interface LoginPromptSheetProps {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

export function LoginPromptSheet({ open, onClose, callbackUrl }: LoginPromptSheetProps) {
  const loginHref = callbackUrl
    ? `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : ROUTES.LOGIN;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
            🔒
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">로그인이 필요한 기능이에요</h2>
            <p className="text-sm text-gray-500 mt-1">로그인하고 보드게임을 기록해보세요!</p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <Link
              href={loginHref}
              onClick={onClose}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full justify-center")}
            >
              로그인하기
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              onClick={onClose}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center")}
            >
              회원가입하기
            </Link>
          </div>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
            취소
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
