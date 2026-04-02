# DB 스키마 초안

> MVP 기준 테이블 설계. 실제 구현 시 조정 가능.

---

## Users (회원)

```
users
├── id (PK)
├── email (unique)
├── password_hash
├── nickname (unique)
├── profile_image_url
├── bio
├── social_provider (kakao | google | null)
├── social_id
├── created_at
└── updated_at
```

---

## BoardGames (보드게임)

```
board_games
├── id (PK)
├── title (string)
├── title_en (string, nullable)
├── description (text)
├── min_players (int)
├── max_players (int)
├── play_time_min (int, 분 단위)
├── play_time_max (int)
├── min_age (int)
├── publisher (string)
├── designer (string)
├── year_published (int)
├── image_url
├── bgg_id (BoardGameGeek ID, nullable - 외부 데이터 연동용)
├── avg_rating (float, 캐싱)
├── rating_count (int, 캐싱)
├── created_at
└── updated_at
```

---

## BoardGame Tags (장르/태그)

```
tags
├── id (PK)
├── name (unique)
└── type (genre | mechanic | theme)

board_game_tags (M:N)
├── board_game_id (FK)
└── tag_id (FK)
```

---

## Ratings (평점)

```
ratings
├── id (PK)
├── user_id (FK)
├── board_game_id (FK)
├── score (1~10)
├── created_at
└── updated_at

[unique: user_id + board_game_id]
```

---

## Posts (커뮤니티 게시글)

```
posts
├── id (PK)
├── user_id (FK)
├── title (string)
├── content (text)
├── images (json array, url 목록)
├── tag (후기 | 질문 | 추천 | 정보 | 자유)
├── board_game_id (FK, nullable - 연관 게임)
├── like_count (int, 캐싱)
├── comment_count (int, 캐싱)
├── view_count (int)
├── created_at
└── updated_at
```

---

## Comments (댓글)

```
comments
├── id (PK)
├── post_id (FK)
├── user_id (FK)
├── parent_id (FK, nullable - 대댓글)
├── content (text)
├── created_at
└── updated_at
```

---

## Likes (좋아요)

```
likes
├── id (PK)
├── user_id (FK)
├── target_type (post | comment)
├── target_id (FK)
└── created_at

[unique: user_id + target_type + target_id]
```

---

## User Collections (내 게임 컬렉션)

```
user_collections
├── id (PK)
├── user_id (FK)
├── board_game_id (FK)
├── status (owned | wishlist | played)
├── created_at
└── updated_at

[unique: user_id + board_game_id]
```

---

## Play Logs (플레이 기록)

```
play_logs
├── id (PK)
├── user_id (FK)
├── board_game_id (FK)
├── played_at (date)
├── player_count (int)
├── duration_minutes (int, nullable)
├── memo (text, nullable)
├── created_at
└── updated_at
```

---

## Funding Projects (펀딩)

```
funding_projects
├── id (PK)
├── creator_id (FK → users)
├── board_game_id (FK → board_games, nullable)
├── title (string)
├── description (text)
├── goal_amount (bigint)
├── current_amount (bigint, 캐싱)
├── backer_count (int, 캐싱)
├── status (draft | active | success | failed | ended)
├── starts_at (datetime)
├── ends_at (datetime)
├── thumbnail_url
├── external_url (nullable - 외부 펀딩 링크)
├── created_at
└── updated_at
```

---

## Funding Rewards (리워드 티어)

```
funding_rewards
├── id (PK)
├── project_id (FK)
├── title (string)
├── description (text)
├── amount (bigint)
├── limit_count (int, nullable)
├── backer_count (int, 캐싱)
└── created_at
```
