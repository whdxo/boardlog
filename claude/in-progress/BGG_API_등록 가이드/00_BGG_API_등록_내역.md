# BGG XML API 등록 내역

> 2026-04-08 등록 신청

---

## 등록 정보

| 필드 | 영문 (입력 내용) | 한국어 번역 |
|------|-----------------|------------|
| **Application name** | BoardLog | BoardLog |
| **Your full legal name** | yangjongtae | 양종태 |
| **Organization's name** | (비워둠) | 개인 프로젝트 |
| **Organization's website** | (비워둠) | — |
| **Location** | (비워둠) | — |
| **Contact email** | yangjongtae@life1ceo.com | — |

---

## 활동 설명 (Describe your activities)

**영문 (입력 내용):**
```
I am developing BoardLog, a board game discovery and purchase platform
for Korean users. The platform helps users find board games, read ratings,
and purchase games through external shopping links.
```

**한국어 번역:**
```
BoardLog라는 보드게임 탐색 및 구매 플랫폼을 개발하고 있습니다.
한국 사용자를 대상으로 하며, 보드게임을 찾고, 평점을 읽고,
외부 쇼핑몰 링크를 통해 게임을 구매할 수 있는 플랫폼입니다.
```

---

## API 사용 상세 설명 (Detailed description)

**영문 (입력 내용):**
```
BoardLog will use the BGG XML API to:
1. Fetch board game details (name, player count, play time, age, description, images)
2. Display BGG ratings and statistics on game detail pages
3. Search for board games by name
4. Sync the daily Hot 50 list for the homepage

Data will be cached in our database to minimize API calls.
We will respect rate limits (max 1 request per 5 seconds)
and include proper User-Agent headers.
```

**한국어 번역:**
```
BoardLog는 BGG XML API를 다음과 같이 사용합니다:
1. 보드게임 상세 정보 가져오기 (이름, 인원수, 플레이 시간, 연령, 설명, 이미지)
2. 게임 상세 페이지에 BGG 평점 및 통계 표시
3. 게임명으로 보드게임 검색
4. 홈 페이지용 일일 인기 50 리스트 동기화

API 호출을 최소화하기 위해 데이터를 자체 DB에 캐싱합니다.
Rate limit을 준수하고 (최대 5초당 1회 요청),
적절한 User-Agent 헤더를 포함합니다.
```

---

## 추가 선택 항목

| 필드 | 선택 | 이유 |
|------|------|------|
| **Is your application available to the public?** | **No** | 아직 개발 중이라 비공개 |
| **Your API client(s)** | `boardlog.vercel.app` | 배포 URL |
| **Is your endeavor commercial in nature?** | **Yes** | 외부 쇼핑몰 구매 링크 포함 |
| **How does your application make money?** | **Sales (e.g. an online game store)** | 외부 쇼핑몰 연결 판매 |

---

## 상업적 라이선스 관련 (commercial license agreement)

**영문 (입력 내용):**
```
This is a non-profit side project in early development.
We will properly attribute all data sourced from BGG.
Expected API usage is low (under 1,000 requests/day).
```

**한국어 번역:**
```
초기 개발 단계의 비영리 사이드 프로젝트입니다.
BGG에서 가져온 모든 데이터의 출처를 명시하겠습니다.
예상 API 사용량은 적습니다 (일 1,000건 미만).
```

---

## 추가 정보 (Additional information)

**영문 (입력 내용):**
```
This is a non-profit side project in early development.
We will properly attribute all data sourced from BGG.
Expected API usage is low (under 1,000 requests/day).
```

**한국어 번역:**
```
초기 개발 단계의 비영리 사이드 프로젝트입니다.
BGG에서 가져온 모든 데이터의 출처를 명시하겠습니다.
예상 API 사용량은 적습니다 (일 1,000건 미만).
```

---

## 토큰 발급 후 설정

승인되면 발급받은 토큰을 환경변수에 추가:

```env
# .env.local (로컬 개발)
BGG_API_TOKEN=발급받은_토큰

# Vercel Dashboard (프로덕션)
# Settings → Environment Variables → BGG_API_TOKEN 추가
```

API 호출 시 헤더:
```
Authorization: Bearer {BGG_API_TOKEN}
User-Agent: BoardLog/1.0
```

---

## 상태

- [x] 등록 신청 (2026-04-08)
- [ ] 승인 대기 중
- [ ] 토큰 발급 완료
- [ ] 환경변수 설정 완료
- [ ] API 호출 테스트 완료
