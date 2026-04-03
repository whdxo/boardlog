// ── User ──────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
}

// ── Game ──────────────────────────────────────────

export interface Game {
  id: string;
  title: string;
  titleEn?: string;
  thumbnail: string;
  description?: string;
  designer?: string;
  publisher?: string;
  releaseYear?: number;
  minPlayers: number;
  maxPlayers: number;
  minPlayTime?: number;
  maxPlayTime?: number;
  minAge?: number;
  genres?: string[];
  avgRating?: number;
  ratingCount?: number;
  price?: number;
  purchaseUrl?: string;
  bggId?: string;
}

export type CollectionStatus = "owned" | "wishlist" | "completed";

export interface Collection {
  id: string;
  userId: string;
  gameId: string;
  game: Game;
  status: CollectionStatus;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  gameId: string;
  game: Game;
  score: number; // 1~5
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  gameId: string;
  game: Game;
  createdAt: string;
}

// ── PlayLog ───────────────────────────────────────

export interface PlayLog {
  id: string;
  userId: string;
  gameId: string;
  game: Game;
  playedAt: string;        // ISO date string
  players?: string[];      // 함께한 사람
  location?: string;       // 장소
  rating?: number;         // 별점 1~5
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayLogFormData {
  gameId: string;
  playedAt: string;
  players: string[];
  location: string;
  rating?: number;
  memo: string;
}

// ── Notification ──────────────────────────────────

export type NotificationType =
  | "price_change"
  | "play_reminder"
  | "system"
  | "log_saved";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ── API / Pagination ──────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// ── Filter ────────────────────────────────────────

export interface GameFilter {
  search?: string;
  players?: string;     // "1" | "2" | "3-4" | "5+"
  priceRange?: string;  // "~20000" | "20000-40000" | "40000-60000" | "60000+"
  genres?: string[];
  playTime?: string;    // "~30" | "30-60" | "60-120" | "120+"
  minAge?: string;      // "all" | "8" | "12" | "14"
  sortBy?: "popular" | "rating" | "price_asc" | "price_desc" | "newest";
}
