import { create } from "zustand";
import type { GameFilter, PostFilter, LocalFilter, ShopFilter, UsedFilter } from "@/types";

interface FilterState {
  games: GameFilter;
  posts: PostFilter;
  local: LocalFilter;
  shop: ShopFilter;
  used: UsedFilter;

  setGameFilter: (filter: Partial<GameFilter>) => void;
  resetGameFilter: () => void;
  setPostFilter: (filter: Partial<PostFilter>) => void;
  setLocalFilter: (filter: Partial<LocalFilter>) => void;
  setShopFilter: (filter: Partial<ShopFilter>) => void;
  setUsedFilter: (filter: Partial<UsedFilter>) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  games: {},
  posts: { feed: "latest" },
  local: {},
  shop: {},
  used: {},

  setGameFilter: (filter) =>
    set((s) => ({ games: { ...s.games, ...filter } })),
  resetGameFilter: () => set({ games: {} }),

  setPostFilter: (filter) =>
    set((s) => ({ posts: { ...s.posts, ...filter } })),

  setLocalFilter: (filter) =>
    set((s) => ({ local: { ...s.local, ...filter } })),

  setShopFilter: (filter) =>
    set((s) => ({ shop: { ...s.shop, ...filter } })),

  setUsedFilter: (filter) =>
    set((s) => ({ used: { ...s.used, ...filter } })),
}));
