-- 테스트용 보드게임 시드 데이터 (나중에 삭제 예정)
-- Supabase SQL Editor에서 실행

INSERT INTO games (title, title_en, thumbnail, description, designer, publisher, release_year, min_players, max_players, min_play_time, max_play_time, min_age, genres, avg_rating, rating_count, bgg_id) VALUES

('카탄', 'CATAN', 'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__thumb/img/8a9HeqFydO7Uun_le9bXWPnidcA=/fit-in/200x150/filters:strip_icc()/pic2419375.jpg',
 '자원을 모으고 교역하며 카탄 섬에 정착지를 건설하는 전략 게임',
 'Klaus Teuber', 'Kosmos', 1995, 3, 4, 60, 120, 10,
 ARRAY['전략', '경제'], 3.6, 98234, '13'),

('팬데믹', 'Pandemic', 'https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXSXDCEA__thumb/img/bCVUPxjpjblSOHnVlLPGk-TRbfI=/fit-in/200x150/filters:strip_icc()/pic1534148.jpg',
 '전 세계에 퍼진 전염병을 막기 위해 협력하는 게임',
 'Matt Leacock', 'Z-Man Games', 2008, 2, 4, 45, 60, 8,
 ARRAY['협력', '전략'], 3.8, 89456, '30549'),

('아줄', 'Azul', 'https://cf.geekdo-images.com/tz19PfklMdAdjxV9WArraA__thumb/img/olVg0UPimJedsSgLiqbELDWF8sQ=/fit-in/200x150/filters:strip_icc()/pic3718275.jpg',
 '포르투갈 타일을 활용한 패턴 빌딩 추상 전략 게임',
 'Michael Kiesling', 'Next Move Games', 2017, 2, 4, 30, 45, 8,
 ARRAY['추상', '전략'], 3.9, 72345, '230802'),

('스플렌더', 'Splendor', 'https://cf.geekdo-images.com/rwOMxx4q5yuElIvo-NLbRQ__thumb/img/RfssVOWr-HXeMGMjFnqEXSqfVwE=/fit-in/200x150/filters:strip_icc()/pic1904079.jpg',
 '보석 칩을 모아 카드를 구매하고 귀족을 유치하는 엔진 빌딩 게임',
 'Marc André', 'Space Cowboys', 2014, 2, 4, 30, 30, 10,
 ARRAY['경제', '전략'], 3.8, 65432, '148228'),

('윙스팬', 'Wingspan', 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__thumb/img/VNToqgS2-pOGU6MuvIkMPKOcYyM=/fit-in/200x150/filters:strip_icc()/pic4458123.jpg',
 '새를 모아 서식지를 꾸미는 엔진 빌딩 카드 게임',
 'Elizabeth Hargrave', 'Stonemaier Games', 2019, 1, 5, 40, 70, 10,
 ARRAY['카드', '전략'], 4.1, 58901, '266192'),

('코드네임', 'Codenames', 'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__thumb/img/rz2iWU4J-JTz-YLJklAVZSXTkwk=/fit-in/200x150/filters:strip_icc()/pic259733.jpg',
 '단어 힌트로 팀원이 올바른 카드를 고르게 하는 파티 게임',
 'Vlaada Chvátil', 'Czech Games Edition', 2015, 2, 8, 15, 15, 14,
 ARRAY['파티', '추리'], 3.8, 71234, '178900'),

('루트', 'Root', 'https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__thumb/img/1mSoJXSTgEkHBFMcOtOrV-gNqnA=/fit-in/200x150/filters:strip_icc()/pic4254509.jpg',
 '숲속 동물 진영이 각자 다른 규칙으로 영토를 차지하는 비대칭 전략 게임',
 'Cole Wehrle', 'Leder Games', 2018, 2, 4, 60, 90, 10,
 ARRAY['전략', '워게임'], 4.0, 42567, '237182'),

('티켓 투 라이드', 'Ticket to Ride', 'https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__thumb/img/a95S8MpMG0hSJlwPaNgfnm_TZHY=/fit-in/200x150/filters:strip_icc()/pic38668.jpg',
 '기차 카드를 모아 도시를 연결하는 경로 건설 게임',
 'Alan R. Moon', 'Days of Wonder', 2004, 2, 5, 30, 60, 8,
 ARRAY['가족', '전략'], 3.8, 78901, '9209'),

('도미니언', 'Dominion', 'https://cf.geekdo-images.com/j6iQpZ4HkVOHkMGQ3RBOOA__thumb/img/xb4ENWKK0YMO5IAu1Y6U7SuDfTI=/fit-in/200x150/filters:strip_icc()/pic394356.jpg',
 '카드를 구매해 자신의 덱을 구축하는 덱빌딩 게임의 원조',
 'Donald X. Vaccarino', 'Rio Grande Games', 2008, 2, 4, 30, 30, 13,
 ARRAY['카드', '덱빌딩'], 3.7, 67890, '36218'),

('7 원더스', '7 Wonders', 'https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__thumb/img/RZCsE7SKgUkbWDlSJJirXMbiFCA=/fit-in/200x150/filters:strip_icc()/pic7149798.jpg',
 '고대 문명의 불가사의를 건설하는 카드 드래프팅 게임',
 'Antoine Bauza', 'Repos Production', 2010, 2, 7, 30, 30, 10,
 ARRAY['카드', '전략'], 3.9, 82345, '68448')

ON CONFLICT DO NOTHING;
