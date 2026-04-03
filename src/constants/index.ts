export const ROUTES = {
  HOME: "/",
  GAMES: "/games",
  GAME_DETAIL: (id: string) => `/games/${id}`,
  MY: "/my",
  MY_LOGS_WRITE: "/my/logs/write",
  MY_LOG_DETAIL: (id: string) => `/my/logs/${id}`,
  MY_LOG_EDIT: (id: string) => `/my/logs/${id}/edit`,
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_PASSWORD: "/settings/password",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_WITHDRAW: "/settings/withdraw",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  GUIDELINES: "/guidelines",
} as const;

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

export const COLLECTION_STATUS_LABEL: Record<string, string> = {
  owned: "보유중",
  wishlist: "위시리스트",
  completed: "플레이완료",
};
