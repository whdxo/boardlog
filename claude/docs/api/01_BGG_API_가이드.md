# BGG XML API2 가이드

> BoardGameGeek API에서 제공하는 데이터와 사용법 정리
> ⚠️ 2025년부터 인증 토큰 필수 (아래 인증 섹션 참고)

---

## 1. API 개요

| 항목 | 내용 |
|------|------|
| Base URL | `https://boardgamegeek.com/xmlapi2/` |
| 응답 형식 | XML (JSON 없음) |
| 인증 | **토큰 필수** (2025년~ 변경됨) |
| 비용 | 무료 |
| Rate Limit | 공식 명시 없음, 5초에 1회 권장 |

---

## 2. ⚠️ 인증 (2025년 변경사항)

BGG는 2025년부터 XML API에 **인증 토큰을 필수**로 요구합니다.

### 토큰 발급 방법

1. [BGG 계정](https://boardgamegeek.com) 가입 (무료)
2. [API 등록 페이지](https://boardgamegeek.com/using_the_xml_api) 접속
3. 앱 이름, 설명, 용도 입력하여 등록 신청
4. 승인 후 **Authorization Token** 발급

### 요청 시 헤더 포함

```
GET /xmlapi2/thing?id=13&stats=1
Host: boardgamegeek.com
Authorization: Bearer {YOUR_TOKEN}
User-Agent: BoardLog/1.0
```

### 환경변수

```
BGG_API_TOKEN=발급받은토큰
```

> 토큰 없이 요청하면 `401 Unauthorized` 반환됨

---

## 3. 엔드포인트 상세

### 3.1 게임 상세 — `/thing`

**가장 핵심. 게임의 모든 정보를 제공.**

```
GET /xmlapi2/thing?id=13&stats=1&type=boardgame
```

| 파라미터 | 필수 | 설명 |
|----------|------|------|
| `id` | ✅ | BGG 게임 ID. 쉼표로 최대 20개 배치 가능 (`id=13,174430,822`) |
| `type` | | `boardgame`, `boardgameexpansion` |
| `stats` | | `1` → 평점/랭킹/통계 포함 (필수로 넣기) |
| `versions` | | `1` → 에디션/버전 정보 |
| `videos` | | `1` → 관련 동영상 |
| `marketplace` | | `1` → 마켓 판매 정보 |
| `comments` | | `1` → 유저 댓글 |

#### 반환 필드 — 기본 정보

| XML 필드 | 설명 | 예시 |
|----------|------|------|
| `item@id` | BGG 고유 ID | `13` |
| `item@type` | 타입 | `boardgame` |
| `name[@type='primary']@value` | **기본 이름 (영문)** | `Catan` |
| `name[@type='alternate']@value` | **대체 이름 (다국어, 복수)** | `카탄`, `カタン`, `Колонизаторы` |
| `description` | 게임 설명 (HTML 인코딩) | 긴 텍스트 |
| `thumbnail` | 썸네일 이미지 URL | `https://cf.geekdo-images.com/...` |
| `image` | 고해상도 이미지 URL | `https://cf.geekdo-images.com/...` |
| `yearpublished@value` | 출시 연도 | `1995` |
| `minplayers@value` | 최소 인원 | `3` |
| `maxplayers@value` | 최대 인원 | `4` |
| `playingtime@value` | 플레이 시간 (분) | `120` |
| `minplaytime@value` | 최소 시간 | `60` |
| `maxplaytime@value` | 최대 시간 | `120` |
| `minage@value` | 최소 연령 | `10` |

#### 반환 필드 — 연결 정보 (link)

| `link@type` | 설명 | 예시 값 |
|-------------|------|---------|
| `boardgamecategory` | **카테고리/장르** | Negotiation, Economic |
| `boardgamemechanic` | **메카닉** | Dice Rolling, Trading, Route Building |
| `boardgamedesigner` | **디자이너** | Klaus Teuber |
| `boardgameartist` | 아티스트 | Michael Menzel |
| `boardgamepublisher` | **퍼블리셔** | Kosmos, Cephalofair Games |
| `boardgamefamily` | 게임 패밀리/시리즈 | Catan |
| `boardgameexpansion` | 확장팩 | Catan: Seafarers |
| `boardgameimplementation` | 리메이크/재구현 | — |
| `boardgameintegration` | 통합 가능 게임 | — |

> 각 link는 `@id` (BGG ID)와 `@value` (이름) 속성 보유

#### 반환 필드 — 통계 (stats=1)

| XML 경로 | 설명 | 예시 |
|----------|------|------|
| `statistics/ratings/usersrated@value` | **평가한 유저 수** | `98234` |
| `statistics/ratings/average@value` | **평균 평점 (10점 만점)** | `7.15` |
| `statistics/ratings/bayesaverage@value` | 베이지안 평균 (Geek Rating) | `7.01` |
| `statistics/ratings/stddev@value` | 표준편차 | `1.42` |
| `statistics/ratings/median@value` | 중간값 | `0` |
| `statistics/ratings/owned@value` | **보유 유저 수** | `89012` |
| `statistics/ratings/trading@value` | 거래 중 수 | `1523` |
| `statistics/ratings/wanting@value` | 원하는 유저 수 | `432` |
| `statistics/ratings/wishing@value` | **위시리스트 유저 수** | `5678` |
| `statistics/ratings/numcomments@value` | 댓글 수 | `12345` |
| `statistics/ratings/numweights@value` | 난이도 투표 수 | `8765` |
| `statistics/ratings/averageweight@value` | **평균 난이도 (1~5)** | `2.32` |

#### 반환 필드 — 랭킹

| XML 경로 | 설명 | 예시 |
|----------|------|------|
| `ranks/rank[@name='boardgame']@value` | **전체 보드게임 순위** | `423` |
| `ranks/rank[@name='strategygames']@value` | 전략 게임 순위 | `256` |
| `ranks/rank[@name='familygames']@value` | 가족 게임 순위 | `89` |

#### 반환 필드 — 투표 (poll)

| Poll 이름 | 설명 |
|-----------|------|
| `suggested_numplayers` | **추천 인원수** (Best / Recommended / Not Recommended 투표) |
| `suggested_playerage` | 추천 연령 투표 |
| `language_dependence` | 언어 의존도 (1~5) |

---

### 3.2 검색 — `/search`

```
GET /xmlapi2/search?query=catan&type=boardgame
```

| 파라미터 | 필수 | 설명 |
|----------|------|------|
| `query` | ✅ | 검색어 |
| `type` | | `boardgame` |
| `exact` | | `1` → 정확히 일치만 |

**반환 필드:**

| 필드 | 설명 |
|------|------|
| `items@total` | 총 결과 수 |
| `item@id` | BGG ID |
| `item/name@value` | 게임 이름 |
| `item/yearpublished@value` | 출시 연도 |

> ⚠️ 상세 정보 없음. ID만 얻고 `/thing`으로 상세 호출 필요.

---

### 3.3 인기 게임 — `/hot`

```
GET /xmlapi2/hot?type=boardgame
```

**반환:** 50개 고정 (페이지네이션 없음)

| 필드 | 설명 |
|------|------|
| `item@rank` | 순위 (1~50) |
| `item@id` | BGG ID |
| `item/name@value` | 게임 이름 |
| `item/thumbnail@value` | 썸네일 URL |
| `item/yearpublished@value` | 출시 연도 |

> 통계/상세 없음. 홈 "인기 게임" 섹션에 적합.

---

### 3.4 유저 컬렉션 — `/collection`

```
GET /xmlapi2/collection?username=XXX&own=1&stats=1
```

| 파라미터 | 설명 |
|----------|------|
| `username` | BGG 유저명 (필수) |
| `own` | `1` = 보유 게임만 |
| `rated` | `1` = 평가한 게임만 |
| `played` | `1` = 플레이한 게임만 |
| `wishlist` | `1` = 위시리스트만 |
| `stats` | `1` = 통계 포함 |

> ⚠️ **비동기 처리** — HTTP 202 반환 시 5~10초 후 재시도 필요

---

## 4. API 사용 규칙

| 규칙 | 내용 |
|------|------|
| 배치 요청 | `/thing?id=1,2,3,...` 최대 20개 묶어서 호출 |
| 요청 간격 | 5초에 1회 권장 |
| User-Agent | 커스텀 설정 (`BoardLog/1.0`) |
| 202 응답 | collection 등에서 발생 → 재시도 로직 필수 |
| XML 인코딩 | description의 `&amp;` 등 HTML 엔티티 디코딩 필요 |
| 이미지 | BGG CDN URL 직접 사용 가능 (핫링크 허용) |

---

## 5. 대안 — BGG JSON 래퍼

BGG 공식 API가 XML만 지원하므로, JSON 래퍼 활용 가능.

### bgg-json (Azure)

```
https://bgg-json.azurewebsites.net/thing/{bgg_id}
https://bgg-json.azurewebsites.net/collection/{username}
https://bgg-json.azurewebsites.net/hot
```

- XML → JSON 자동 변환
- ⚠️ Azure 무료 티어 — 안정성 낮음, 프로덕션 비추
- 개발/테스트용으로만 사용

### npm 패키지

```bash
npm install bgg-xml-api-client
```

```typescript
import { BggClient } from 'bgg-xml-api-client';
const bgg = BggClient.create();

const game = await bgg.thing({ id: 13, stats: 1, type: 'boardgame' });
const results = await bgg.search({ query: 'catan', type: 'boardgame' });
const hot = await bgg.hot({ type: 'boardgame' });
```

> XML→JSON 변환, 202 자동 재시도, TS 지원

---

Sources:
- [BGG XML API2 Wiki](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [Using the XML API](https://boardgamegeek.com/using_the_xml_api)
- [API 인증 토큰 변경 공지](https://boardgamegeek.com/thread/3492262/registration-and-authorization-coming-to-the-xml-a)
- [bgg-json GitHub](https://github.com/ervwalter/bgg-json)
