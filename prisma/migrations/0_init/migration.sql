-- Drop old tables
DROP TABLE IF EXISTS "board_game_tags" CASCADE;
DROP TABLE IF EXISTS "game_tags" CASCADE;
DROP TABLE IF EXISTS "board_games" CASCADE;
DROP TABLE IF EXISTS "tags" CASCADE;

-- CreateTable games
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

-- CreateTable tags
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "name_kr" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable game_tags
CREATE TABLE "game_tags" (
    "game_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "game_tags_pkey" PRIMARY KEY ("game_id","tag_id")
);

-- Indexes for games
CREATE UNIQUE INDEX "games_bgg_id_key" ON "games"("bgg_id");
CREATE INDEX "idx_games_title" ON "games"("title");
CREATE INDEX "idx_games_title_kr" ON "games"("title_kr");
CREATE INDEX "idx_games_rank" ON "games"("rank");
CREATE INDEX "idx_games_avg_rating" ON "games"("avg_rating");
CREATE INDEX "idx_games_rating_count" ON "games"("rating_count");
CREATE INDEX "idx_games_release_year" ON "games"("release_year");

-- Indexes for tags
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE INDEX "idx_tags_type" ON "tags"("type");

-- Indexes for game_tags
CREATE INDEX "idx_game_tags_tag_id" ON "game_tags"("tag_id");

-- ForeignKeys for game_tags
ALTER TABLE "game_tags" ADD CONSTRAINT "game_tags_game_id_fkey"
    FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "game_tags" ADD CONSTRAINT "game_tags_tag_id_fkey"
    FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- updated_at trigger
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
