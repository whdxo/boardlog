-- =============================================
-- STEP 1: Drop old tables
-- =============================================
DROP TABLE IF EXISTS "board_game_tags" CASCADE;
DROP TABLE IF EXISTS "game_tags" CASCADE;
DROP TABLE IF EXISTS "board_games" CASCADE;
DROP TABLE IF EXISTS "play_log_scores" CASCADE;
DROP TABLE IF EXISTS "play_logs" CASCADE;
DROP TABLE IF EXISTS "ratings" CASCADE;
DROP TABLE IF EXISTS "collections" CASCADE;
DROP TABLE IF EXISTS "games" CASCADE;
DROP TABLE IF EXISTS "tags" CASCADE;

-- =============================================
-- STEP 2: Create games table
-- =============================================
CREATE TABLE "games" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bgg_id" TEXT,
    "title" TEXT NOT NULL,
    "title_kr" TEXT,
    "title_en" TEXT,
    "description" TEXT,
    "min_players" INTEGER NOT NULL DEFAULT 1,
    "max_players" INTEGER NOT NULL DEFAULT 4,
    "min_play_time" INTEGER,
    "max_play_time" INTEGER,
    "min_age" INTEGER,
    "genres" TEXT[] NOT NULL DEFAULT '{}',
    "designer" TEXT,
    "publisher" TEXT,
    "release_year" INTEGER,
    "thumbnail" TEXT,
    "image_url" TEXT,
    "price" INTEGER,
    "avg_rating" DECIMAL(3,1),
    "rating_count" INTEGER,
    "rank" INTEGER,
    "rank_change" INTEGER,
    "weight" DECIMAL(3,2),
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "is_expansion" BOOLEAN NOT NULL DEFAULT false,
    "last_synced_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "games_bgg_id_key" ON "games"("bgg_id");
CREATE INDEX "idx_games_title" ON "games"("title");
CREATE INDEX "idx_games_title_kr" ON "games"("title_kr");
CREATE INDEX "idx_games_rank" ON "games"("rank");
CREATE INDEX "idx_games_avg_rating" ON "games"("avg_rating");
CREATE INDEX "idx_games_rating_count" ON "games"("rating_count");
CREATE INDEX "idx_games_release_year" ON "games"("release_year");

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_games_updated_at
    BEFORE UPDATE ON "games"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STEP 3: Create tags / game_tags
-- =============================================
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "name_kr" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE INDEX "idx_tags_type" ON "tags"("type");

CREATE TABLE "game_tags" (
    "game_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "game_tags_pkey" PRIMARY KEY ("game_id","tag_id"),
    CONSTRAINT "game_tags_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
    CONSTRAINT "game_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_game_tags_tag_id" ON "game_tags"("tag_id");

-- =============================================
-- STEP 4: Create app tables
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

CREATE TABLE "collections" (
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

CREATE INDEX "idx_collections_user" ON "collections"("user_id");
CREATE INDEX "idx_collections_user_status" ON "collections"("user_id", "status");
CREATE INDEX "idx_collections_game" ON "collections"("game_id");

CREATE TABLE "ratings" (
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

CREATE INDEX "idx_ratings_game" ON "ratings"("game_id");
CREATE INDEX "idx_ratings_user" ON "ratings"("user_id");

CREATE TABLE "play_logs" (
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

CREATE INDEX "idx_play_logs_user" ON "play_logs"("user_id");
CREATE INDEX "idx_play_logs_game" ON "play_logs"("game_id");
CREATE INDEX "idx_play_logs_played_at" ON "play_logs"("played_at" DESC);

CREATE TABLE "play_log_scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "play_log_id" UUID NOT NULL,
    "player_name" TEXT NOT NULL,
    "score" INTEGER,
    "is_winner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "play_log_scores_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "play_log_scores_play_log_id_fkey" FOREIGN KEY ("play_log_id") REFERENCES "play_logs"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_play_log_scores_log" ON "play_log_scores"("play_log_id");

-- =============================================
-- STEP 5: RLS
-- =============================================
ALTER TABLE "games" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "game_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ratings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "play_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "play_log_scores" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "games: 누구나 읽기" ON "games" FOR SELECT USING (true);
CREATE POLICY "tags: 누구나 읽기" ON "tags" FOR SELECT USING (true);
CREATE POLICY "game_tags: 누구나 읽기" ON "game_tags" FOR SELECT USING (true);

CREATE POLICY "profiles: 누구나 읽기" ON "profiles" FOR SELECT USING (true);
CREATE POLICY "profiles: 본인만 수정" ON "profiles" FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "collections: 누구나 읽기" ON "collections" FOR SELECT USING (true);
CREATE POLICY "collections: 본인만 생성" ON "collections" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collections: 본인만 수정" ON "collections" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "collections: 본인만 삭제" ON "collections" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "ratings: 누구나 읽기" ON "ratings" FOR SELECT USING (true);
CREATE POLICY "ratings: 본인만 생성" ON "ratings" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings: 본인만 수정" ON "ratings" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ratings: 본인만 삭제" ON "ratings" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "play_logs: 읽기" ON "play_logs" FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "play_logs: 본인만 생성" ON "play_logs" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "play_logs: 본인만 수정" ON "play_logs" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "play_logs: 본인만 삭제" ON "play_logs" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "play_log_scores: 접근" ON "play_log_scores" FOR ALL
    USING (EXISTS (
        SELECT 1 FROM play_logs
        WHERE play_logs.id = play_log_id
        AND (play_logs.is_public = true OR play_logs.user_id = auth.uid())
    ));
