"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { useCollectionStore } from "@/stores/collectionStore";
import type { CollectionStatus } from "@/types";

// ── 컬렉션 상태 저장 (낙관적 업데이트) ────────────────────────
export function useSetCollection(gameId: string) {
  const { setStatus } = useCollectionStore();

  return useMutation({
    mutationFn: (status: CollectionStatus) =>
      fetchApi("/api/collections", {
        method: "POST",
        body: JSON.stringify({ gameId, status }),
      }),

    onMutate: (status) => {
      const prev = useCollectionStore.getState().statuses[gameId];
      setStatus(gameId, status);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setStatus(gameId, ctx.prev ?? null);
    },
  });
}

// ── 컬렉션 제거 (낙관적 업데이트) ─────────────────────────────
export function useRemoveCollection(gameId: string) {
  const { setStatus } = useCollectionStore();

  return useMutation({
    mutationFn: () =>
      fetchApi(`/api/collections?gameId=${encodeURIComponent(gameId)}`, {
        method: "DELETE",
      }),

    onMutate: () => {
      const prev = useCollectionStore.getState().statuses[gameId];
      setStatus(gameId, null);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setStatus(gameId, ctx.prev ?? null);
    },
  });
}
