-- 테스트용 시드 데이터 (나중에 삭제 예정)
-- 유저: 테스트계정 (d3eead0f-33cc-423e-b4bd-d60aa1aa1552)

DO $$
DECLARE
  uid UUID := 'd3eead0f-33cc-423e-b4bd-d60aa1aa1552';
  g_catan UUID := '80f8567a-74a2-4eb8-96be-516067158e7e';
  g_pandemic UUID := 'e5234ced-0004-44e0-9bc1-16a9acadd66b';
  g_azul UUID := '9645dcb2-9683-4742-95a1-38f5f26bf02d';
  g_splendor UUID := 'f539ee2f-1ffb-461f-8cae-417724447aa6';
  g_wingspan UUID := '3d2f0266-d62e-4338-a9d6-aeba0f1fdcc2';
  g_codenames UUID := '0ae212a2-72ff-4558-becc-77d855984b9b';
  g_root UUID := '8b4dc9c9-2445-4190-8374-3bf2992be3b5';
  g_ticket UUID := '0f897782-3961-4928-ad91-3fd1337729dc';
  log1 UUID;
  log2 UUID;
  log3 UUID;
  log4 UUID;
  log5 UUID;
  log6 UUID;
BEGIN

  -- ─── 컬렉션 (8개 게임, 다양한 상태) ───
  INSERT INTO collections (user_id, game_id, status) VALUES
    (uid, g_catan,     'owned'),
    (uid, g_pandemic,  'owned'),
    (uid, g_azul,      'owned'),
    (uid, g_splendor,  'fan'),
    (uid, g_wingspan,  'wishlist'),
    (uid, g_codenames, 'owned'),
    (uid, g_root,      'completed'),
    (uid, g_ticket,    'borrowed')
  ON CONFLICT (user_id, game_id) DO NOTHING;

  -- ─── 평점 ───
  INSERT INTO ratings (user_id, game_id, score) VALUES
    (uid, g_catan,     8.5),
    (uid, g_pandemic,  9.0),
    (uid, g_azul,      7.5),
    (uid, g_splendor,  8.0),
    (uid, g_codenames, 7.0),
    (uid, g_root,      9.5)
  ON CONFLICT (user_id, game_id) DO NOTHING;

  -- ─── 플레이 로그: 카탄 (5회) ───
  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating, memo)
  VALUES (uid, g_catan, '2026-04-08', ARRAY['홍길동','김철수','이영희'], 4, '다이스 보드게임카페', 90, 4.5, '접전이었다!')
  RETURNING id INTO log1;

  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating, memo)
  VALUES (uid, g_catan, '2026-03-22', ARRAY['홍길동','박민수'], 3, '다이스 보드게임카페', 75, 5.0, '카탄 최고!')
  RETURNING id INTO log2;

  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating, memo)
  VALUES (uid, g_catan, '2026-03-09', ARRAY['홍길동','김철수','이영희','박민수'], 4, '집', 100, 3.5, NULL)
  RETURNING id INTO log3;

  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating, memo)
  VALUES (uid, g_catan, '2026-02-15', ARRAY['김철수'], 2, '친구집', 60, 4.0, '2인도 재밌네')
  RETURNING id INTO log4;

  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating, memo)
  VALUES (uid, g_catan, '2026-01-20', ARRAY['홍길동','이영희'], 3, '다이스 보드게임카페', 80, 4.0, NULL)
  RETURNING id INTO log5;

  -- ─── 플레이 로그: 팬데믹 (2회) ───
  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating, memo)
  VALUES (uid, g_pandemic, '2026-04-01', ARRAY['홍길동','김철수','이영희'], 4, '다이스 보드게임카페', 55, 5.0, '극적인 승리!')
  RETURNING id INTO log6;

  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating)
  VALUES (uid, g_pandemic, '2026-03-15', ARRAY['김철수'], 2, '집', 45, 4.0);

  -- ─── 플레이 로그: 아줄 (1회) ───
  INSERT INTO play_logs (user_id, game_id, played_at, players, player_count, location, duration, rating)
  VALUES (uid, g_azul, '2026-03-30', ARRAY['이영희'], 2, '집', 35, 4.0);

  -- ─── 점수 기록: 카탄 5경기 ───

  -- 경기1: 홍길동 승
  INSERT INTO play_log_scores (play_log_id, player_name, score, is_winner) VALUES
    (log1, '나', 10, false),
    (log1, '홍길동', 12, true),
    (log1, '김철수', 8, false),
    (log1, '이영희', 9, false);

  -- 경기2: 내가 승
  INSERT INTO play_log_scores (play_log_id, player_name, score, is_winner) VALUES
    (log2, '나', 11, true),
    (log2, '홍길동', 9, false),
    (log2, '박민수', 7, false);

  -- 경기3: 김철수 승
  INSERT INTO play_log_scores (play_log_id, player_name, score, is_winner) VALUES
    (log3, '나', 8, false),
    (log3, '홍길동', 9, false),
    (log3, '김철수', 11, true),
    (log3, '이영희', 7, false),
    (log3, '박민수', 6, false);

  -- 경기4: 내가 승
  INSERT INTO play_log_scores (play_log_id, player_name, score, is_winner) VALUES
    (log4, '나', 10, true),
    (log4, '김철수', 8, false);

  -- 경기5: 홍길동 승
  INSERT INTO play_log_scores (play_log_id, player_name, score, is_winner) VALUES
    (log5, '나', 9, false),
    (log5, '홍길동', 11, true),
    (log5, '이영희', 8, false);

  -- 경기6: 팬데믹 (협력게임이라 모두 승)
  INSERT INTO play_log_scores (play_log_id, player_name, score, is_winner) VALUES
    (log6, '나', 0, true),
    (log6, '홍길동', 0, true),
    (log6, '김철수', 0, true),
    (log6, '이영희', 0, true);

END $$;
