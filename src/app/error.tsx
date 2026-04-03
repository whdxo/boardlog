"use client";

import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-sm">
        <p className="text-[80px] leading-none mb-4">😵</p>
        <h1 className="text-display font-bold text-gray-900">500</h1>
        <p className="text-h1 font-semibold text-gray-700 mt-2">오류가 발생했어요</p>
        <p className="text-body text-gray-500 mt-2">
          일시적인 오류입니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Button variant="outline" onClick={reset}>
            다시 시도
          </Button>
          <Link href={ROUTES.HOME} className={cn(buttonVariants())}>홈으로</Link>
        </div>
      </div>
    </div>
  );
}
