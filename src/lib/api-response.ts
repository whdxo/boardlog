import { NextResponse } from "next/server";

// ── 공통 에러 코드 ─────────────────────────────────
export const API_ERROR = {
  INVALID_PARAMS: "INVALID_PARAMS",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type ApiErrorCode = (typeof API_ERROR)[keyof typeof API_ERROR];

// ── ApiError 클래스 ────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: ApiErrorCode,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── 응답 헬퍼 ──────────────────────────────────────
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

// ── Route Handler 공통 에러 처리 ───────────────────
export function handleApiError(e: unknown) {
  if (e instanceof ApiError) {
    return fail(e.code, e.message, e.status);
  }
  console.error("[API Error]", e);
  return fail(API_ERROR.SERVER_ERROR, "서버 오류가 발생했습니다", 500);
}
