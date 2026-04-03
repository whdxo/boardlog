import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-sm">
        <p className="text-[80px] leading-none mb-4">🎲</p>
        <h1 className="text-display font-bold text-gray-900">404</h1>
        <p className="text-h1 font-semibold text-gray-700 mt-2">페이지를 찾을 수 없어요</p>
        <p className="text-body text-gray-500 mt-2">
          요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있어요.
        </p>
        <Link href={ROUTES.HOME} className={cn(buttonVariants(), "mt-8")}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
