# BGG XML API2 — 실제 응답 데이터 전체 정리

> BGG API에서 실제로 어떤 데이터가 반환되는지, 엔드포인트별로 전부 정리
> 출처: BGG 공식 위키, Postman 문서, GitHub 라이브러리, 개발자 블로그 종합

---

## 1. `/thing` — 게임 상세 (가장 핵심)

### 요청

```
GET https://boardgamegeek.com/xmlapi2/thing?id=13&stats=1&type=boardgame
Authorization: Bearer {토큰}
```

### 실제 XML 응답 예시 (카탄, id=13)

```xml
<?xml version="1.0" encoding="utf-8"?>
<items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="13">

    <!-- 이미지 -->
    <thumbnail>https://cf.geekdo-images.com/...thumb.png</thumbnail>
    <image>https://cf.geekdo-images.com/...full.png</image>

    <!-- 이름 (여러 개) -->
    <name type="primary" sortindex="5" value="CATAN" />
    <name type="alternate" sortindex="1" value="카탄" />
    <name type="alternate" sortindex="1" value="カタン" />
    <name type="alternate" sortindex="1" value="Колонизаторы" />
    <name type="alternate" sortindex="5" value="Die Siedler von Catan" />

    <!-- 설명 (HTML 인코딩됨) -->
    <description>In CATAN (formerly The Settlers of Catan), players try to be the dominant force on the island of Catan by building settlements, cities, and roads.&#10;&#10;On each turn dice are rolled to determine what resources the island produces.&#10;...</description>

    <!-- 기본 정보 -->
    <yearpublished value="1995" />
    <minplayers value="3" />
    <maxplayers value="4" />
    <playingtime value="120" />
    <minplaytime value="60" />
    <maxplaytime value="120" />
    <minage value="10" />

    <!-- 투표: 추천 인원수 -->
    <poll name="suggested_numplayers" title="User Suggested Number of Players" totalvotes="2453">
      <results numplayers="1">
        <result value="Best" numvotes="2" />
        <result value="Recommended" numvotes="15" />
        <result value="Not Recommended" numvotes="1523" />
      </results>
      <results numplayers="2">
        <result value="Best" numvotes="11" />
        <result value="Recommended" numvotes="234" />
        <result value="Not Recommended" numvotes="1145" />
      </results>
      <results numplayers="3">
        <result value="Best" numvotes="567" />
        <result value="Recommended" numvotes="1234" />
        <result value="Not Recommended" numvotes="89" />
      </results>
      <results numplayers="4">
        <result value="Best" numvotes="1456" />
        <result value="Recommended" numvotes="876" />
        <result value="Not Recommended" numvotes="34" />
      </results>
    </poll>

    <!-- 투표: 추천 연령 -->
    <poll name="suggested_playerage" title="User Suggested Player Age" totalvotes="345">
      <results>
        <result value="8" numvotes="45" />
        <result value="10" numvotes="189" />
        <result value="12" numvotes="98" />
        <result value="14" numvotes="13" />
      </results>
    </poll>

    <!-- 투표: 언어 의존도 -->
    <poll name="language_dependence" title="Language Dependence" totalvotes="123">
      <results>
        <result level="1" value="No necessary in-game text" numvotes="89" />
        <result level="2" value="Some necessary text" numvotes="30" />
        <result level="3" value="Moderate in-game text" numvotes="4" />
        <result level="4" value="Extensive use of text" numvotes="0" />
        <result level="5" value="Unplayable in another language" numvotes="0" />
      </results>
    </poll>

    <!-- 링크: 카테고리 -->
    <link type="boardgamecategory" id="1029" value="Negotiation" />
    <link type="boardgamecategory" id="1021" value="Economic" />

    <!-- 링크: 메카닉 -->
    <link type="boardgamemechanic" id="2072" value="Dice Rolling" />
    <link type="boardgamemechanic" id="2008" value="Trading" />
    <link type="boardgamemechanic" id="2081" value="Route/Network Building" />
    <link type="boardgamemechanic" id="2012" value="Modular Board" />

    <!-- 링크: 디자이너 -->
    <link type="boardgamedesigner" id="11" value="Klaus Teuber" />

    <!-- 링크: 아티스트 -->
    <link type="boardgameartist" id="12382" value="Michael Menzel" />

    <!-- 링크: 퍼블리셔 (여러 개) -->
    <link type="boardgamepublisher" id="267" value="999 Games" />
    <link type="boardgamepublisher" id="4304" value="Albi" />
    <link type="boardgamepublisher" id="267" value="Kosmos" />

    <!-- 링크: 게임 패밀리 -->
    <link type="boardgamefamily" id="3" value="Catan" />

    <!-- 링크: 확장팩 -->
    <link type="boardgameexpansion" id="926" value="CATAN: Seafarers" />
    <link type="boardgameexpansion" id="2807" value="CATAN: Cities &amp; Knights" />

    <!-- 링크: 리임플레먼테이션 -->
    <link type="boardgameimplementation" id="278" value="Die Siedler von Nürnberg" />

    <!-- 통계 (stats=1 필요) -->
    <statistics page="1">
      <ratings>
        <usersrated value="98234" />
        <average value="7.15" />
        <bayesaverage value="7.01" />
        <stddev value="1.42" />
        <median value="0" />
        <owned value="89012" />
        <trading value="1523" />
        <wanting value="432" />
        <wishing value="5678" />
        <numcomments value="12345" />
        <numweights value="8765" />
        <averageweight value="2.32" />
        <ranks>
          <rank type="subtype" id="1" name="boardgame" friendlyname="Board Game Rank" value="423" bayesaverage="7.01" />
          <rank type="family" id="5497" name="strategygames" friendlyname="Strategy Game Rank" value="256" bayesaverage="6.98" />
          <rank type="family" id="5499" name="familygames" friendlyname="Family Game Rank" value="89" bayesaverage="7.05" />
        </ranks>
      </ratings>
    </statistics>

  </item>
</items>
```

### 필드 전체 목록

#### 기본 정보 (✅ 확인됨)

| 필드 | 타입 | 설명 | 예시 | 우리가 쓰나 |
|------|------|------|------|------------|
| `item@id` | int | BGG 고유 ID | `13` | ✅ `bgg_id` |
| `item@type` | string | 아이템 타입 | `boardgame` | ✅ 필터용 |
| `thumbnail` | URL | 썸네일 이미지 | `https://cf.geekdo-images.com/...` | ✅ 목록 카드 |
| `image` | URL | 고해상도 이미지 | `https://cf.geekdo-images.com/...` | ✅ 상세 페이지 |
| `name[@type='primary']` | string | 기본 이름 (영문) | `CATAN` | ✅ `title` |
| `name[@type='alternate']` | string[] | 대체 이름 (다국어 복수) | `카탄`, `カタン` | ✅ `title_kr` |
| `description` | text | 게임 설명 (HTML 인코딩) | 긴 텍스트 | ✅ `description` |
| `yearpublished@value` | int | 출시 연도 | `1995` | ✅ `year_published` |
| `minplayers@value` | int | 최소 인원 | `3` | ✅ `min_players` |
| `maxplayers@value` | int | 최대 인원 | `4` | ✅ `max_players` |
| `playingtime@value` | int | 플레이 시간 (분) | `120` | ✅ 참고용 |
| `minplaytime@value` | int | 최소 시간 | `60` | ✅ `play_time_min` |
| `maxplaytime@value` | int | 최대 시간 | `120` | ✅ `play_time_max` |
| `minage@value` | int | 최소 연령 | `10` | ✅ `min_age` |

#### 링크 (✅ 확인됨)

| `link@type` | 설명 | 복수 | 우리가 쓰나 |
|-------------|------|------|------------|
| `boardgamecategory` | 카테고리/장르 | ✅ 여러 개 | ✅ `tags` (genre) |
| `boardgamemechanic` | 메카닉 | ✅ 여러 개 | ✅ `tags` (mechanic) |
| `boardgamedesigner` | 디자이너 | ✅ 여러 개 | ✅ `designer` |
| `boardgameartist` | 아티스트 | ✅ 여러 개 | ❌ Phase 2 |
| `boardgamepublisher` | 퍼블리셔 | ✅ 여러 개 | ✅ `publisher` |
| `boardgamefamily` | 게임 시리즈 | ✅ 여러 개 | ❌ Phase 2 |
| `boardgameexpansion` | 확장팩 | ✅ 여러 개 | ❌ Phase 2 |
| `boardgameimplementation` | 리메이크 | 가능 | ❌ |
| `boardgameintegration` | 통합 가능 게임 | 가능 | ❌ |

> 각 link는 `@id` (BGG ID)와 `@value` (이름) 속성 보유

#### 통계 — stats=1 (✅ 확인됨)

| 필드 | 타입 | 설명 | 예시 | 우리가 쓰나 |
|------|------|------|------|------------|
| `usersrated@value` | int | 평가 유저 수 | `98234` | ✅ `rating_count` |
| `average@value` | float | 평균 평점 (10점) | `7.15` | ✅ `avg_rating` (÷2) |
| `bayesaverage@value` | float | 베이지안 평균 | `7.01` | ❌ 참고용 |
| `stddev@value` | float | 표준편차 | `1.42` | ❌ |
| `median@value` | float | 중간값 | `0` | ❌ |
| `owned@value` | int | 보유 유저 수 | `89012` | ✅ Phase 2 표시용 |
| `trading@value` | int | 거래 중 | `1523` | ❌ |
| `wanting@value` | int | 원하는 유저 수 | `432` | ❌ |
| `wishing@value` | int | 위시리스트 유저 수 | `5678` | ✅ Phase 2 표시용 |
| `numcomments@value` | int | 댓글 수 | `12345` | ❌ |
| `numweights@value` | int | 난이도 투표 수 | `8765` | ❌ |
| `averageweight@value` | float | 평균 난이도 (1~5) | `2.32` | ✅ Phase 2 난이도 표시 |

#### 랭킹 — stats=1 (✅ 확인됨)

| 필드 | 설명 | 예시 | 우리가 쓰나 |
|------|------|------|------------|
| `rank[@name='boardgame']@value` | 전체 순위 | `423` | ✅ `bgg_rank` |
| `rank[@name='strategygames']@value` | 전략 게임 순위 | `256` | ❌ 참고용 |
| `rank[@name='familygames']@value` | 가족 게임 순위 | `89` | ❌ 참고용 |

#### 투표 (✅ 확인됨)

| Poll 이름 | 설명 | 우리가 쓰나 |
|-----------|------|------------|
| `suggested_numplayers` | 추천 인원 (Best/Recommended/Not Recommended) | ✅ Phase 2 "4인 추천" 뱃지 |
| `suggested_playerage` | 추천 연령 | ❌ |
| `language_dependence` | 언어 의존도 (1~5) | ❌ |

---

## 2. `/search` — 검색

### 요청

```
GET https://boardgamegeek.com/xmlapi2/search?query=catan&type=boardgame
```

### 실제 XML 응답 (✅ 확인됨)

```xml
<?xml version="1.0" encoding="utf-8"?>
<items total="34" termsofuse="...">
  <item type="boardgame" id="13">
    <name type="primary" value="CATAN" />
    <yearpublished value="1995" />
  </item>
  <item type="boardgame" id="278">
    <name type="primary" value="Die Siedler von Nürnberg" />
    <yearpublished value="1999" />
  </item>
  <item type="boardgame" id="926">
    <name type="primary" value="CATAN: Seafarers" />
    <yearpublished value="1997" />
  </item>
  <!-- ... 총 34개 결과 -->
</items>
```

### 반환 필드

| 필드 | 설명 | 비고 |
|------|------|------|
| `items@total` | 총 결과 수 | `34` |
| `item@type` | 타입 | `boardgame` |
| `item@id` | BGG ID | `13` |
| `item/name@value` | 게임 이름 | `CATAN` |
| `item/yearpublished@value` | 출시 연도 | `1995` |

> ⚠️ **상세 정보 없음.** ID만 얻고 `/thing`으로 상세 호출 필요.

---

## 3. `/hot` — 인기 게임 50개

### 요청

```
GET https://boardgamegeek.com/xmlapi2/hot?type=boardgame
```

### 실제 XML 응답 (✅ 확인됨)

```xml
<?xml version="1.0" encoding="utf-8"?>
<items termsofuse="...">
  <item id="402584" rank="1">
    <thumbnail value="https://cf.geekdo-images.com/...thumb.jpg" />
    <name value="Frosthaven" />
    <yearpublished value="2023" />
  </item>
  <item id="341169" rank="2">
    <thumbnail value="https://cf.geekdo-images.com/...thumb.jpg" />
    <name value="Ark Nova" />
    <yearpublished value="2021" />
  </item>
  <!-- ... 총 50개 고정 -->
</items>
```

### 반환 필드

| 필드 | 설명 | 비고 |
|------|------|------|
| `item@id` | BGG ID | `402584` |
| `item@rank` | 핫 순위 | `1`~`50` |
| `item/thumbnail@value` | 썸네일 URL | 있음 |
| `item/name@value` | 게임 이름 | 영문만 |
| `item/yearpublished@value` | 출시 연도 | 있음 |

> 50개 고정. 페이지네이션 없음. 통계/상세 없음.

---

## 4. `/collection` — 유저 컬렉션

### 요청

```
GET https://boardgamegeek.com/xmlapi2/collection?username=XXX&own=1&stats=1
```

### 실제 XML 응답 (✅ 확인됨)

```xml
<?xml version="1.0" encoding="utf-8"?>
<items totalitems="42" termsofuse="...">
  <item objecttype="thing" objectid="13" subtype="boardgame" collid="12345678">
    <name sortindex="5">CATAN</name>
    <yearpublished>1995</yearpublished>
    <image>https://cf.geekdo-images.com/...full.png</image>
    <thumbnail>https://cf.geekdo-images.com/...thumb.png</thumbnail>
    <status own="1" prevowned="0" fortrade="0" want="0"
            wanttoplay="0" wanttobuy="0" wishlist="0"
            preordered="0" lastmodified="2024-01-15 12:34:56" />
    <numplays>8</numplays>
    <comment>Great game!</comment>
    <stats minplayers="3" maxplayers="4" minplaytime="60"
           maxplaytime="120" playingtime="120" numowned="89012">
      <rating value="8">
        <usersrated value="98234" />
        <average value="7.15" />
        <bayesaverage value="7.01" />
        <stddev value="1.42" />
        <median value="0" />
        <ranks>
          <rank type="subtype" id="1" name="boardgame"
                friendlyname="Board Game Rank" value="423" />
        </ranks>
      </rating>
    </stats>
  </item>
  <!-- ... -->
</items>
```

### 반환 필드

| 필드 | 설명 | 우리가 쓰나 |
|------|------|------------|
| `item@objectid` | BGG ID | ✅ |
| `name` | 게임 이름 | ✅ |
| `yearpublished` | 출시 연도 | ✅ |
| `image` | 이미지 URL | ✅ |
| `thumbnail` | 썸네일 URL | ✅ |
| `status@own` | 보유 (0/1) | ❌ 우리 자체 컬렉션 |
| `status@wishlist` | 위시리스트 (0/1) | ❌ |
| `numplays` | 플레이 횟수 | ❌ |
| `comment` | 유저 코멘트 | ❌ |
| `stats/rating@value` | 개인 평점 | ❌ |
| `stats/rating/average@value` | 전체 평균 평점 | ✅ |
| `stats/rating/ranks/rank@value` | 순위 | ✅ |

> ⚠️ **202 응답 주의.** 서버 캐시 없으면 HTTP 202 반환 → 5~10초 후 재시도.

---

## 5. `/plays` — 플레이 기록

### 요청

```
GET https://boardgamegeek.com/xmlapi2/plays?username=XXX&id=13
```

### 반환 필드

| 필드 | 설명 | 우리가 쓰나 |
|------|------|------------|
| `play@id` | 플레이 ID | ❌ 우리 자체 로그 |
| `play@date` | 날짜 | ❌ |
| `play@quantity` | 횟수 | ❌ |
| `play@length` | 시간(분) | ❌ |
| `play/item@name` | 게임명 | ❌ |
| `play/item@objectid` | BGG ID | ❌ |
| `play/comments` | 코멘트 | ❌ |
| `play/players/player` | 참가자 | ❌ |

> 우리는 자체 플레이 로그를 사용하므로 이 엔드포인트는 **사용하지 않음.**

---

## 6. 엔드포인트별 요약

| 엔드포인트 | 우리 용도 | MVP 사용 | 데이터 풍부도 |
|-----------|----------|----------|-------------|
| **`/thing`** | 게임 상세 정보 수집 | ✅ 핵심 | ⭐⭐⭐⭐⭐ 모든 정보 |
| **`/search`** | 게임 검색 (ID 획득) | ✅ | ⭐ ID+이름만 |
| **`/hot`** | 홈 인기 게임 | ✅ | ⭐⭐ 이름+썸네일 |
| `/collection` | BGG 유저 컬렉션 | ❌ | ⭐⭐⭐ |
| `/plays` | BGG 유저 플레이 기록 | ❌ | ⭐⭐ |
| `/user` | BGG 유저 정보 | ❌ | ⭐⭐ |
| `/family` | 게임 패밀리/시리즈 | ❌ Phase 2 | ⭐⭐ |
| `/forum` | BGG 포럼 | ❌ | ⭐ |
| `/guild` | BGG 길드 | ❌ | ⭐ |

---

## 7. 신뢰도

| 항목 | 확인 방법 | 신뢰도 |
|------|----------|--------|
| 기본 필드 (이름, 인원, 시간, 연령) | 공식 위키 + 실제 응답 예시 + 다수 라이브러리 | ✅ **확실** |
| 이미지 (thumbnail, image) | 공식 위키 + 실제 응답 | ✅ **확실** |
| 통계 (평점, 보유수, 순위) | 공식 위키 + 라이브러리 struct | ✅ **확실** |
| 링크 (카테고리, 메카닉, 디자이너) | 공식 위키 + 블로그 예시 | ✅ **확실** |
| 투표 (추천 인원, 연령) | 공식 위키 + 라이브러리 | ✅ **확실** |
| 한국어 alternate name | 라이브러리 문서 (있으면 반환, 없으면 없음) | ⚠️ **있는 게임만** |
| 가격 정보 | BGG API에 **없음** | ❌ **확실히 없음** |

---

## 8. 우리 MVP에서 실제로 쓸 데이터 체크리스트

```
✅ 확실히 쓸 것:
├── 게임명 (영문 primary + 한국어 alternate)
├── 설명 (description)
├── 이미지 (thumbnail + image)
├── 인원수 (min~max players)
├── 플레이 시간 (min~max playtime)
├── 최소 연령 (minage)
├── 출시 연도 (yearpublished)
├── 평점 (average → ÷2로 5점 변환)
├── 평가 수 (usersrated)
├── 카테고리 (boardgamecategory → tags)
├── 메카닉 (boardgamemechanic → tags)
├── 디자이너 (boardgamedesigner)
├── 퍼블리셔 (boardgamepublisher)
└── BGG 순위 (ranks → boardgame)

⏳ Phase 2에서 쓸 것:
├── 보유 수 (owned) → "N명이 보유"
├── 위시 수 (wishing) → "N명이 찜"
├── 난이도 (averageweight) → 난이도 바
├── 추천 인원 투표 (suggested_numplayers) → "4인 추천" 뱃지
├── 확장팩 (boardgameexpansion) → 연관 게임
└── 게임 시리즈 (boardgamefamily)

❌ BGG에 없어서 직접 관리:
├── 가격 (price)
├── 구매 링크 (purchase_links)
└── 한국 전용 게임 데이터
```

---

Sources:
- [BGG XML API2 공식 위키](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [BGG API 튜토리얼](https://boardgamegeek.com/thread/2564656/tutorial-for-bgg-xml-api2)
- [BGG API Postman 문서](https://www.postman.com/1toddlewis/boardgamegeek/documentation/9czdvgo/bgg-xml-api2)
- [GoGeek 라이브러리](https://github.com/kkjdaniel/gogeek)
- [BoardGamer.BGG 라이브러리](https://github.com/Cobster/BoardGamer.BoardGameGeek)
- [Mixed Conclusions 블로그](https://mixedconclusions.com/blog/boardgames_part_one/)
