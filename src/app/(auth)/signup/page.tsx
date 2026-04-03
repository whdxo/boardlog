import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-h1 font-bold text-gray-900">회원가입</h1>
          <p className="text-caption text-gray-500 mt-1">보드게임 기록을 시작해보세요</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">닉네임</label>
            <Input placeholder="닉네임을 입력하세요" className="h-11" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">이메일</label>
            <Input type="email" placeholder="example@email.com" className="h-11" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">비밀번호</label>
            <Input type="password" placeholder="8자 이상 입력하세요" className="h-11" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">비밀번호 확인</label>
            <Input type="password" placeholder="비밀번호를 한 번 더 입력하세요" className="h-11" required />
          </div>

          <Button type="submit" className="w-full mt-2">
            회원가입
          </Button>
        </form>

        <p className="text-center text-caption text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link href={ROUTES.LOGIN} className="text-primary-500 font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
