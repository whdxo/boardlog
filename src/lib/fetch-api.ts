// ── 클라이언트 훅용 fetch 래퍼 ────────────────────
// { success: true, data } 형태의 응답을 처리하고 data를 반환
// 실패 시 error.message를 담은 Error throw
export async function fetchApi<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "요청에 실패했습니다");
  }

  return json.data as T;
}
