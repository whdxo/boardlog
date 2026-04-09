# 게임 검색 & 선택 API (내 게임 등록용)

> 사용자가 "내 게임" 탭에서 게임을 검색 → 선택하면 상세 정보가 자동으로 채워지는 흐름

---

## 1. 개요

사용자가 보유한 보드게임을 등록할 때, 게임명만 검색하면 나머지 정보(이미지, 인원수, 카테고리, 메카닉, 설명 등)가 자동으로 채워지는 UX를 제공한다.

### 참고 UI (목표)

```
┌─────────────────────────────────────┐
│  [게임 이미지 (썸네일)]               │
├─────────────────────────────────────┤
│  📄 5초준다                          │
│                                     │
│  [3인-10인]                          │  ← 인원수 뱃지
│                                     │
│  [● 파티게임]                        │  ← 카테고리(장르) 뱃지
│                                     │
│  [1)순발력]  [2)퀴즈]                │  ← 메카닉 태그
│                                     │
│  5초안에 3개 말하기                   │  ← 한 줄 설명
│                                     │
│  ⭐                                  │  ← 즐겨찾기/평점
└─────────────────────────────────────┘
```

---

## 2. API 흐름

### 2-1. 게임 검색 API

사용자가 검색창에 게임명을 입력하면 자동완성 형태로 결과를 반환한다.

```
GET /api/games/search?q={검색어}&limit=10
```

**요청 예시:**
```
GET /api/games/search?q=5초준다&limit=10
```

**응답:**
```json
{
  "results": [
    {
      "id": "uuid-xxx",
      "bgg_id": 172932,
      "title": "5 Second Rule",
      "title_kr": "5초준다",
      "thumbnail_url": "https://cf.geekdo-images.com/...",
      "min_players": 3,
      "max_players": 10,
      "categories": ["파티게임"],
      "year_published": 2014
    }
  ],
  "total": 1
}
```

**검색 로직:**
1. 우리 DB에서 `title_kr`, `title` LIKE 검색 (우선)
2. DB 결과가 부족하면 → BGG `/search?query=...` API 호출
3. BGG 결과를 DB에 캐싱 후 함께 반환

### 2-2. 게임 상세 조회 API

검색 결과에서 게임을 선택하면, 카드에 표시할 전체 정보를 가져온다.

```
GET /api/games/{id}
```

**응답:**
```json
{
  "id": "uuid-xxx",
  "bgg_id": 172932,
  "title": "5 Second Rule",
  "title_kr": "5초준다",
  "image_url": "https://cf.geekdo-images.com/...",
  "thumbnail_url": "https://cf.geekdo-images.com/...",
  "min_players": 3,
  "max_players": 10,
  "play_time_min": 20,
  "play_time_max": 30,
  "min_age": 10,
  "year_published": 2014,
  "description": "5초안에 3개 말하기",
  "designer": "Michael Sistrunk",
  "publisher": "PlayMonster",
  "avg_rating": 3.1,
  "rating_count": 2345,
  "weight": 1.0,
  "categories": [
    { "id": 1, "name": "파티게임", "name_en": "Party Game" }
  ],
  "mechanics": [
    { "id": 1, "name": "순발력", "name_en": "Real-Time" },
    { "id": 2, "name": "퀴즈", "name_en": "Trivia" }
  ]
}
```

### 2-3. 내 게임 등록 API

사용자가 게임을 선택 후 "추가" 버튼을 누르면 내 컬렉션에 등록한다.

```
POST /api/my-games
```

**요청:**
```json
{
  "game_id": "uuid-xxx",
  "status": "owned",
  "rating": 5,
  "memo": ""
}
```

**status 옵션:**
| 값 | 의미 |
|---|---|
| `owned` | 보유 중 |
| `wishlist` | 갖고 싶은 게임 |
| `played` | 플레이해본 게임 |
| `sold` | 판매/양도 완료 |

**응답:**
```json
{
  "id": "my-game-uuid",
  "game_id": "uuid-xxx",
  "user_id": "user-uuid",
  "status": "owned",
  "rating": 5,
  "memo": "",
  "created_at": "2026-04-08T12:00:00Z"
}
```

---

## 3. 프론트엔드 UX 흐름

```
[내 게임 탭]
    │
    ▼
[+ 게임 추가] 버튼
    │
    ▼
[검색 모달 / 바텀시트]
    │
    ├── 검색창에 타이핑 → debounce 300ms → GET /api/games/search
    │
    ├── 검색 결과 리스트 (썸네일 + 게임명 + 인원수)
    │
    └── 게임 선택
         │
         ▼
    [게임 카드 프리뷰]  ← GET /api/games/{id} 자동 호출
         │
         ├── 이미지, 이름, 인원수, 카테고리, 메카닉, 설명 자동 표시
         ├── 내 평점 입력 (선택)
         ├── 메모 입력 (선택)
         │
         └── [추가] 버튼 → POST /api/my-games
              │
              ▼
         내 게임 목록에 카드 추가됨
```

---

## 4. 게임 카드 표시 데이터 매핑

| UI 요소 | API 필드 | 표시 형식 | 필수 여부 |
|---------|----------|----------|----------|
| 게임 이미지 | `image_url` | 이미지 | O |
| 게임명 | `title_kr` → `title` 폴백 | 텍스트 | O |
| 인원수 뱃지 | `min_players`, `max_players` | "3인-10인" | O |
| 카테고리 뱃지 | `categories[0].name` | "● 파티게임" | O |
| 메카닉 태그 | `mechanics[].name` | "1)순발력  2)퀴즈" | 선택 |
| 한 줄 설명 | `description` (truncate 30자) | 텍스트 | 선택 |
| 평점/즐겨찾기 | `my_rating` (사용자 입력) | 별점 | 선택 |

### 카테고리 뱃지 색상 규칙

| 카테고리 | 색상 | 예시 |
|---------|------|------|
| 전략 | 파란색 계열 | `bg-blue-100 text-blue-700` |
| 파티게임 | 보라색 계열 | `bg-purple-100 text-purple-700` |
| 가족 | 초록색 계열 | `bg-green-100 text-green-700` |
| 추리/미스터리 | 빨간색 계열 | `bg-red-100 text-red-700` |
| 협동 | 주황색 계열 | `bg-orange-100 text-orange-700` |
| 기타 | 회색 계열 | `bg-gray-100 text-gray-700` |

---

## 5. DB 테이블 설계 (참고)

### user_games (내 게임 컬렉션)

```sql
CREATE TABLE user_games (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id     UUID NOT NULL REFERENCES board_games(id),
  status      TEXT NOT NULL DEFAULT 'owned',   -- owned, wishlist, played, sold
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  memo        TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, game_id)
);

-- RLS 정책
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own games"
  ON user_games FOR ALL
  USING (auth.uid() = user_id);
```

### 필요한 인덱스

```sql
CREATE INDEX idx_user_games_user_id ON user_games(user_id);
CREATE INDEX idx_user_games_status ON user_games(user_id, status);
CREATE INDEX idx_board_games_search ON board_games USING gin(
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(title_kr, ''))
);
```

---

## 6. 고려사항

### 성능
- 검색 API는 debounce 300ms 적용하여 과도한 호출 방지
- BGG API 호출은 캐싱 우선, DB에 없는 게임만 외부 호출
- 게임 상세 데이터는 `last_synced_at` 기준 7일 이내면 캐시 사용

### BGG 데이터 연동
- 한국어 이름(`title_kr`)은 BGG alternate name에서 한글 필터링
- 한글 이름이 없는 경우 영문명 표시, 추후 커뮤니티 기여로 한글명 보완 가능
- 카테고리/메카닉 한글 번역은 매핑 테이블로 관리

### 확장 계획
- Phase 1: 기본 검색 + 게임 추가 (현재 문서 범위)
- Phase 2: 플레이 기록 연동 (날짜, 같이 한 사람, 점수 등)
- Phase 3: 컬렉션 공유, 통계 대시보드
