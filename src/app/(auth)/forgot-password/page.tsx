import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-h1 font-bold text-gray-900">비밀번호 찾기</h1>
          <p className="text-caption text-gray-500 mt-1">
            가입한 이메일로 재설정 링크를 보내드려요
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">이메일</label>
            <Input type="email" placeholder="example@email.com" className="h-11" required />
          </div>

          <Button type="submit" className="w-full mt-2">
            재설정 링크 보내기
          </Button>
        </form>

        <Link
          href={ROUTES.LOGIN}
          className="text-center text-caption text-primary-500 hover:underline"
        >
          ← 로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
