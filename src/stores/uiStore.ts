import { create } from "zustand";

interface UIState {
  isLoginSheetOpen: boolean;
  loginSheetCallbackUrl: string | null;
  isCollectionSheetOpen: boolean;
  collectionSheetGameId: string | null;
  isRatingModalOpen: boolean;
  ratingModalGameId: string | null;
  isSearchModalOpen: boolean;

  openLoginSheet: (callbackUrl?: string) => void;
  closeLoginSheet: () => void;
  openCollectionSheet: (gameId: string) => void;
  closeCollectionSheet: () => void;
  openRatingModal: (gameId: string) => void;
  closeRatingModal: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoginSheetOpen: false,
  loginSheetCallbackUrl: null,
  isCollectionSheetOpen: false,
  collectionSheetGameId: null,
  isRatingModalOpen: false,
  ratingModalGameId: null,
  isSearchModalOpen: false,

  openLoginSheet: (callbackUrl) =>
    set({ isLoginSheetOpen: true, loginSheetCallbackUrl: callbackUrl ?? null }),
  closeLoginSheet: () =>
    set({ isLoginSheetOpen: false, loginSheetCallbackUrl: null }),

  openCollectionSheet: (gameId) =>
    set({ isCollectionSheetOpen: true, collectionSheetGameId: gameId }),
  closeCollectionSheet: () =>
    set({ isCollectionSheetOpen: false, collectionSheetGameId: null }),

  openRatingModal: (gameId) =>
    set({ isRatingModalOpen: true, ratingModalGameId: gameId }),
  closeRatingModal: () =>
    set({ isRatingModalOpen: false, ratingModalGameId: null }),

  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
}));
