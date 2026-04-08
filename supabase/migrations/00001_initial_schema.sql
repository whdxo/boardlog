-- ============================================================
-- BoardLog 초기 스키마
-- Supabase Dashboard → SQL Editor 에서 실행
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. profiles (유저 프로필)
--    auth.users 가입 시 트리거로 자동 생성
-- ────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL UNIQUE,
  profile_image TEXT,
  bio TEXT,

  follower_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_nickname ON profiles (nickname);

-- 새 유저 가입 시 profiles 자동 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nickname)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'name',
      'user_' || LEFT(NEW.id::text, 8)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2. games (보드게임)
-- ────────────────────────────────────────────────────────────

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,                -- 한글 게임명
  title_en TEXT,                      -- 영문 게임명
  thumbnail TEXT,
  description TEXT,

  designer TEXT,
  publisher TEXT,
  release_year INTEGER,

  min_players INTEGER NOT NULL DEFAULT 1,
  max_players INTEGER NOT NULL DEFAULT 4,
  min_play_time INTEGER,
  max_play_time INTEGER,
  min_age INTEGER,

  genres TEXT[] NOT NULL DEFAULT '{}',

  avg_rating NUMERIC(3,1) DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,

  price INTEGER,                      -- 원 단위
  purchase_url TEXT,
  bgg_id TEXT,

  is_new BOOLEAN NOT NULL DEFAULT false,
  rank INTEGER,
  rank_change INTEGER DEFAULT 0,      -- +상승, -하락, 0유지

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_games_title ON games (title);
CREATE INDEX idx_games_genres ON games USING gin (genres);
CREATE INDEX idx_games_avg_rating ON games (avg_rating DESC);
CREATE INDEX idx_games_rank ON games (rank ASC NULLS LAST);

-- ────────────────────────────────────────────────────────────
-- 3. collections (컬렉션 - 8종 상태)
-- ────────────────────────────────────────────────────────────

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,

  status TEXT NOT NULL CHECK (status IN (
    'owned', 'fan', 'wishlist', 'completed', 'preorder', 'selling', 'lent', 'borrowed'
  )),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, game_id)
);

CREATE INDEX idx_collections_user ON collections (user_id);
CREATE INDEX idx_collections_user_status ON collections (user_id, status);
CREATE INDEX idx_collections_game ON collections (game_id);

-- ────────────────────────────────────────────────────────────
-- 4. ratings (평점)
-- ────────────────────────────────────────────────────────────

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,

  score NUMERIC(3,1) NOT NULL CHECK (score >= 1 AND score <= 10),  -- 0.5 단위
  comment TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, game_id)
);

CREATE INDEX idx_ratings_game ON ratings (game_id);
CREATE INDEX idx_ratings_user ON ratings (user_id);

-- ────────────────────────────────────────────────────────────
-- 5. play_logs (플레이 기록)
-- ────────────────────────────────────────────────────────────

CREATE TABLE play_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,

  played_at DATE NOT NULL,
  players TEXT[],                     -- 함께한 사람 이름
  player_count INTEGER,
  location TEXT,
  duration INTEGER,                   -- 분 단위
  rating NUMERIC(2,1),
  memo TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE play_log_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_log_id UUID NOT NULL REFERENCES play_logs(id) ON DELETE CASCADE,

  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  is_winner BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_play_logs_user ON play_logs (user_id);
CREATE INDEX idx_play_logs_game ON play_logs (game_id);
CREATE INDEX idx_play_logs_played_at ON play_logs (played_at DESC);
CREATE INDEX idx_play_log_scores_log ON play_log_scores (play_log_id);

-- ────────────────────────────────────────────────────────────
-- 6. selections (셀렉션 / 큐레이션)
-- ────────────────────────────────────────────────────────────

CREATE TABLE selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  game_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE selection_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  selection_id UUID NOT NULL REFERENCES selections(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,

  memo TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,

  UNIQUE (selection_id, game_id)
);

CREATE INDEX idx_selections_user ON selections (user_id);
CREATE INDEX idx_selection_games_selection ON selection_games (selection_id);

-- ────────────────────────────────────────────────────────────
-- 7. posts (커뮤니티 게시글)
-- ────────────────────────────────────────────────────────────

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  category TEXT NOT NULL CHECK (category IN ('review', 'info', 'strategy', 'free')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],

  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 게시글-게임 태그 (N:M)
CREATE TABLE post_game_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, game_id)
);

-- 좋아요
CREATE TABLE post_likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- 북마크
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, game_id)
);

CREATE INDEX idx_posts_user ON posts (user_id);
CREATE INDEX idx_posts_category ON posts (category);
CREATE INDEX idx_posts_created ON posts (created_at DESC);
CREATE INDEX idx_posts_like_count ON posts (like_count DESC);
CREATE INDEX idx_bookmarks_user ON bookmarks (user_id);

-- ────────────────────────────────────────────────────────────
-- 8. comments (댓글)
-- ────────────────────────────────────────────────────────────

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- 대댓글

  like_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments (post_id);
CREATE INDEX idx_comments_parent ON comments (parent_id);

-- ────────────────────────────────────────────────────────────
-- 9. local_places (로컬 장소)
-- ────────────────────────────────────────────────────────────

CREATE TABLE local_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cafe', 'store', 'club')),
  address TEXT NOT NULL,
  address_detail TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,

  phone TEXT,
  instagram TEXT,
  website TEXT,

  thumbnails TEXT[],
  avg_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  game_count INTEGER DEFAULT 0,

  entrance_fee TEXT,
  is_open BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES local_places(id) ON DELETE CASCADE,

  day TEXT NOT NULL,           -- '월', '화', ...
  open_time TEXT,              -- '10:00'
  close_time TEXT,             -- '22:00'
  is_closed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE local_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES local_places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  score NUMERIC(2,1) NOT NULL CHECK (score >= 1 AND score <= 5),
  content TEXT NOT NULL,
  images TEXT[],

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (place_id, user_id)
);

CREATE INDEX idx_local_places_type ON local_places (type);
CREATE INDEX idx_local_reviews_place ON local_reviews (place_id);

-- ────────────────────────────────────────────────────────────
-- 10. shop_products (쇼핑)
-- ────────────────────────────────────────────────────────────

CREATE TABLE shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),

  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  original_price INTEGER NOT NULL,
  discount_rate INTEGER DEFAULT 0,
  discounted_price INTEGER NOT NULL,

  category TEXT NOT NULL DEFAULT 'game' CHECK (category IN ('game', 'accessory')),
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_wishlisted BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE store_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES shop_products(id) ON DELETE CASCADE,

  store_name TEXT NOT NULL,
  store_url TEXT NOT NULL,
  price INTEGER NOT NULL,
  logo_url TEXT
);

CREATE INDEX idx_shop_products_game ON shop_products (game_id);
CREATE INDEX idx_shop_products_category ON shop_products (category);
CREATE INDEX idx_store_prices_product ON store_prices (product_id);

-- ────────────────────────────────────────────────────────────
-- 11. used_posts (중고거래)
-- ────────────────────────────────────────────────────────────

CREATE TABLE used_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN ('sell', 'buy', 'trade', 'share')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'done')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,

  price INTEGER,
  condition TEXT CHECK (condition IN ('new', 'good', 'normal', 'poor')),
  trade_method TEXT CHECK (trade_method IN ('delivery', 'direct', 'both')),

  images TEXT[],
  view_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 중고거래-게임 태그 (N:M)
CREATE TABLE used_post_game_tags (
  used_post_id UUID NOT NULL REFERENCES used_posts(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  PRIMARY KEY (used_post_id, game_id)
);

CREATE TABLE used_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES used_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  content TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_used_posts_user ON used_posts (user_id);
CREATE INDEX idx_used_posts_type ON used_posts (type);
CREATE INDEX idx_used_posts_status ON used_posts (status);
CREATE INDEX idx_used_posts_created ON used_posts (created_at DESC);
CREATE INDEX idx_used_comments_post ON used_comments (post_id);

-- ────────────────────────────────────────────────────────────
-- 12. follows (팔로우)
-- ────────────────────────────────────────────────────────────

CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_following ON follows (following_id);

-- ────────────────────────────────────────────────────────────
-- 13. notifications (알림)
-- ────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN (
    'price_change', 'play_reminder', 'system', 'log_saved',
    'comment', 'like', 'follow'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications (created_at DESC);

-- ────────────────────────────────────────────────────────────
-- 14. updated_at 자동 갱신 트리거
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 컬럼이 있는 테이블에 트리거 적용
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON play_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON selections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON used_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 15. RLS (Row Level Security)
-- ============================================================

-- 모든 테이블 RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_log_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE selection_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_game_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_post_game_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ── 공개 데이터: 누구나 읽기 ──────────────────────────
CREATE POLICY "games_select" ON games FOR SELECT USING (true);
CREATE POLICY "local_places_select" ON local_places FOR SELECT USING (true);
CREATE POLICY "business_hours_select" ON business_hours FOR SELECT USING (true);
CREATE POLICY "shop_products_select" ON shop_products FOR SELECT USING (true);
CREATE POLICY "store_prices_select" ON store_prices FOR SELECT USING (true);
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "post_game_tags_select" ON post_game_tags FOR SELECT USING (true);
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "collections_select" ON collections FOR SELECT USING (true);
CREATE POLICY "ratings_select" ON ratings FOR SELECT USING (true);
CREATE POLICY "play_logs_select" ON play_logs FOR SELECT USING (true);
CREATE POLICY "play_log_scores_select" ON play_log_scores FOR SELECT USING (true);
CREATE POLICY "selections_select" ON selections FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "selection_games_select" ON selection_games FOR SELECT USING (true);
CREATE POLICY "used_posts_select" ON used_posts FOR SELECT USING (true);
CREATE POLICY "used_post_game_tags_select" ON used_post_game_tags FOR SELECT USING (true);
CREATE POLICY "used_comments_select" ON used_comments FOR SELECT USING (true);
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);

-- ── profiles: 본인만 수정 ─────────────────────────────
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── 본인 데이터 CUD (생성/수정/삭제) ──────────────────
-- collections
CREATE POLICY "collections_insert" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collections_update" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "collections_delete" ON collections FOR DELETE USING (auth.uid() = user_id);

-- ratings
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update" ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ratings_delete" ON ratings FOR DELETE USING (auth.uid() = user_id);

-- play_logs
CREATE POLICY "play_logs_insert" ON play_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "play_logs_update" ON play_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "play_logs_delete" ON play_logs FOR DELETE USING (auth.uid() = user_id);

-- play_log_scores (play_log 소유자만)
CREATE POLICY "play_log_scores_insert" ON play_log_scores FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM play_logs WHERE id = play_log_id AND user_id = auth.uid()));
CREATE POLICY "play_log_scores_delete" ON play_log_scores FOR DELETE
  USING (EXISTS (SELECT 1 FROM play_logs WHERE id = play_log_id AND user_id = auth.uid()));

-- selections
CREATE POLICY "selections_insert" ON selections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "selections_update" ON selections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "selections_delete" ON selections FOR DELETE USING (auth.uid() = user_id);

-- selection_games (selection 소유자만)
CREATE POLICY "selection_games_insert" ON selection_games FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM selections WHERE id = selection_id AND user_id = auth.uid()));
CREATE POLICY "selection_games_delete" ON selection_games FOR DELETE
  USING (EXISTS (SELECT 1 FROM selections WHERE id = selection_id AND user_id = auth.uid()));

-- posts
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (auth.uid() = user_id);

-- post_game_tags (게시글 소유자만)
CREATE POLICY "post_game_tags_insert" ON post_game_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM posts WHERE id = post_id AND user_id = auth.uid()));
CREATE POLICY "post_game_tags_delete" ON post_game_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM posts WHERE id = post_id AND user_id = auth.uid()));

-- post_likes
CREATE POLICY "post_likes_insert" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- bookmarks
CREATE POLICY "bookmarks_insert" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- comments
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- local_reviews
CREATE POLICY "local_reviews_insert" ON local_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "local_reviews_update" ON local_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "local_reviews_delete" ON local_reviews FOR DELETE USING (auth.uid() = user_id);

-- used_posts
CREATE POLICY "used_posts_insert" ON used_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "used_posts_update" ON used_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "used_posts_delete" ON used_posts FOR DELETE USING (auth.uid() = user_id);

-- used_post_game_tags (중고글 소유자만)
CREATE POLICY "used_post_game_tags_insert" ON used_post_game_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM used_posts WHERE id = used_post_id AND user_id = auth.uid()));
CREATE POLICY "used_post_game_tags_delete" ON used_post_game_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM used_posts WHERE id = used_post_id AND user_id = auth.uid()));

-- used_comments
CREATE POLICY "used_comments_insert" ON used_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "used_comments_delete" ON used_comments FOR DELETE USING (auth.uid() = user_id);

-- follows
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- notifications (본인 것만)
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- 16. Storage 버킷
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('game-images', 'game-images', true),
  ('post-images', 'post-images', true),
  ('used-images', 'used-images', true),
  ('local-images', 'local-images', true);

-- Storage RLS: 누구나 읽기, 로그인 유저만 업로드
CREATE POLICY "storage_public_read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "storage_auth_upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "storage_owner_delete" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
