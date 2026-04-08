import { create } from "zustand";
import type { Collection, CollectionStatus, Rating } from "@/types";

interface CollectionState {
  statuses: Record<string, CollectionStatus | null>;
  ratings: Record<string, number | null>;
  setStatus: (gameId: string, status: CollectionStatus | null) => void;
  setRating: (gameId: string, rating: number | null) => void;
  initFromServer: (collections: Collection[], ratings: Rating[]) => void;
  reset: () => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  statuses: {},
  ratings: {},

  setStatus: (gameId, status) =>
    set((s) => ({ statuses: { ...s.statuses, [gameId]: status } })),

  setRating: (gameId, rating) =>
    set((s) => ({ ratings: { ...s.ratings, [gameId]: rating } })),

  initFromServer: (collections, ratings) => {
    const statuses: Record<string, CollectionStatus | null> = {};
    const ratingsMap: Record<string, number | null> = {};
    for (const c of collections) statuses[c.gameId] = c.status;
    for (const r of ratings) ratingsMap[r.gameId] = r.score;
    set({ statuses, ratings: ratingsMap });
  },

  reset: () => set({ statuses: {}, ratings: {} }),
}));
