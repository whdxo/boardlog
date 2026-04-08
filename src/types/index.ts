// ── User ──────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
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
  isNew?: boolean;
  rank?: number;
  rankChange?: number; // +양수=상승, -음수=하락, 0=유지
}

// ── Collection (8종) ──────────────────────────────

export type CollectionStatus =
  | "owned"      // 보유중
  | "fan"        // 팬
  | "wishlist"   // 위시리스트
  | "completed"  // 플레이완료
  | "preorder"   // 예약중
  | "selling"    // 판매중
  | "lent"       // 빌려줌
  | "borrowed";  // 빌림

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
  game?: Game;
  score: number; // 1~10 (0.5 단위)
  comment?: string;
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

// ── Selection (큐레이션) ──────────────────────────

export interface Selection {
  id: string;
  userId: string;
  user?: User;
  title: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  games: SelectionGame[];
  gameCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelectionGame {
  gameId: string;
  game: Game;
  memo?: string;
  order: number;
}

// ── PlayLog ───────────────────────────────────────

export interface PlayLog {
  id: string;
  userId: string;
  gameId: string;
  game: Game;
  playedAt: string;
  players?: string[];
  playerCount?: number;
  location?: string;
  duration?: number; // 분 단위
  rating?: number;
  memo?: string;
  scores?: PlayerScore[];
  createdAt: string;
  updatedAt: string;
}

export interface PlayerScore {
  playerName: string;
  score: number;
  isWinner?: boolean;
}

export interface PlayLogFormData {
  gameId: string;
  playedAt: string;
  players: string[];
  location: string;
  duration?: number;
  rating?: number;
  memo: string;
  scores?: PlayerScore[];
}

// ── Community ─────────────────────────────────────

export type PostCategory = "review" | "info" | "strategy" | "free";

export interface Post {
  id: string;
  userId: string;
  user: User;
  category: PostCategory;
  title: string;
  content: string;
  images?: string[];
  gameTags?: Game[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string;
  replies?: Comment[];
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
}

// ── Local ─────────────────────────────────────────

export type LocalType = "cafe" | "store" | "club";

export interface LocalPlace {
  id: string;
  name: string;
  type: LocalType;
  address: string;
  addressDetail?: string;
  lat: number;
  lng: number;
  phone?: string;
  instagram?: string;
  website?: string;
  thumbnails?: string[];
  avgRating?: number;
  reviewCount?: number;
  gameCount?: number;
  businessHours?: BusinessHours[];
  entranceFee?: string;
  isOpen?: boolean;
  createdAt: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface LocalReview {
  id: string;
  placeId: string;
  userId: string;
  user: User;
  score: number;
  content: string;
  images?: string[];
  createdAt: string;
}

// ── Shop ──────────────────────────────────────────

export interface ShopProduct {
  id: string;
  gameId?: string;
  game?: Game;
  title: string;
  thumbnail: string;
  originalPrice: number;
  discountRate?: number;
  discountedPrice: number;
  category: "game" | "accessory";
  stores: StorePrice[];
  isNew?: boolean;
  isWishlisted?: boolean;
  createdAt: string;
}

export interface StorePrice {
  storeName: string;
  storeUrl: string;
  price: number;
  logoUrl?: string;
}

// ── Used (중고거래) ────────────────────────────────

export type UsedType = "sell" | "buy" | "trade" | "share";
export type UsedStatus = "active" | "reserved" | "done";
export type ItemCondition = "new" | "good" | "normal" | "poor";
export type TradeMethod = "delivery" | "direct" | "both";

export interface UsedPost {
  id: string;
  userId: string;
  user: User;
  type: UsedType;
  status: UsedStatus;
  title: string;
  content: string;
  price?: number;
  condition?: ItemCondition;
  tradeMethod?: TradeMethod;
  images?: string[];
  gameTags?: Game[];
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsedComment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

// ── Notification ──────────────────────────────────

export type NotificationType =
  | "price_change"
  | "play_reminder"
  | "system"
  | "log_saved"
  | "comment"
  | "like"
  | "follow";

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

// ── Filters ───────────────────────────────────────

export interface GameFilter {
  search?: string;
  players?: string;
  priceRange?: string;
  genres?: string[];
  playTime?: string;
  minAge?: string;
  sortBy?: "popular" | "rating" | "price_asc" | "price_desc" | "newest";
}

export interface PostFilter {
  category?: PostCategory;
  feed?: "latest" | "best" | "following";
  search?: string;
}

export interface LocalFilter {
  type?: LocalType;
  region?: string;
  district?: string;
}

export interface ShopFilter {
  category?: "game" | "accessory";
  minPrice?: number;
  maxPrice?: number;
  wishlistOnly?: boolean;
  sortBy?: "newest" | "discount" | "price_asc" | "price_desc";
}

export interface UsedFilter {
  type?: UsedType;
  gameId?: string;
  search?: string;
}
