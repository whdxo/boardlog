import type { CollectionStatus, PostCategory, UsedType, ItemCondition, TradeMethod } from "@/types";

// ── 라우트 ────────────────────────────────────────

export const ROUTES = {
  HOME: "/",
  // 게임
  GAMES: "/games",
  GAMES_RANKING: "/games/ranking",
  GAMES_NEW: "/games/new",
  GAME_DETAIL: (id: string) => `/games/${id}`,
  // 커뮤니티
  COMMUNITY: "/community",
  COMMUNITY_NEW: "/community/new",
  COMMUNITY_DETAIL: (id: string) => `/community/${id}`,
  // 로컬
  LOCAL: "/local",
  LOCAL_DETAIL: (id: string) => `/local/${id}`,
  // 쇼핑
  SHOP: "/shop",
  SHOP_DETAIL: (id: string) => `/shop/${id}`,
  // 중고거래
  USED: "/used",
  USED_WRITE: "/used/write",
  USED_DETAIL: (id: string) => `/used/${id}`,
  // 검색
  SEARCH: "/search",
  // 내 게임
  MY: "/my",
  MY_STATS: "/my/stats",
  MY_SELECTIONS: "/my/selections",
  MY_SELECTION_DETAIL: (id: string) => `/my/selections/${id}`,
  MY_LOGS_WRITE: "/my/logs/write",
  MY_LOG_DETAIL: (id: string) => `/my/logs/${id}`,
  MY_LOG_EDIT: (id: string) => `/my/logs/${id}/edit`,
  // 계정
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_USER: (id: string) => `/profile/${id}`,
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_PASSWORD: "/settings/password",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_WITHDRAW: "/settings/withdraw",
  // 인증
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  // 정적
  TERMS: "/terms",
  PRIVACY: "/privacy",
  GUIDELINES: "/guidelines",
} as const;

// ── 게임 필터 ──────────────────────────────────────

export const PLAYER_OPTIONS = [
  { label: "1인", value: "1" },
  { label: "2인", value: "2" },
  { label: "3~4인", value: "3-4" },
  { label: "5인 이상", value: "5+" },
];

export const PRICE_OPTIONS = [
  { label: "~2만원", value: "~20000" },
  { label: "2~4만원", value: "20000-40000" },
  { label: "4~6만원", value: "40000-60000" },
  { label: "6만원~", value: "60000+" },
];

export const GENRE_OPTIONS = [
  "전략", "가족", "파티", "추리", "협력", "경제", "카드", "주사위",
  "테마", "추상", "워게임", "덱빌딩",
];

export const PLAY_TIME_OPTIONS = [
  { label: "~30분", value: "~30" },
  { label: "30~60분", value: "30-60" },
  { label: "60~120분", value: "60-120" },
  { label: "2시간~", value: "120+" },
];

export const AGE_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "8+", value: "8" },
  { label: "12+", value: "12" },
  { label: "14+", value: "14" },
];

export const SORT_OPTIONS = [
  { label: "인기순", value: "popular" },
  { label: "평점 높은순", value: "rating" },
  { label: "가격 낮은순", value: "price_asc" },
  { label: "가격 높은순", value: "price_desc" },
  { label: "최신순", value: "newest" },
];

// ── 8종 컬렉션 상태 ───────────────────────────────

export const COLLECTION_STATUSES: {
  value: CollectionStatus;
  label: string;
  emoji: string;
  description: string;
  color: string;
}[] = [
  { value: "owned",     label: "보유중",    emoji: "📦", description: "이 게임을 갖고 있어요",   color: "bg-blue-100 text-blue-700" },
  { value: "fan",       label: "팬",        emoji: "❤️", description: "이 게임의 팬이에요",      color: "bg-red-100 text-red-700" },
  { value: "wishlist",  label: "위시리스트", emoji: "⭐", description: "갖고 싶은 게임이에요",   color: "bg-yellow-100 text-yellow-700" },
  { value: "completed", label: "플레이완료", emoji: "✅", description: "플레이를 완료했어요",    color: "bg-green-100 text-green-700" },
  { value: "preorder",  label: "예약중",    emoji: "🔖", description: "구매 예약 중이에요",      color: "bg-purple-100 text-purple-700" },
  { value: "selling",   label: "판매중",    emoji: "🏷️", description: "중고로 판매 중이에요",   color: "bg-orange-100 text-orange-700" },
  { value: "lent",      label: "빌려줌",    emoji: "📤", description: "누군가에게 빌려줬어요",  color: "bg-cyan-100 text-cyan-700" },
  { value: "borrowed",  label: "빌림",      emoji: "📥", description: "빌려온 게임이에요",      color: "bg-gray-100 text-gray-700" },
];

export const COLLECTION_STATUS_LABEL: Record<CollectionStatus, string> = {
  owned:     "보유중",
  fan:       "팬",
  wishlist:  "위시리스트",
  completed: "플레이완료",
  preorder:  "예약중",
  selling:   "판매중",
  lent:      "빌려줌",
  borrowed:  "빌림",
};

// ── 커뮤니티 ──────────────────────────────────────

export const POST_CATEGORIES: {
  value: PostCategory;
  label: string;
  color: string;
}[] = [
  { value: "review",   label: "후기",  color: "bg-blue-100 text-blue-700" },
  { value: "info",     label: "정보",  color: "bg-green-100 text-green-700" },
  { value: "strategy", label: "공략",  color: "bg-purple-100 text-purple-700" },
  { value: "free",     label: "자유",  color: "bg-gray-100 text-gray-600" },
];

// ── 중고거래 ──────────────────────────────────────

export const USED_TYPE_OPTIONS: {
  value: UsedType;
  label: string;
  color: string;
}[] = [
  { value: "sell",  label: "판매", color: "bg-blue-100 text-blue-700" },
  { value: "buy",   label: "구매", color: "bg-green-100 text-green-700" },
  { value: "trade", label: "교환", color: "bg-purple-100 text-purple-700" },
  { value: "share", label: "나눔", color: "bg-orange-100 text-orange-700" },
];

export const ITEM_CONDITION_OPTIONS: {
  value: ItemCondition;
  label: string;
  description: string;
}[] = [
  { value: "new",    label: "미개봉", description: "개봉 전 새 상품" },
  { value: "good",   label: "상",     description: "사용감 거의 없음" },
  { value: "normal", label: "중",     description: "사용감 있지만 정상 기능" },
  { value: "poor",   label: "하",     description: "사용감 많음, 기능 이상 없음" },
];

export const TRADE_METHOD_OPTIONS: {
  value: TradeMethod;
  label: string;
}[] = [
  { value: "delivery", label: "택배" },
  { value: "direct",   label: "직거래" },
  { value: "both",     label: "둘 다 가능" },
];

// ── 랭킹 ──────────────────────────────────────────

export const RANKING_PERIOD_OPTIONS = [
  { label: "주간", value: "weekly" },
  { label: "월간", value: "monthly" },
  { label: "전체", value: "all" },
];
