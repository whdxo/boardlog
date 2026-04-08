"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (nickname.length < 2 || nickname.length > 20) {
      setError("닉네임은 2~20자로 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 1. 회원가입 시도
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      });

      // 2. 세션이 바로 왔으면 성공
      if (data?.session) {
        window.location.href = "/";
        return;
      }

      // 3. signUp 에러가 "already registered"이면 안내
      if (signUpError?.message?.includes("already registered")) {
        setError("이미 가입된 이메일입니다.");
        return;
      }

      // 4. 유저는 생성됐지만 세션이 없는 경우 (트리거 에러 포함)
      //    → 바로 로그인 시도
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (loginData?.session) {
        window.location.href = "/";
        return;
      }

      // 5. 로그인도 실패
      if (loginError) {
        setError("가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 페이지에서 시도해주세요.");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-h1 font-bold text-gray-900">회원가입</h1>
          <p className="text-caption text-gray-500 mt-1">보드게임 기록을 시작해보세요</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">닉네임</label>
            <Input
              placeholder="닉네임을 입력하세요 (2~20자)"
              className="h-11"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">이메일</label>
            <Input
              type="email"
              placeholder="example@email.com"
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">비밀번호</label>
            <Input
              type="password"
              placeholder="8자 이상 입력하세요"
              className="h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold text-gray-700">비밀번호 확인</label>
            <Input
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              className="h-11"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
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
