# BGG API 응답 전체 필드 분석

> 작성일: 2026-04-16  
> 엔드포인트: `GET https://boardgamegeek.com/xmlapi2/thing?id={bgg_id}&stats=1`  
> 샘플 게임: Gloomhaven (bgg_id: 174430, rank: 4)

---

## 1. 최상위 속성

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `item@type` | `boardgame` | 항목 타입 |
| `item@id` | `174430` | BGG 고유 ID |

---

## 2. 이미지

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `thumbnail` | `https://cf.geekdo-images.com/.../pic2437871.jpg` | 200x150 썸네일 CDN URL |
| `image` | `https://cf.geekdo-images.com/.../pic2437871.jpg` | 원본 고해상도 이미지 URL |

---

## 3. 이름

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `name[@type='primary']@value` | `Gloomhaven` | 대표 영문명 |
| `name[@type='alternate']@value` (복수) | `글룸헤이븐`, `グルームヘイヴン`, `幽港迷城` 등 | 각국 번역명 |

> 한국어 이름 추출: `alternate` 중 `/[\uAC00-\uD7A3]/` 정규식으로 필터

---

## 4. 설명

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `description` | `Gloomhaven is a game of Euro-inspired...` | 게임 소개 텍스트 (1,000~2,000자) |

> `&amp;ldquo;`, `&#10;` 등 HTML 엔티티 포함 → `html-entities` 라이브러리로 디코딩 필요

---

## 5. 기본 수치

| XML 경로 | 샘플 값 | DB 컬럼 | 처리 |
|---------|---------|---------|------|
| `yearpublished@value` | `2017` | `release_year` | parseInt |
| `minplayers@value` | `1` | `min_players` | parseInt |
| `maxplayers@value` | `4` | `max_players` | parseInt |
| `playingtime@value` | `120` | — | minplaytime/maxplaytime과 중복, 미사용 |
| `minplaytime@value` | `60` | `min_play_time` | parseInt |
| `maxplaytime@value` | `120` | `max_play_time` | parseInt |
| `minage@value` | `14` | `min_age` | parseInt |

---

## 6. poll — 추천 인원수 (suggested_numplayers)

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `poll[@name='suggested_numplayers']@totalvotes` | `1631` | 총 투표수 |
| `results[@numplayers='N']/result[@value='Best']@numvotes` | `809` (3인 기준) | N인 Best 투표수 |
| `results[@numplayers='N']/result[@value='Recommended']@numvotes` | `540` | N인 Recommended 투표수 |
| `results[@numplayers='N']/result[@value='Not Recommended']@numvotes` | `41` | N인 Not Recommended 투표수 |
| `poll-summary/result[@name='bestwith']@value` | `Best with 3 players` | 최적 인원 요약 |
| `poll-summary/result[@name='recommmendedwith']@value` | `Recommended with 1–4 players` | 추천 인원 범위 요약 |

> 현재 DB에 미저장. 향후 게임 상세 페이지 UX 활용 가능 (베스트 인원 뱃지 등)

---

## 7. poll — 추천 연령 (suggested_playerage)

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `poll[@name='suggested_playerage']@totalvotes` | `336` | 총 투표수 |
| `results/result@value` | `8`, `10`, `12`, `14`... | 연령 선택지 |
| `results/result@numvotes` | `156` (14세 최다) | 각 연령별 투표수 |

> 공식 `minage`(14)와 별개로 커뮤니티 권장 연령 데이터

---

## 8. poll — 언어 의존도 (language_dependence)

| XML 경로 | 샘플 값 | 설명 |
|---------|---------|------|
| `poll[@name='language_dependence']@totalvotes` | `72` | 총 투표수 |
| `results/result@level` | `1`~`5` | 의존도 단계 |
| `results/result@value` | `No necessary in-game text` ~ `Unplayable in another language` | 단계 설명 |
| `results/result@numvotes` | level4: 48표, level5: 21표 (글룸헤이븐) | 각 단계 투표수 |

> 한국어 지원 없는 게임 필터링에 활용 가능

---

## 9. 통계 (statistics/ratings)

| XML 경로 | 샘플 값 | DB 컬럼 | 처리 |
|---------|---------|---------|------|
| `usersrated@value` | `66981` | `rating_count` | parseInt |
| `average@value` | `8.54107` | `avg_rating` | ÷2 → 4.3 (5점 만점) |
| `bayesaverage@value` | `8.29968` | — | BGG 내부 보정 평균, 미사용 |
| `stddev@value` | `1.73651` | — | 평점 표준편차, 미사용 |
| `median@value` | `0` | — | 미사용 |
| `owned@value` | `104315` | — | 소유자 수 |
| `trading@value` | `1296` | — | 판매 희망자 수 |
| `wanting@value` | `1164` | — | 구매 희망자 수 |
| `wishing@value` | `22244` | — | 위시리스트 등록 수 |
| `numcomments@value` | `11690` | — | 댓글 수 |
| `numweights@value` | `2753` | — | 난이도 투표 수 |
| `averageweight@value` | `3.9179` | `weight` | parseFloat, 난이도 1~5 |

### 9-1. ranks (서브 랭킹)

| XML 경로 | 샘플 값 | DB 컬럼 | 처리 |
|---------|---------|---------|------|
| `ranks/rank[@name='boardgame']@value` | `4` | `rank` | parseInt, "Not Ranked" → null |
| `ranks/rank[@name='boardgame']@bayesaverage` | `8.29968` | — | 미사용 |
| `ranks/rank[@name='thematic']@value` | `2` | — | 테마 게임 내 순위 |
| `ranks/rank[@name='thematic']@friendlyname` | `Thematic Rank` | — | |
| `ranks/rank[@name='strategygames']@value` | `5` | — | 전략 게임 내 순위 |

> 서브랭킹(`thematic`, `strategygames` 등)은 현재 DB 미저장. 장르별 순위 표시에 활용 가능

---

## 10. link 타입 전체 목록

| link type | 샘플 수 (글룸헤이븐) | 설명 | DB 저장 여부 |
|-----------|------------|------|------------|
| `boardgamecategory` | 5개 | 게임 카테고리 (Adventure, Fantasy 등) | ✅ Tier 2 저장 예정 (`tags` + `game_tags`) |
| `boardgamemechanic` | 24개 | 게임 메카닉 (Cooperative, Deck Building 등) | ✅ Tier 2 저장 예정 (`tags` + `game_tags`) |
| `boardgamedesigner` | 1개 | 디자이너 이름 | ✅ `designer` 컬럼 (첫 번째만) |
| `boardgamepublisher` | 11개 | 퍼블리셔 이름 | ✅ `publisher` 컬럼 (첫 번째만) |
| `boardgameartist` | 4개 | 일러스트레이터 | ❌ 미저장 |
| `boardgamefamily` | 18개 | 게임 패밀리/시리즈 (Dungeon Crawler, Miniatures 등) | ❌ 미저장 |
| `boardgameexpansion` | 19개 | 이 게임의 확장팩 목록 | ❌ 미저장 |
| `boardgameimplementation` | 1개 | 리메이크/2판 연결 (Gloomhaven 2nd Edition) | ❌ 미저장 |
| `boardgameintegration` | 2개 | 연동 가능 게임 (Frosthaven, Jaws of the Lion) | ❌ 미저장 |
| `boardgameaccessory` | 69개 | 액세서리/굿즈 목록 | ❌ 미저장 |

---

## 11. 필드 활용 계획 요약

### ✅ Tier 2에서 DB 저장할 필드

| DB 컬럼 | BGG 소스 |
|---------|---------|
| `thumbnail` | `<thumbnail>` |
| `image_url` | `<image>` |
| `title_kr` | `name[@type='alternate']` 한글 필터 |
| `description` | `<description>` (HTML 디코딩) |
| `min_players` | `minplayers@value` |
| `max_players` | `maxplayers@value` |
| `min_play_time` | `minplaytime@value` |
| `max_play_time` | `maxplaytime@value` |
| `min_age` | `minage@value` |
| `designer` | `link[@type='boardgamedesigner']` 첫 번째 |
| `publisher` | `link[@type='boardgamepublisher']` 첫 번째 |
| `avg_rating` | `average@value` ÷ 2 |
| `rating_count` | `usersrated@value` |
| `weight` | `averageweight@value` |
| `rank` | `ranks/rank[@name='boardgame']@value` |
| `last_synced_at` | 현재 시각 |
| `tags` (category) | `link[@type='boardgamecategory']` |
| `tags` (mechanic) | `link[@type='boardgamemechanic']` |

### ⏳ 향후 활용 가능한 미저장 필드

| 데이터 | 활용 아이디어 |
|--------|-------------|
| `owned` / `wishing` | 인기도 보조 지표, 트렌딩 게임 추천 |
| `bestwith` / `recommendedwith` | 게임 카드에 "3인 최적" 뱃지 표시 |
| `language_dependence` | "한국어 필요" 필터 |
| `boardgamefamily` | 시리즈 묶음 탐색 (Dungeon Crawler 등) |
| `boardgameexpansion` | 게임 상세 페이지 확장팩 목록 |
| `boardgameintegration` | "이 게임과 합칠 수 있어요" 추천 |
| `stddev` | 취향 갈리는 게임 경고 표시 |
| 서브랭킹 (`thematic`, `strategygames` 등) | 장르별 TOP 랭킹 |

---

## 12. 주의사항

| 항목 | 내용 |
|------|------|
| HTML 엔티티 | `description`에 `&amp;`, `&#10;`, `&ldquo;` 등 포함 → `html-entities` 디코딩 필요 |
| "Not Ranked" | `rank` 값이 숫자 대신 문자열 `"Not Ranked"` 일 수 있음 → null 처리 |
| 배치 한도 | 한 번 요청에 ID 최대 20개 권장 |
| Rate limit | 요청 간 5초 대기, 429 응답 시 10초 후 재시도 |
| `playingtime` | `minplaytime` / `maxplaytime`과 중복 — `minplaytime`/`maxplaytime` 사용 권장 |
| publisher 복수 | 퍼블리셔가 11개까지 존재 — 첫 번째(국내 유통사 아님)만 저장, 추후 검토 필요 |
