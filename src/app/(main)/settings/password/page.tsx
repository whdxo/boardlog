"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileHeader from "@/components/layout/MobileHeader";

export default function PasswordSettingsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="비밀번호 변경" />
      <div className="px-4 md:px-6 py-6">
        <h1 className="text-h1 font-bold text-gray-900 mb-6 hidden md:block">비밀번호 변경</h1>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">현재 비밀번호</label>
            <Input type="password" placeholder="현재 비밀번호 입력" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">새 비밀번호</label>
            <Input type="password" placeholder="8자 이상 입력하세요" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">새 비밀번호 확인</label>
            <Input type="password" placeholder="비밀번호를 한 번 더 입력하세요" className="h-11" />
          </div>
          <Button type="submit" className="w-full mt-2">변경하기</Button>
        </form>
      </div>
    </div>
  );
}
