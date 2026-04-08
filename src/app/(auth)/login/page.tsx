"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "이메일 또는 비밀번호가 올바르지 않습니다."
            : signInError.message === "Email not confirmed"
            ? "이메일 인증이 완료되지 않았습니다."
            : signInError.message
        );
        return;
      }

      if (data?.session) {
        await refreshSession();
        router.replace(ROUTES.HOME);
        router.refresh();
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-h1 font-bold text-gray-900">로그인</h1>
          <p className="text-caption text-gray-500 mt-1">BoardLog에 오신 것을 환영해요</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between">
              <label className="text-caption font-semibold text-gray-700">비밀번호</label>
              <Link href={ROUTES.FORGOT_PASSWORD} className="text-caption text-primary-500 hover:underline">
                비밀번호 찾기
              </Link>
            </div>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
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
