import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

interface LoginPromptProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function LoginPrompt({
  title = "로그인이 필요한 기능이에요",
  description = "로그인하고 기록을 시작하세요",
  className,
}: LoginPromptProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-4 text-center",
        className
      )}
    >
      <span className="text-4xl">🔒</span>
      <div className="space-y-1">
        <p className="text-h3 font-semibold text-gray-800">{title}</p>
        <p className="text-body text-gray-500">{description}</p>
      </div>
      <div className="flex gap-3">
        <Link href={ROUTES.LOGIN} className={cn(buttonVariants())}>
          로그인
        </Link>
        <Link href={ROUTES.SIGNUP} className={cn(buttonVariants({ variant: "outline" }))}>
          회원가입
        </Link>
      </div>
    </div>
  );
}
