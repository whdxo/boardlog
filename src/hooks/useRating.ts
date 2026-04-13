"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { useCollectionStore } from "@/stores/collectionStore";

// ── 평점 저장 (낙관적 업데이트) ────────────────────────────────
export function useSaveRating(gameId: string) {
  const { setRating } = useCollectionStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (score: number) =>
      fetchApi("/api/ratings", {
        method: "POST",
        body: JSON.stringify({ gameId, score }),
      }),

    onMutate: (score) => {
      const prev = useCollectionStore.getState().ratings[gameId];
      setRating(gameId, score);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setRating(gameId, ctx.prev ?? null);
    },
    onSuccess: () => {
      // 게임 상세 페이지의 avg_rating 반영
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}

// ── 평점 삭제 (낙관적 업데이트) ────────────────────────────────
export function useDeleteRating(gameId: string) {
  const { setRating } = useCollectionStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchApi(`/api/ratings?gameId=${encodeURIComponent(gameId)}`, {
        method: "DELETE",
      }),

    onMutate: () => {
      const prev = useCollectionStore.getState().ratings[gameId];
      setRating(gameId, null);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setRating(gameId, ctx.prev ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}
