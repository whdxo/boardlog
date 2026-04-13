"use client";

import { useState, useRef } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileHeader from "@/components/layout/MobileHeader";
import LoginPrompt from "@/components/common/LoginPrompt";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  nickname: string;
  bio: string | null;
  profile_image: string | null;
}

// profile이 준비된 후에만 마운트 — useState 초기값을 직접 사용
function ProfileEditForm({ profile, refreshSession }: { profile: Profile; refreshSession: () => Promise<unknown> }) {
  const [nickname, setNickname] = useState(profile.nickname ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profile_image ?? null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      let profileImageUrl: string | undefined;

      // 이미지 업로드 (변경된 경우만)
      if (pendingFile && profile) {
        const supabase = createClient();
        const ext = pendingFile.name.split(".").pop() ?? "jpg";
        const path = `avatars/${profile.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, pendingFile, { upsert: true });

        if (uploadError) throw new Error("이미지 업로드에 실패했습니다");

        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
        profileImageUrl = publicUrl;
      }

      return fetchApi("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          nickname: nickname.trim(),
          bio: bio.trim(),
          ...(profileImageUrl ? { profile_image: profileImageUrl } : {}),
        }),
      });
    },
    onSuccess: () => {
      setSuccessMsg("저장되었습니다");
      setPendingFile(null);
      setErrorMsg(null);
      void refreshSession();
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (e: Error) => {
      setErrorMsg(e.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="프로필 수정" />
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        <h1 className="text-h1 font-bold text-gray-900 hidden md:block">프로필 수정</h1>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <Image src={previewUrl} alt="프로필" fill className="object-cover" />
            ) : (
              <User size={36} className="text-primary-500" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-caption text-primary-500 font-medium hover:underline"
          >
            사진 변경
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">닉네임</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-11"
              maxLength={20}
              minLength={2}
              required
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

          {errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-sm text-green-600">{successMsg}</p>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={saveMutation.isPending || !nickname.trim()}
          >
            {saveMutation.isPending ? "저장 중..." : "저장하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ProfileEditPage() {
  const { isLoggedIn, isLoading, profile, refreshSession } = useAuthStore();

  if (isLoading || !profile) return null;
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginPrompt />
      </div>
    );
  }

  return <ProfileEditForm profile={profile} refreshSession={refreshSession} />;
}
