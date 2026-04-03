import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-h1 font-bold text-gray-900">로그인</h1>
          <p className="text-caption text-gray-500 mt-1">BoardLog에 오신 것을 환영해요</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">이메일</label>
            <Input type="email" placeholder="example@email.com" className="h-11" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-caption font-semibold text-gray-700">비밀번호</label>
              <Link href={ROUTES.FORGOT_PASSWORD} className="text-caption text-primary-500 hover:underline">
                비밀번호 찾기
              </Link>
            </div>
            <Input type="password" placeholder="비밀번호를 입력하세요" className="h-11" required />
          </div>

          <Button type="submit" className="w-full mt-2">
            로그인
          </Button>
        </form>

        <p className="text-center text-caption text-gray-500">
          아직 계정이 없으신가요?{" "}
          <Link href={ROUTES.SIGNUP} className="text-primary-500 font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
