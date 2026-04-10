-- =============================================
-- profiles (auth.users 1:1 확장)
-- =============================================
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "profile_image" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "following_count" INTEGER NOT NULL DEFAULT 0,
    "games_count" INTEGER NOT NULL DEFAULT 0,
    "plays_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT "profiles_role_check" CHECK (role IN ('user', 'admin', 'editor'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "profiles_nickname_key" ON "profiles"("nickname");
CREATE INDEX IF NOT EXISTS "idx_profiles_nickname" ON "profiles"("nickname");

-- 신규 유저 가입 시 profiles 자동 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'user_' || LEFT(NEW.id::text, 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- collections
-- =============================================
CREATE TABLE IF NOT EXISTS "collections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
    CONSTRAINT "collections_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
    CONSTRAINT "collections_status_check" CHECK (status IN ('owned','fan','wishlist','completed','preorder','selling','lent','borrowed')),
    CONSTRAINT "collections_user_game_unique" UNIQUE ("user_id", "game_id")
);

CREATE INDEX IF NOT EXISTS "idx_collections_user" ON "collections"("user_id");
CREATE INDEX IF NOT EXISTS "idx_collections_user_status" ON "collections"("user_id", "status");
CREATE INDEX IF NOT EXISTS "idx_collections_game" ON "collections"("game_id");

-- =============================================
-- ratings
-- =============================================
CREATE TABLE IF NOT EXISTS "ratings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "score" DECIMAL(3,1) NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
    CONSTRAINT "ratings_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
    CONSTRAINT "ratings_score_check" CHECK (score >= 1 AND score <= 10),
    CONSTRAINT "ratings_user_game_unique" UNIQUE ("user_id", "game_id")
);

CREATE INDEX IF NOT EXISTS "idx_ratings_game" ON "ratings"("game_id");
CREATE INDEX IF NOT EXISTS "idx_ratings_user" ON "ratings"("user_id");

-- =============================================
-- play_logs
-- =============================================
CREATE TABLE IF NOT EXISTS "play_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "played_at" DATE NOT NULL,
    "player_count" INTEGER,
    "players" TEXT[],
    "location" TEXT,
    "duration" INTEGER,
    "rating" DECIMAL(2,1),
    "memo" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "play_logs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "play_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
    CONSTRAINT "play_logs_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_play_logs_user" ON "play_logs"("user_id");
CREATE INDEX IF NOT EXISTS "idx_play_logs_game" ON "play_logs"("game_id");
CREATE INDEX IF NOT EXISTS "idx_play_logs_played_at" ON "play_logs"("played_at" DESC);

-- =============================================
-- play_log_scores
-- =============================================
CREATE TABLE IF NOT EXISTS "play_log_scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "play_log_id" UUID NOT NULL,
    "player_name" TEXT NOT NULL,
    "score" INTEGER,
    "is_winner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "play_log_scores_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "play_log_scores_play_log_id_fkey" FOREIGN KEY ("play_log_id") REFERENCES "play_logs"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_play_log_scores_log" ON "play_log_scores"("play_log_id");

-- =============================================
-- RLS 활성화
-- =============================================
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ratings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "play_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "play_log_scores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "games" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "game_tags" ENABLE ROW LEVEL SECURITY;

-- games / tags / game_tags: 누구나 읽기
DROP POLICY IF EXISTS "games: 누구나 읽기" ON "games";
CREATE POLICY "games: 누구나 읽기" ON "games" FOR SELECT USING (true);

DROP POLICY IF EXISTS "tags: 누구나 읽기" ON "tags";
CREATE POLICY "tags: 누구나 읽기" ON "tags" FOR SELECT USING (true);

DROP POLICY IF EXISTS "game_tags: 누구나 읽기" ON "game_tags";
CREATE POLICY "game_tags: 누구나 읽기" ON "game_tags" FOR SELECT USING (true);

-- profiles: 누구나 읽기, 본인만 수정
DROP POLICY IF EXISTS "profiles: 누구나 읽기" ON "profiles";
CREATE POLICY "profiles: 누구나 읽기" ON "profiles" FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles: 본인만 수정" ON "profiles";
CREATE POLICY "profiles: 본인만 수정" ON "profiles" FOR UPDATE USING (auth.uid() = id);

-- collections
DROP POLICY IF EXISTS "collections: 누구나 읽기" ON "collections";
CREATE POLICY "collections: 누구나 읽기" ON "collections" FOR SELECT USING (true);
DROP POLICY IF EXISTS "collections: 본인만 생성" ON "collections";
CREATE POLICY "collections: 본인만 생성" ON "collections" FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "collections: 본인만 수정" ON "collections";
CREATE POLICY "collections: 본인만 수정" ON "collections" FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "collections: 본인만 삭제" ON "collections";
CREATE POLICY "collections: 본인만 삭제" ON "collections" FOR DELETE USING (auth.uid() = user_id);

-- ratings
DROP POLICY IF EXISTS "ratings: 누구나 읽기" ON "ratings";
CREATE POLICY "ratings: 누구나 읽기" ON "ratings" FOR SELECT USING (true);
DROP POLICY IF EXISTS "ratings: 본인만 생성" ON "ratings";
CREATE POLICY "ratings: 본인만 생성" ON "ratings" FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "ratings: 본인만 수정" ON "ratings";
CREATE POLICY "ratings: 본인만 수정" ON "ratings" FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "ratings: 본인만 삭제" ON "ratings";
CREATE POLICY "ratings: 본인만 삭제" ON "ratings" FOR DELETE USING (auth.uid() = user_id);

-- play_logs
DROP POLICY IF EXISTS "play_logs: 공개만 읽기" ON "play_logs";
CREATE POLICY "play_logs: 공개만 읽기" ON "play_logs" FOR SELECT USING (is_public = true OR auth.uid() = user_id);
DROP POLICY IF EXISTS "play_logs: 본인만 생성" ON "play_logs";
CREATE POLICY "play_logs: 본인만 생성" ON "play_logs" FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "play_logs: 본인만 수정" ON "play_logs";
CREATE POLICY "play_logs: 본인만 수정" ON "play_logs" FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "play_logs: 본인만 삭제" ON "play_logs";
CREATE POLICY "play_logs: 본인만 삭제" ON "play_logs" FOR DELETE USING (auth.uid() = user_id);

-- play_log_scores: play_log 소유자만
DROP POLICY IF EXISTS "play_log_scores: 소유자 접근" ON "play_log_scores";
CREATE POLICY "play_log_scores: 소유자 접근" ON "play_log_scores" FOR ALL
    USING (EXISTS (SELECT 1 FROM play_logs WHERE play_logs.id = play_log_id AND (play_logs.is_public = true OR play_logs.user_id = auth.uid())));
