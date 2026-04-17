# BGG XML API 이용약관 및 준수사항

> 작성일: 2026-04-16  
> 참고: BGG 승인 이메일 (2026-04-16), XML API Terms of Use, BGG_XML_API_Commercial_Use  
> 상태: **무료 상업적 라이선스 승인됨** (사용량 증가 시 유료 전환 가능)

---

## 1. 우리 라이선스 현황

BGG 승인 이메일 내용:

```
- 무료 상업적 라이선스로 승인
- API 사용량 모니터링 중
- 사용자 기반 성장 또는 정책 변경 시 유료 전환 가능
- 기술 지원 미제공 (api@boardgamegeek.com은 비기술 문의만)
```

> 초기 단계에서는 무료이나, 서비스 규모가 커지면 비용 발생 가능성 있음.  
> 정기적으로 api@boardgamegeek.com 확인 권장.

---

## 2. 필수 표시 의무 (Attribution)

BGG Terms of Use에 명시된 **반드시 지켜야 할** 표시 규칙:

### 2-1. "Powered by BGG" 로고 표시

| 항목 | 요구사항 |
|------|---------|
| 표시 위치 | BGG 데이터를 표시하는 **모든 공개 화면** |
| 로고 내용 | **"Powered by BGG"** 텍스트 또는 공식 BGG 로고 |
| 크기 | 텍스트가 **명확히 읽힐 수 있는 크기** |
| 링크 | BGG 로고/텍스트에 `https://boardgamegeek.com` 링크 권장 |

**표시가 필요한 화면 예시:**
- 게임 탐색 페이지 (`/games`)
- 게임 상세 페이지 (`/games/[id]`)
- 검색 결과 페이지
- 게임 정보가 포함된 모든 화면

### 2-2. 데이터 출처 표기

- BGG 데이터를 사용하는 모든 곳에 **"BoardGameGeek"을 출처로 명시**
- 예시 문구: `"게임 데이터 제공: BoardGameGeek (BGG)"`
- 약어 "BGG"만 사용하지 말고 **"BoardGameGeek"** 풀네임 포함

### 2-3. 구현 예시 (권장)

```tsx
// 예: 게임 탐색 페이지 하단 or 게임 카드 하단
<footer>
  <a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer">
    Powered by BoardGameGeek
  </a>
</footer>
```

---

## 3. 데이터 사용 금지사항

| 금지 항목 | 내용 |
|----------|------|
| **데이터 수정** | BGG에서 받은 데이터를 임의로 변경하여 BGG 데이터인 것처럼 표시 불가 |
| **AI/LLM 학습** | BGG 데이터를 AI 또는 LLM 모델 학습에 사용 엄격히 금지 |
| **서버 과부하** | API 호출이 BGG 서버 정상 운영을 방해하는 수준의 트래픽 금지 |
| **데이터 재배포** | BGG 데이터를 별도 API로 재배포하거나 제3자에게 판매 불가 |
| **무단 크롤링** | API 외 HTML 크롤링/스크래핑 금지 |

---

## 4. Wikipedia 출처 텍스트 별도 주의

- BGG `description` 중 일부는 **Wikipedia에서 가져온 텍스트** 포함
- 해당 텍스트는 **CC BY-NC-SA 3.0** 라이선스 적용
- 적용 조건:
  - 저작자 표시 (Wikipedia 출처 명시)
  - 비영리 목적에만 사용 가능
  - 동일 조건으로만 배포 가능

> **실질적 대응**: description을 그대로 표시할 경우 하단에  
> `"일부 설명은 Wikipedia(CC BY-NC-SA 3.0)에서 제공되었습니다."` 표기 권장

---

## 5. Rate Limit 및 기술 제한

| 항목 | 규칙 |
|------|------|
| 요청 간격 | 배치 요청 사이 **5초 이상** 대기 |
| 배치 크기 | 한 번에 ID **최대 20개** 권장 |
| 재시도 | `429` / `5xx` 응답 시 **10초 대기 후 1회 재시도** |
| `202 응답` | 처리 중 상태 — 수 초 후 재요청 필요 (collection 엔드포인트에서 자주 발생) |
| Authorization | 모든 요청에 `Bearer {BGG_API_TOKEN}` 헤더 필수 |
| User-Agent | `User-Agent: BoardLog/1.0` 헤더 포함 권장 |

---

## 6. BGG XML API2 전체 엔드포인트

베이스 URL: `https://boardgamegeek.com/xmlapi2/`

### 6-1. `/thing` — 게임 상세 정보 ✅ 현재 사용 중

```
GET /xmlapi2/thing?id={id1,id2,...}&stats=1&type=boardgame
```

| 파라미터 | 설명 |
|---------|------|
| `id` | BGG ID (콤마로 복수 지정, 최대 20개 권장) |
| `type` | `boardgame`, `boardgameexpansion`, `boardgameaccessory`, `videogame`, `rpgitem` |
| `stats=1` | 평점/순위/난이도 통계 포함 |
| `versions=1` | 각국 발매판 정보 포함 |
| `videos=1` | 관련 영상 목록 포함 |
| `marketplace=1` | 마켓플레이스 정보 포함 |
| `comments=1` | 유저 코멘트 포함 |
| `ratingcomments=1` | 평점 코멘트 포함 |
| `page` | 코멘트 페이지 번호 |

### 6-2. `/search` — 게임 검색

```
GET /xmlapi2/search?query={검색어}&type=boardgame&exact=0
```

| 파라미터 | 설명 |
|---------|------|
| `query` | 검색어 |
| `type` | `boardgame`, `boardgameexpansion`, `rpgitem`, `videogame` |
| `exact=1` | 정확한 이름 일치만 반환 |

> **응답**: 검색 결과 목록 (id, name, yearpublished만 포함, 상세 정보 없음)  
> 상세 정보는 `/thing`으로 후속 호출 필요

### 6-3. `/collection` — 유저 컬렉션

```
GET /xmlapi2/collection?username={유저명}&stats=1
```

| 파라미터 | 설명 |
|---------|------|
| `username` | BGG 유저명 (필수) |
| `subtype` | `boardgame`, `boardgameexpansion` 등 |
| `excludesubtype` | 제외할 타입 |
| `own=1` | 소유한 게임만 |
| `rated=1` | 평점 매긴 게임만 |
| `played=1` | 플레이한 게임만 |
| `wishlist=1` | 위시리스트만 |
| `stats=1` | 통계 포함 |
| `id` | 특정 게임 ID만 조회 |

> `202 Accepted` 응답 시 몇 초 후 재요청 필요

### 6-4. `/hot` — 인기 급상승 목록

```
GET /xmlapi2/hot?type=boardgame
```

| 파라미터 | 설명 |
|---------|------|
| `type` | `boardgame`, `rpg`, `videogame`, `boardgameperson`, `rpgperson`, `boardgamecompany` |

> **응답**: rank, id, name, yearpublished, thumbnail (상세 정보 없음)

### 6-5. `/plays` — 플레이 기록

```
GET /xmlapi2/plays?username={유저명}&type=thing&subtype=boardgame
```

| 파라미터 | 설명 |
|---------|------|
| `username` | BGG 유저명 |
| `id` | 특정 게임 ID |
| `type` | `thing` |
| `subtype` | `boardgame` |
| `mindate` | 시작일 (YYYY-MM-DD) |
| `maxdate` | 종료일 (YYYY-MM-DD) |
| `page` | 페이지 (100개/페이지) |

### 6-6. `/user` — 유저 정보

```
GET /xmlapi2/user?name={유저명}&buddies=1&guilds=1&top=1&hot=1
```

| 파라미터 | 설명 |
|---------|------|
| `name` | BGG 유저명 (필수) |
| `buddies=1` | 친구 목록 포함 |
| `guilds=1` | 가입 길드 포함 |
| `top=1` | 유저의 TOP 10 게임 |
| `hot=1` | 유저의 HOT 10 게임 |
| `domain` | `boardgame`, `rpg`, `videogame` |
| `page` | buddies/guilds 페이지 |

### 6-7. `/guild` — 길드 정보

```
GET /xmlapi2/guild?id={길드ID}&members=1
```

| 파라미터 | 설명 |
|---------|------|
| `id` | 길드 ID (필수) |
| `members=1` | 멤버 목록 포함 |
| `sort` | `username`, `date` |
| `page` | 멤버 페이지 |

### 6-8. `/geeklist` — 게임 리스트

```
GET /xmlapi2/geeklist/{listID}?comments=1
```

| 파라미터 | 설명 |
|---------|------|
| `listID` | 지클리스트 ID (URL path) |
| `comments=1` | 코멘트 포함 |

### 6-9. `/forumlist` — 포럼 목록

```
GET /xmlapi2/forumlist?id={게임ID}&type=thing
```

| 파라미터 | 설명 |
|---------|------|
| `id` | 게임/기업 등 ID |
| `type` | `thing`, `family` |

### 6-10. `/forum` — 포럼 스레드 목록

```
GET /xmlapi2/forum?id={포럼ID}&page=1
```

### 6-11. `/thread` — 특정 스레드

```
GET /xmlapi2/thread?id={스레드ID}&minarticleid=0&count=100
```

### 6-12. `/family` — 게임 패밀리/시리즈

```
GET /xmlapi2/family?id={familyID}&type=boardgamefamily
```

---

## 7. BoardLog 적용 체크리스트

### 즉시 적용 필요

- [ ] **"Powered by BoardGameGeek" 표시** — 게임 데이터가 보이는 모든 페이지
  - `/games` (탐색 페이지)
  - `/games/[id]` (게임 상세 페이지, 추후 구현 시)
  - BGG 로고 또는 텍스트에 `https://boardgamegeek.com` 링크

- [ ] **데이터 출처 표기** — "게임 데이터: BoardGameGeek" 명시

### 데이터 처리 시 주의

- [ ] `description` 표시 시 Wikipedia 출처 안내문 추가
- [ ] BGG 데이터를 가공/수정 시 BGG 원본과 다름을 명확히 구분
  - 예: `avg_rating` ÷ 2 변환 시 "BGG 평점 기준 (10점 만점 → 5점 환산)" 명시 고려

### 운영 중 모니터링

- [ ] API 사용량 증가 시 유료 전환 이메일 수신 대비
- [ ] BGG 약관 변경 시 자동 적용됨 — 분기마다 Terms of Use 확인 권장

---

## 8. 참고 문서 링크

| 문서 | URL |
|------|-----|
| BGG XML API2 공식 문서 | https://boardgamegeek.com/wiki/page/BGG_XML_API2 |
| XML API Terms of Use | https://boardgamegeek.com/wiki/page/XML_API_Terms_of_Use |
| API 상업적 사용 | https://boardgamegeek.com/wiki/page/BGG_XML_API_Commercial_Use |
| Using the XML API | https://boardgamegeek.com/using_the_xml_api |
| BGG Terms of Service | https://boardgamegeek.com/terms |
| 비기술 문의 이메일 | api@boardgamegeek.com |
