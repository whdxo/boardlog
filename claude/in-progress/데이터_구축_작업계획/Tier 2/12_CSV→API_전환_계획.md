# CSV → API 데이터 전환 계획

> 작성일: 2026-04-17  
> 목적: Tier 1(CSV 시딩) 데이터를 Tier 2(BGG API)로 전환/보강하는 전략 검토  
> **확정 전략**: CSV 전체 삭제 → API 상위 1,000개 재시딩 + 실시간 BGG 검색으로 나머지 커버  
> **차후 전환 가능**: 속도 이슈 발생 시 CSV 유지 + API 하이브리드로 전환 검토

---

## 0. 확정 전략 요약

### 검색 커버리지 문제 해결 방식

rank 1,001+ 게임(할리갈리, 젠가 등)을 DB 없이 커버하는 방식:

```
유저가 게임 검색
  └─ DB에 있음 (rank 1~1,000) → DB에서 즉시 반환
  └─ DB에 없음 → BGG /search API 실시간 호출 → 결과 표시
                   └─ 유저가 컬렉션 추가 클릭
                       → BGG /thing API로 상세 데이터 가져와 DB에 저장
                       → 이후 조회부터는 DB에서 빠르게 반환
```

| 구분 | 방식 | 비고 |
|------|------|------|
| rank 1~1,000 | DB 저장 (API 풀 데이터) | 이미지, 설명, 인원 등 완전한 데이터 |
| rank 1,001+ | 실시간 BGG API 검색 | 인터넷 필요, 첫 검색만 약간 느림 |
| 컬렉션 추가된 게임 | 온디맨드 DB 저장 | 저장 후엔 DB에서 빠르게 조회 |

### 차후 전환 시나리오 (속도 이슈 발생 시)

CSV 재시딩으로 rank 1,001+ 를 DB에 올려두는 하이브리드 방식으로 전환 가능.  
현재는 실시간 검색으로 먼저 진행하고, 필요 시 검토.

---

## 1. 현재 상태 (Tier 1 CSV 기준)

### DB 행 수

| 테이블 | 행 수 |
|--------|-------|
| `games` | 137,204개 |
| `tags` | 8개 (genre 타입만) |
| `game_tags` | 17,154개 |

### CSV가 채운 필드 vs 채우지 못한 필드

| 필드 | 설명 | CSV 상태 | 값 품질 |
|------|------|---------|---------|
| `bgg_id` | BGG 고유 ID (예: `174430`) — 모든 API 호출의 기준 키 | ✅ 채워짐 | 정확 |
| `title` | 영문 게임명 (예: `Gloomhaven`) | ✅ 채워짐 | 정확 (영문) |
| `title_en` | 영문명 복사본 — `title`과 동일값으로 채움 (API 보강 후 구분 가능) | ✅ 채워짐 | title과 동일 복사본 |
| `release_year` | 최초 출시 연도 (예: `2017`) | ✅ 채워짐 | 정확 |
| `rank` | BGG 전체 보드게임 순위 (예: `4`) — 낮을수록 인기 | ✅ 채워짐 | CSV 다운로드 시점 기준 (오래됨) |
| `avg_rating` | 평균 평점 5점 만점 (BGG 10점 ÷ 2, 예: `4.3`) | ✅ 채워짐 | CSV 기준 (오래됨, ÷2 변환됨) |
| `rating_count` | BGG에서 평점을 매긴 유저 수 (예: `66,981`) | ✅ 채워짐 | CSV 기준 (오래됨) |
| `genres[]` | 장르 배열 (예: `["Strategy", "Thematic"]`) — CSV rank 컬럼 유무로 판별한 8종 | ✅ 채워짐 | 8개 장르 (rank 컬럼 기반) |
| `is_expansion` | 확장팩 여부 — CSV 시딩 시 확장팩 제외했으므로 전부 `false` | ✅ 채워짐 | 정확 (모두 false) |
| `min_players` | 최소 플레이 인원 — CSV에 없어 스키마 기본값 `1`이 들어감 | ⚠️ **기본값 1** | **실제 데이터 아님** |
| `max_players` | 최대 플레이 인원 — CSV에 없어 스키마 기본값 `4`이 들어감 | ⚠️ **기본값 4** | **실제 데이터 아님** |
| `title_kr` | 한국어 게임명 (예: `글룸헤이븐`) — CSV에 없음 | ❌ null | 없음 |
| `description` | 게임 소개 텍스트 (영문, 800~2,800자) — CSV에 없음 | ❌ null | 없음 |
| `thumbnail` | 게임 박스 썸네일 이미지 URL (200×150, CDN) — CSV에 없음 | ❌ null | 없음 |
| `image_url` | 게임 박스 고해상도 이미지 URL (원본 CDN) — CSV에 없음 | ❌ null | 없음 |
| `min_play_time` | 최소 플레이 시간 (분, 예: `60`) — CSV에 없음 | ❌ null | 없음 |
| `max_play_time` | 최대 플레이 시간 (분, 예: `120`) — CSV에 없음 | ❌ null | 없음 |
| `min_age` | 최소 권장 연령 (세, 예: `14`) — CSV에 없음 | ❌ null | 없음 |
| `designer` | 게임 디자이너명 (예: `Isaac Childres`) — CSV에 없음 | ❌ null | 없음 |
| `publisher` | 퍼블리셔명 (예: `Cephalofair Games`) — CSV에 없음 | ❌ null | 없음 |
| `weight` | 게임 난이도 1~5 (예: `3.92`) — BGG 커뮤니티 투표 기반, CSV에 없음 | ❌ null | 없음 |
| `last_synced_at` | BGG API 마지막 동기화 시각 — API 호출 시 현재 시각으로 기록 | ❌ null | 없음 |

> **핵심 문제**: `min_players=1`, `max_players=4`는 Prisma 스키마 default값으로  
> 전체 137,204개 게임에 잘못된 값이 들어가 있음.  
> 현재 인원수 필터가 비활성화된 이유가 이것.

---

## 2. API가 추가/갱신하는 필드 비교

### rank 1~1,000 게임 (API 보강 대상)

| 필드 | 설명 | CSV 값 | API 값 | 처리 |
|------|------|--------|--------|------|
| `title` | 영문 게임명 | CSV 덤프 기준 영문명 | BGG API 기준 최신 공식명 | **덮어쓰기** |
| `rank` | BGG 전체 순위 | CSV 다운로드 당시 순위 | 현재 최신 순위 | **덮어쓰기** |
| `avg_rating` | 5점 만점 평균 평점 | CSV 당시 평점 (÷2) | 현재 최신 평점 (÷2) | **덮어쓰기** |
| `rating_count` | BGG 평점 참여 유저 수 | CSV 당시 수치 | 현재 최신 수치 | **덮어쓰기** |
| `min_players` | 최소 플레이 인원 | **1 (스키마 기본값, 가짜)** | 실제 최소 인원 (예: `1`, `2`) | **덮어쓰기 필수** |
| `max_players` | 최대 플레이 인원 | **4 (스키마 기본값, 가짜)** | 실제 최대 인원 (예: `4`, `6`) | **덮어쓰기 필수** |
| `title_kr` | 한국어 게임명 | null (CSV에 없음) | 한국어 alternate name (예: `글룸헤이븐`) — 상위 1,000개 거의 존재 | **신규 추가** |
| `description` | 게임 소개 텍스트 | null (CSV에 없음) | 영문 설명 800~2,800자 (HTML 엔티티 디코딩 처리) | **신규 추가** |
| `thumbnail` | 썸네일 이미지 URL | null (CSV에 없음) | BGG CDN 200×150 이미지 URL (예: `cf.geekdo-images.com/...`) | **신규 추가** |
| `image_url` | 고해상도 이미지 URL | null (CSV에 없음) | BGG CDN 원본 이미지 URL (게임 상세 페이지용) | **신규 추가** |
| `min_play_time` | 최소 플레이 시간 (분) | null (CSV에 없음) | 실제 최소 시간 (예: `60`) | **신규 추가** |
| `max_play_time` | 최대 플레이 시간 (분) | null (CSV에 없음) | 실제 최대 시간 (예: `120`) | **신규 추가** |
| `min_age` | 권장 최소 연령 (세) | null (CSV에 없음) | 실제 권장 연령 (예: `14`) | **신규 추가** |
| `designer` | 게임 디자이너 이름 | null (CSV에 없음) | 첫 번째 디자이너명 (예: `Isaac Childres`) | **신규 추가** |
| `publisher` | 퍼블리셔 이름 | null (CSV에 없음) | 첫 번째 퍼블리셔명 (예: `Cephalofair Games`) | **신규 추가** |
| `weight` | 게임 난이도 1~5 | null (CSV에 없음) | BGG 커뮤니티 투표 평균 (예: `3.92`) — 1: 매우 쉬움, 5: 매우 어려움 | **신규 추가** |
| `last_synced_at` | BGG API 마지막 동기화 시각 | null (CSV에 없음) | API 호출 시각 (자동 기록) | **신규 추가** |
| `tags` (category) | 게임 카테고리 태그 | 없음 | BGG 공식 카테고리 ~5개/게임 (예: `Adventure`, `Fantasy`, `Fighting`) | **신규 추가** |
| `tags` (mechanic) | 게임 메카닉 태그 | 없음 | BGG 공식 메카닉 ~15개/게임 (예: `Cooperative Game`, `Deck Construction`) | **신규 추가** |

### rank 1,001~137,204 게임 (API 보강 없음)

| 필드 | 설명 | 현재 상태 | 향후 계획 |
|------|------|---------|---------|
| `min_players` | 최소 플레이 인원 | **1 (스키마 기본값, 가짜)** — 실제로는 게임마다 다름 | null로 초기화 필요 |
| `max_players` | 최대 플레이 인원 | **4 (스키마 기본값, 가짜)** — 실제로는 게임마다 다름 | null로 초기화 필요 |
| 나머지 null 필드 | thumbnail, description 등 17개 | 그대로 null — API 호출 계획 없음 | Tier 3+ 이후 검토 |

---

## 3. 전환 전략 ✅ 확정

### 확정: CSV 전체 삭제 → API 1,000개 신규 시딩

**방식**: 기존 CSV 데이터 전체 삭제 → BGG API로 rank 1~1,000 새로 시딩 → rank 1,001+ 는 실시간 검색으로 커버

```
1. games, game_tags 전체 DELETE
2. tags 초기화 (genre 8개 재생성)
3. BGG API /thing으로 rank 1~1,000 시딩 (완전한 데이터)
4. rank 1,001+ 게임 → 실시간 BGG /search API 호출로 커버
```

| 항목 | 내용 |
|------|------|
| 현재 유저 데이터 | collections, ratings, play_logs 모두 0건 → FK 문제 없음 |
| 탐색 페이지 영향 | 없음 (이미 `.limit(1000)` — rank 1,001+ 는 원래 안 보임) |
| 검색 커버리지 | rank 1,001+ → 실시간 BGG API로 해결 |
| 다운타임 | 시딩 중 약 30분~1시간 (서비스 초기 단계라 무관) |

### 참고: 하이브리드 전환 조건 (나중에 검토)

실시간 검색 속도가 체감될 정도로 느려지거나 BGG API 의존도를 낮춰야 할 때 아래로 전환:
- CSV 재다운로드 → rank 1,001+ 재시딩 (title, rank, avg_rating만)
- 검색은 DB 우선, 없으면 BGG API 폴백 유지

---

## 4. 권장 전환 순서 (Option A 기준)

### 4-1. API 보강 전 선행 작업

**스키마 변경 필요**: `min_players`, `max_players`를 nullable로

현재 Prisma 스키마:
```prisma
minPlayers  Int  @default(1) @map("min_players")  // ← 문제
maxPlayers  Int  @default(4) @map("max_players")  // ← 문제
```

변경 후:
```prisma
minPlayers  Int?  @map("min_players")  // null 허용
maxPlayers  Int?  @map("max_players")  // null 허용
```

> `default(1)`, `default(4)`를 제거하고 nullable로 변경.  
> 이렇게 해야 "모름"과 "실제 1인"을 구분 가능.

### 4-2. rank 1,001+ 기본값 초기화

스키마 변경 후, 잘못된 기본값을 null로 초기화:

```sql
UPDATE games
SET min_players = NULL,
    max_players = NULL
WHERE rank IS NULL OR rank > 1000;
```

> 약 136,204개 행 업데이트. 빠르게 처리됨 (인덱스 있음).

### 4-3. rank 1~1,000 API upsert

`scripts/enrich-bgg-api.ts` 실행:
- rank 1~1,000 게임 50배치 × 20개 API 호출
- 각 게임 upsert (모든 필드 업데이트)
- category/mechanic 태그 추가

### 4-4. 완료 후 검증

```sql
-- rank 1~1,000 중 thumbnail 채워진 비율
SELECT COUNT(*) FROM games WHERE rank <= 1000 AND thumbnail IS NOT NULL;

-- min_players 실제값 확인 (null 아닌 것)
SELECT COUNT(*) FROM games WHERE min_players IS NOT NULL;

-- category/mechanic 태그 추가 확인
SELECT type, COUNT(*) FROM tags GROUP BY type;
```

---

## 5. CSV 원본 파일 처리

### 현재 상황
- `data/boardgames_ranks.csv` — Tier 1 시딩에 사용한 파일
- 현재 `data/` 폴더 자체가 없음 (시딩 후 삭제됐거나 gitignore)

### 처리 방안

| 파일 | 용도 | 처리 |
|------|------|------|
| `data/boardgames_ranks.csv` | Tier 1 시딩 완료, 이후 불필요 | **삭제 가능** |
| `scripts/seed-bgg-ranks.ts` | 재시딩 필요 시 재사용 가능 | **보존 권장** |

> CSV 파일은 175,750행 × 약 10개 컬럼으로 수십 MB 크기.  
> 이미 DB에 들어갔고, 필요 시 BGG에서 재다운로드 가능하므로 삭제해도 무방.  
> 단, `git` 이력에 남기지 않도록 주의 (이미 `.gitignore`에 있을 가능성 높음).

---

## 6. 전환 후 데이터 품질 비교 (예상)

| 구분 | Tier 1 (현재) | Tier 2 완료 후 |
|------|------------|-------------|
| rank 1~1,000 필드 충족률 | ~30% (7/22 필드) | ~90% (20/22 필드) |
| rank 1,001+ 필드 충족률 | ~30% (7/22 필드) | ~30% (동일, 단 가짜값 제거) |
| 한국어 게임명 | 0개 | ~50~100개 (상위권) |
| 이미지 있는 게임 | 0개 | 1,000개 |
| 인원수 필터 동작 | ❌ 불가 (가짜값) | ✅ rank 1~1,000 가능 |
| 태그 종류 | genre 8개 | genre 8 + category ~80 + mechanic ~180 |
| game_tags 수 | 17,154개 | ~25,000개 |

---

## 7. 작업 체크리스트

### DB 초기화

- [ ] Prisma 스키마 `minPlayers`, `maxPlayers` → nullable 변경 (`@default` 제거)
- [ ] `prisma db push` 또는 migration 실행
- [ ] `games`, `game_tags` 전체 DELETE
- [ ] `tags` 초기화 (genre 8개 재생성)

### API 시딩

- [ ] `npm install fast-xml-parser html-entities`
- [ ] `scripts/seed-bgg-api.ts` 작성 (rank 1~1,000 신규 시딩)
- [ ] 소량(10개) 테스트 실행
- [ ] 전체 1,000개 실행
- [ ] 완료 검증 쿼리 실행

### 검색 실시간 연동

- [ ] `search/page.tsx` BGG `/search` API 실시간 호출 구현
- [ ] 컬렉션 추가 시 BGG `/thing` API → DB 온디맨드 저장 구현
- [ ] 인원수 필터 (`FilterSheet.tsx`) 활성화
