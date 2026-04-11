# Tier 1 완료 보고 + Tier 2 준비 가이드

> 작성일: 2026-04-10  
> 상태: Tier 1 완료 / Tier 2 대기 중 (BGG API 토큰 승인 대기)

---

## 1. Tier 1 완료 보고

### 작업 내용

BGG 공식 덤프 CSV(`data/boardgames_ranks.csv`, 175,750행)를 파싱해서 Supabase PostgreSQL에 시딩.

### 최종 결과

| 테이블 | 행 수 | 비고 |
|--------|-------|------|
| `board_games` | **137,204개** | 확장팩(38,546개) 제외한 기본 게임만 |
| `tags` | **8개** | 장르 카테고리 (아래 참고) |
| `board_game_tags` | **17,154개** | 게임-태그 M:N 연결 |

### 태그 목록 (8개)

| name | nameKr | type |
|------|--------|------|
| Abstract | 추상 | genre |
| Customizable | 커스텀 | genre |
| Children | 어린이 | genre |
| Family | 가족 | genre |
| Party | 파티 | genre |
| Strategy | 전략 | genre |
| Thematic | 테마 | genre |
| War | 워게임 | genre |

> CSV의 `abstracts_rank`, `cgs_rank`, `childrensgames_rank`, `familygames_rank`, `partygames_rank`, `strategygames_rank`, `thematic_rank`, `wargames_rank` 컬럼 기반으로 생성.
> 해당 rank 컬럼에 값이 있는 게임만 태그 연결됨.

### 현재 board_games 필드 현황

```
✅ 채워진 필드:
  bgg_id          (BGG 고유 ID)
  title           (영문 게임명)
  year_published  (출시 연도)
  bgg_rank        (BGG 전체 순위)
  avg_rating      (평균 평점, BGG average ÷ 2 → 5점 만점)
  rating_count    (평가 유저 수)
  is_expansion    (false, 확장팩 제외했으므로)

❌ 비어있는 필드 (Tier 2에서 채울 것):
  title_kr        (한국어 게임명)
  description     (게임 설명)
  min_players     (최소 인원)
  max_players     (최대 인원)
  play_time_min   (최소 플레이 시간)
  play_time_max   (최대 플레이 시간)
  min_age         (최소 연령)
  publisher       (퍼블리셔)
  designer        (디자이너)
  image_url       (고해상도 이미지)
  thumbnail_url   (썸네일 이미지)
  weight          (난이도 1~5)
  last_synced_at  (API 동기화 시각)
```

### 트러블슈팅 이력

| 문제 | 원인 | 해결 |
|------|------|------|
| `prisma db push` 행 없음 | Prisma 7에서 `schema.prisma`에 `url` 사용 불가 | `url`/`directUrl` 제거 → `prisma.config.js`로 이동 |
| `prisma db push` P4002 오류 | Supabase `public.profiles → auth.users` 크로스 스키마 참조 감지 | `db push` 대신 `db execute`로 raw SQL 직접 실행 |
| `$transaction` 타임아웃 | 1000개 upsert를 단일 트랜잭션에서 실행 (5초 초과) | `createMany + skipDuplicates`로 교체 |
| CSV 파일 `bgg_ranks.csv` 읽기 불가 | macOS 보안으로 터미널에서 접근 불가 (파일은 존재) | `boardgames_ranks.csv` (동일 데이터 복사본) 사용 |

### 스크립트 위치

```
scripts/seed-bgg-ranks.ts   — Tier 1 시딩 스크립트
prisma/schema.prisma        — DB 스키마
prisma/migrations/0_init/migration.sql — 테이블 생성 SQL
```

---

## 2. Tier 2 준비 가이드

### 2.1 목표

BGG `/thing` API로 상위 1,000개 게임의 상세 정보를 보강.  
**대상**: `bgg_rank` 1~1000위 게임 (이미 DB에 존재)

### 2.2 BGG API → DB 필드 매핑

#### board_games 테이블 업데이트 대상

| BGG XML 경로 | DB 컬럼 | 처리 방식 | 비고 |
|-------------|---------|----------|------|
| `thumbnail` | `thumbnail_url` | 그대로 저장 | CDN URL |
| `image` | `image_url` | 그대로 저장 | 고해상도 |
| `name[@type='primary']@value` | `title` | 덮어씀 | 이미 있지만 정확도 보강 |
| `name[@type='alternate']` 중 한글 필터 | `title_kr` | 정규식 `/[\uAC00-\uD7A3]/` | 없으면 null |
| `description` | `description` | HTML 엔티티 디코딩 필요 | `he` 라이브러리 사용 권장 |
| `minplayers@value` | `min_players` | parseInt | |
| `maxplayers@value` | `max_players` | parseInt | |
| `minplaytime@value` | `play_time_min` | parseInt | `playingtime`이 아닌 `minplaytime` |
| `maxplaytime@value` | `play_time_max` | parseInt | |
| `minage@value` | `min_age` | parseInt | |
| `link[@type='boardgamedesigner']@value` | `designer` | 첫 번째만 (쉼표 join도 가능) | |
| `link[@type='boardgamepublisher']@value` | `publisher` | 첫 번째만 | |
| `statistics/ratings/averageweight@value` | `weight` | parseFloat → Decimal(3,2) | 난이도 1~5 |
| `statistics/ratings/average@value` | `avg_rating` | ÷ 2, 반올림 → Decimal(3,1) | 10점→5점 변환 |
| `statistics/ratings/usersrated@value` | `rating_count` | parseInt | CSV보다 더 최신 |
| `statistics/ratings/ranks/rank[@name='boardgame']@value` | `bgg_rank` | parseInt, "Not Ranked" → null | |
| 현재 시각 | `last_synced_at` | `new Date()` | |

#### tags + board_game_tags 추가 대상

| BGG `link@type` | tag `type` 값 | 예시 |
|----------------|--------------|------|
| `boardgamecategory` | `"category"` | Negotiation, Economic |
| `boardgamemechanic` | `"mechanic"` | Dice Rolling, Trading |

> Tier 1에서 만든 `genre` 태그(8개)는 그대로 유지.  
> Tier 2에서 `category`, `mechanic` 타입 태그가 추가됨.

**태그 upsert 흐름:**
```
1. link[@type='boardgamecategory'] 각각 →
     tags.upsert({ where: { name }, create: { name, type: "category" } })
2. board_game_tags.createMany(skipDuplicates) 로 연결
3. boardgamemechanic도 동일하게 mechanic 타입으로
```

### 2.3 API 호출 구조

```
GET https://boardgamegeek.com/xmlapi2/thing?id={id1},{id2},...,{id20}&stats=1
Authorization: Bearer {BGG_API_TOKEN}
User-Agent: BoardLog/1.0
```

- **배치**: 20개씩 (`,`로 ID 묶기)
- **Rate limit**: 요청 사이 5초 대기
- **1,000개 기준**: 50배치 × 5초 = 250초 최소 (실제 30분~1시간)
- **재시도**: 429/5xx → 10초 대기 후 1회 재시도

### 2.4 description HTML 디코딩

BGG description에는 HTML 엔티티가 포함됨:
```
&amp; → &
&#10; → 개행
&mdash; → —
&ouml; → ö
```

권장 처리:
```typescript
import { decode } from 'html-entities'  // npm i html-entities

const cleanDescription = decode(rawDescription)
  .replace(/\r\n|\r|\n/g, '\n')  // 줄바꿈 정규화
  .trim()
```

### 2.5 한국어 이름 추출

```typescript
function extractKoreanName(alternateNames: string[]): string | null {
  const koreanRegex = /[\uAC00-\uD7A3]/
  const found = alternateNames.find(name => koreanRegex.test(name))
  return found ?? null
}
```

> 전체 137,204개 중 약 5%만 한국어 alternate name 존재.  
> 상위 1,000개 기준으로는 약 50~100개 예상.

### 2.6 스크립트 구조 (작성 예정)

```
scripts/enrich-bgg-api.ts

흐름:
1. DB에서 bgg_rank 1~1000 게임 조회 (bggId 목록 추출)
2. 20개씩 배치 분할
3. 각 배치:
   a. BGG /thing API 호출 (Authorization 헤더 포함)
   b. XML 파싱 (xml2js 또는 fast-xml-parser)
   c. 각 게임 데이터 추출 + 변환
   d. board_games upsert (상세 필드 업데이트)
   e. 카테고리/메카닉 tags upsert
   f. board_game_tags createMany
   g. 5초 대기
4. 완료 후 통계 출력
```

### 2.7 환경 변수 (필요)

```env
# .env.local에 추가 필요
BGG_API_TOKEN=발급받은_토큰값
```

> 현재 상태: 2026-04-08 등록 신청, **승인 대기 중**  
> 토큰 없이 호출 시 `401 Unauthorized` 반환

### 2.8 필요 패키지

```bash
npm install fast-xml-parser html-entities
```

| 패키지 | 용도 |
|--------|------|
| `fast-xml-parser` | BGG XML 응답 파싱 |
| `html-entities` | description HTML 엔티티 디코딩 |

---

## 3. Tier 2 완료 후 예상 DB 상태

```
board_games (137,204개):
  - 1~1,000위: 모든 필드 채워짐 (이미지, 설명, 인원, 시간, 한국어 ~50개)
  - 1,001위~: bgg_id, title, bgg_rank, avg_rating, rating_count만

tags:
  - genre 타입: 8개 (Tier 1)
  - category 타입: ~80개 (BGG 카테고리)
  - mechanic 타입: ~180개 (BGG 메카닉)
  - 총 ~270개

board_game_tags:
  - Tier 1: 17,154개 (genre 연결)
  - Tier 2 추가: 상위 1,000개 × 평균 5~10개 태그 ≈ 5,000~10,000개 추가
  - 총 ~25,000개
```

---

## 4. 다음 액션

| 순서 | 작업 | 조건 |
|------|------|------|
| ① | `BGG_API_TOKEN` 수신 + `.env.local` 등록 | BGG 이메일 도착 후 |
| ② | `npm install fast-xml-parser html-entities` | 즉시 가능 |
| ③ | `scripts/enrich-bgg-api.ts` 작성 | 즉시 가능 |
| ④ | 소량(10개) 테스트 실행으로 파싱 검증 | ① 완료 후 |
| ⑤ | 전체 1,000개 보강 실행 | ④ 확인 후 |
| ⑥ | 태그 한국어 번역 (Tier 3 사전 준비) | ⑤ 완료 후 |
