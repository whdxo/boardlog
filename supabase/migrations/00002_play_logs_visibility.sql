-- ============================================================
-- play_logs에 visibility 컬럼 추가
-- 공개(public, 기본값) / 비공개(private) 지원
-- ============================================================

ALTER TABLE play_logs
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'private'));

-- 기존 RLS 정책 교체: public 이거나 본인이면 읽기 가능
DROP POLICY IF EXISTS "play_logs_select" ON play_logs;
CREATE POLICY "play_logs_select" ON play_logs FOR SELECT
  USING (visibility = 'public' OR auth.uid() = user_id);

-- play_log_scores도 소유자만 볼 수 있게 갱신
DROP POLICY IF EXISTS "play_log_scores_select" ON play_log_scores;
CREATE POLICY "play_log_scores_select" ON play_log_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM play_logs
      WHERE id = play_log_id
        AND (visibility = 'public' OR user_id = auth.uid())
    )
  );
