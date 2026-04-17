# Tier 2 작업 계획 — BGG API 상세 데이터 보강

> 작성일: 2026-04-16  
> 상태: 🟡 대기 중 (BGG API 토큰 승인 대기)  
> 선행 조건: BGG_API_TOKEN 수신

---

## 1. 목표

BGG `/thing` API로 상위 1,000개 게임의 상세 정보를 보강.  
**대상**: `games` 테이블에서 `rank` 1~1,000위 게임 (이미 DB에 존재)

---

## 2. 채울 필드 목록

| 필드 | 타입 | BGG XML 경로 | 비고 |
|------|------|-------------|------|
| `thumbnail` | TEXT | `thumbnail` | CDN URL |
| `image_url` | TEXT | `image` | 고해상도 |
| `title_kr` | TEXT | `name[@type='alternate']` 중 한글 | 없으면 null |
| `description` | TEXT | `description` | HTML 엔티티 디코딩 필요 |
| `min_players` | INT | `minplayers@value` | parseInt |
| `max_players` | INT | `maxplayers@value` | parseInt |
| `min_play_time` | INT | `minplaytime@value` | parseInt |
| `max_play_time` | INT | `maxplaytime@value` | parseInt |
| `min_age` | INT | `minage@value` | parseInt |
| `designer` | TEXT | `link[@type='boardgamedesigner']@value` | 첫 번째만 |
| `publisher` | TEXT | `link[@type='boardgamepublisher']@value` | 첫 번째만 |
| `weight` | DECIMAL(3,2) | `statistics/ratings/averageweight@value` | 난이도 1~5 |
| `avg_rating` | DECIMAL(3,1) | `statistics/ratings/average@value` | ÷ 2 → 5점 만점 |
| `rating_count` | INT | `statistics/ratings/usersrated@value` | CSV보다 최신 |
| `rank` | INT | `statistics/ratings/ranks/rank[@name='boardgame']@value` | "Not Ranked" → null |
| `last_synced_at` | TIMESTAMPTZ | 현재 시각 | `new Date()` |

---

## 3. 추가 태그 수집

| BGG `link@type` | `tags.type` 값 | 예시 |
|----------------|--------------|------|
| `boardgamecategory` | `"category"` | Negotiation, Economic |
| `boardgamemechanic` | `"mechanic"` | Dice Rolling, Trading |

- Tier 1의 `genre` 타입 태그 8개는 그대로 유지
- `category` ~80개, `mechanic` ~180개 추가 예상
- `game_tags` ~5,000~10,000개 추가 예상

**태그 upsert 흐름:**
```
1. link[@type='boardgamecategory'] 각각 →
     tags.upsert({ where: { name }, create: { name, type: "category" } })
2. game_tags.createMany(skipDuplicates) 로 연결
3. boardgamemechanic도 동일하게 mechanic 타입으로
```

---

## 4. API 호출 스펙

```
GET https://boardgamegeek.com/xmlapi2/thing?id={id1},{id2},...,{id20}&stats=1
Authorization: Bearer {BGG_API_TOKEN}
User-Agent: BoardLog/1.0
```

| 항목 | 값 |
|------|-----|
| 배치 크기 | 20개 (`,`로 ID 묶기) |
| 배치 간 대기 | 5초 |
| 총 배치 수 | 50배치 (1,000 ÷ 20) |
| 예상 소요 시간 | 최소 250초 (실제 30분~1시간) |
| 재시도 | 429/5xx → 10초 대기 후 1회 재시도 |

---

## 5. 스크립트 구조

**파일 위치**: `scripts/enrich-bgg-api.ts`

```typescript
// 흐름
// 1. DB에서 rank 1~1000 게임 조회 → bgg_id 목록 추출
// 2. 20개씩 배치 분할
// 3. 각 배치:
//    a. BGG /thing API 호출 (Authorization 헤더 포함)
//    b. XML 파싱 (fast-xml-parser)
//    c. 각 게임 데이터 추출 + 변환
//    d. games upsert (상세 필드 업데이트)
//    e. category/mechanic tags upsert
//    f. game_tags createMany
//    g. 5초 대기
// 4. 완료 후 통계 출력
```

---

## 6. 필요 패키지

```bash
npm install fast-xml-parser html-entities
```

| 패키지 | 용도 |
|--------|------|
| `fast-xml-parser` | BGG XML 응답 파싱 |
| `html-entities` | description HTML 엔티티 디코딩 |

---

## 7. 데이터 처리 유틸

### description HTML 디코딩

```typescript
import { decode } from 'html-entities'

const cleanDescription = decode(rawDescription)
  .replace(/\r\n|\r|\n/g, '\n')
  .trim()
```

### 한국어 이름 추출

```typescript
function extractKoreanName(alternateNames: string[]): string | null {
  const koreanRegex = /[\uAC00-\uD7A3]/
  return alternateNames.find(name => koreanRegex.test(name)) ?? null
}
```

> 전체 137,204개 중 약 5%만 한국어 alternate name 존재  
> 상위 1,000개 기준 약 50~100개 예상

---

## 8. 환경 변수

`.env.local`에 추가:

```env
BGG_API_TOKEN=발급받은_토큰값
```

> 2026-04-08 등록 신청, 승인 대기 중  
> 토큰 없이 호출 시 `401 Unauthorized` 반환

---

## 9. 작업 순서

| 순서 | 작업 | 조건 |
|------|------|------|
| ① | `BGG_API_TOKEN` 수신 + `.env.local` 등록 | BGG 이메일 도착 후 |
| ② | `npm install fast-xml-parser html-entities` | 즉시 가능 |
| ③ | `scripts/enrich-bgg-api.ts` 작성 | 즉시 가능 |
| ④ | 소량(10개) 테스트 실행으로 파싱 검증 | ① 완료 후 |
| ⑤ | 전체 1,000개 보강 실행 | ④ 확인 후 |
| ⑥ | 태그 한국어 번역 (Tier 3 사전 준비) | ⑤ 완료 후 |

---

## 10. Tier 2 완료 후 예상 DB 상태

```
games (137,204개):
  - rank 1~1,000: 모든 필드 채워짐
      (이미지, 설명, 인원, 시간, 연령, 한국어명 ~50~100개)
  - rank 1,001~: bgg_id, title, rank, avg_rating, rating_count만

tags:
  - genre 타입: 8개 (Tier 1)
  - category 타입: ~80개 (NEW)
  - mechanic 타입: ~180개 (NEW)
  - 총 ~270개

game_tags:
  - Tier 1: 17,154개 (genre 연결)
  - Tier 2 추가: ~5,000~10,000개 (category + mechanic)
  - 총 ~25,000개
```

---

## 11. Tier 2 완료 후 활성화 예정 기능

| 기능 | 파일 | 현재 상태 |
|------|------|-----------|
| 인원수 필터 | `FilterSheet.tsx` | 비활성화 (DB default값만 있음) |
| 게임 썸네일 이미지 | `GameCard.tsx` | 빈 이미지 표시 중 |
| 게임 상세 설명 | 게임 상세 페이지 | 미구현 |
| 플레이 시간 필터 | `FilterSheet.tsx` | 비활성화 |
