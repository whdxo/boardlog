# Supabase 설정 가이드

---

## 1. Supabase 프로젝트 생성

### 1-1. 계정 및 프로젝트
1. [supabase.com](https://supabase.com) 가입
2. New Project 생성
   - **Organization**: 본인 조직 선택
   - **Project name**: `boardlog`
   - **Database password**: 안전한 비밀번호 생성 (별도 보관)
   - **Region**: `Northeast Asia (Tokyo)` — 한국 사용자 대상 최저 레이턴시
   - **Plan**: Free tier (MVP 단계)

### 1-2. 무료 플랜 제한 사항
| 항목 | 제한 |
|------|------|
| DB 용량 | 500MB |
| 스토리지 | 1GB |
| MAU | 50,000 |
| Edge Functions 호출 | 500,000/월 |
| Realtime 동시 접속 | 200 |
| 프로젝트 수 | 2개 |
| 비활성 일시중지 | 1주일 미사용 시 |

> MVP 개발 및 초기 운영에는 충분. 사용자 증가 시 Pro 플랜($25/월) 전환.

---

## 2. 환경변수 설정

### 2-1. Supabase 키 확인
Supabase Dashboard → Settings → API 에서 확인:
- **Project URL**: `https://<project-ref>.supabase.co`
- **anon (public) key**: 클라이언트에서 사용 (RLS로 보호)
- **service_role key**: 서버 전용 (절대 클라이언트 노출 금지)

### 2-2. .env.local 파일 생성
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

> `.env.local`은 `.gitignore`에 이미 포함되어 있으므로 커밋되지 않음.

---

## 3. 패키지 설치

```bash
npm install @supabase/supabase-js @supabase/ssr
```

| 패키지 | 용도 |
|--------|------|
| `@supabase/supabase-js` | Supabase 클라이언트 (DB, Auth, Storage) |
| `@supabase/ssr` | Next.js App Router 전용 SSR/SSC 지원 |

---

## 4. Supabase 클라이언트 설정

### 4-1. 파일 구조
```
src/
  lib/
    supabase/
      client.ts       ← 브라우저(Client Component)용
      server.ts       ← 서버(Server Component, Route Handler)용
      middleware.ts    ← 미들웨어 (세션 갱신)용
      admin.ts        ← service_role 키 사용 (서버 전용)
```

### 4-2. 브라우저 클라이언트 (`client.ts`)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 4-3. 서버 클라이언트 (`server.ts`)
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서는 set 불가 — 무시
          }
        },
      },
    }
  );
}
```

### 4-4. 미들웨어 클라이언트 (`middleware.ts`)
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (중요: 이 호출로 만료된 토큰이 자동 갱신됨)
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

### 4-5. Admin 클라이언트 (`admin.ts`)
```typescript
import { createClient } from "@supabase/supabase-js";

// RLS를 우회하는 서버 전용 클라이언트
// Route Handler, Server Action에서만 사용
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### 4-6. 루트 미들웨어 (`src/middleware.ts`)
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 5. 타입 자동 생성

Supabase CLI로 DB 스키마에서 TypeScript 타입을 자동 생성할 수 있다.

```bash
# Supabase CLI 설치
npm install -D supabase

# 로그인
npx supabase login

# 타입 생성
npx supabase gen types typescript --project-id <project-ref> > src/types/supabase.ts
```

> 스키마 변경 시 재실행하여 타입을 최신 상태로 유지.

---

## 6. 연동 확인 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] `.env.local`에 URL, anon key, service role key 설정
- [ ] `@supabase/supabase-js`, `@supabase/ssr` 설치
- [ ] `src/lib/supabase/` 클라이언트 4개 파일 생성
- [ ] `src/middleware.ts` 세션 갱신 미들웨어 설정
- [ ] 브라우저에서 Supabase 연결 확인 (콘솔 로그)
- [ ] `npx supabase gen types` 타입 생성 확인
