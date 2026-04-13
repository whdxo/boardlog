import { createClient } from "@/lib/supabase/server";
import { ApiError, API_ERROR } from "@/lib/api-response";

// ── 인증 필수 엔드포인트용 헬퍼 ───────────────────
// 비로그인 시 ApiError(401) throw
// 로그인 시 { supabase, user } 반환
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ApiError(401, API_ERROR.UNAUTHORIZED, "로그인이 필요합니다");
  }

  return { supabase, user };
}
