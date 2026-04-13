-- ============================================================
-- 카운터 원자적 처리 및 avg_rating 트리거
-- like_count / comment_count / view_count: RPC 함수로 원자적 증감
-- avg_rating / rating_count: ratings 테이블 트리거로 자동 갱신
-- ============================================================

-- ── like_count ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_like_count(post_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE posts SET like_count = like_count + 1 WHERE id = $1;
$$;

CREATE OR REPLACE FUNCTION decrement_like_count(post_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE posts SET like_count = GREATEST(0, like_count - 1) WHERE id = $1;
$$;

-- ── comment_count ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_comment_count(post_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1;
$$;

-- amount: 루트 댓글 삭제 시 대댓글 포함 일괄 차감
CREATE OR REPLACE FUNCTION decrement_comment_count(post_id uuid, amount int DEFAULT 1)
RETURNS void LANGUAGE sql AS $$
  UPDATE posts SET comment_count = GREATEST(0, comment_count - $2) WHERE id = $1;
$$;

-- ── view_count ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE posts SET view_count = view_count + 1 WHERE id = $1;
$$;

-- ── avg_rating 자동 갱신 트리거 ──────────────────────────────
-- ratings 행 INSERT / UPDATE / DELETE 시 games 테이블 자동 갱신
CREATE OR REPLACE FUNCTION update_game_avg_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_game_id uuid;
BEGIN
  v_game_id := COALESCE(NEW.game_id, OLD.game_id);

  UPDATE games SET
    avg_rating = (
      SELECT ROUND(AVG(score)::numeric, 1)
      FROM ratings
      WHERE game_id = v_game_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM ratings
      WHERE game_id = v_game_id
    )
  WHERE id = v_game_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS ratings_update_avg ON ratings;
CREATE TRIGGER ratings_update_avg
  AFTER INSERT OR UPDATE OR DELETE ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_game_avg_rating();
