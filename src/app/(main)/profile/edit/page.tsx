"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileHeader from "@/components/layout/MobileHeader";

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState("보드게이머");
  const [bio, setBio] = useState("보드게임을 사랑하는 사람입니다 🎲");

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="프로필 수정" />
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        <h1 className="text-h1 font-bold text-gray-900 hidden md:block">프로필 수정</h1>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={36} className="text-primary-500" />
          </div>
          <button type="button" className="text-caption text-primary-500 font-medium hover:underline">
            사진 변경
          </button>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">닉네임</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-11"
              maxLength={20}
            />
            <p className="text-tiny text-gray-400 text-right">{nickname.length}/20</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">한 줄 소개</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-body resize-none"
            />
            <p className="text-tiny text-gray-400 text-right">{bio.length}/100</p>
          </div>

          <Button type="submit" className="w-full mt-2">
            저장하기
          </Button>
        </form>
      </div>
    </div>
  );
}
