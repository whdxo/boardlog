"use client";

import { useQuery } from "@tanstack/react-query";
import { getCollectionCounts, getCollectionGames } from "@/lib/api/collection";
import type { CollectionStatus } from "@/types";

export function useCollectionCounts(userId: string | undefined) {
  return useQuery({
    queryKey: ["my", "collectionCounts", userId],
    queryFn: () => getCollectionCounts(userId!),
    enabled: !!userId,
  });
}

export function useCollectionGames(
  userId: string | undefined,
  status?: CollectionStatus | "all",
  sort: "newest" | "name" = "newest",
  page = 0
) {
  return useQuery({
    queryKey: ["my", "collectionGames", userId, status, sort, page],
    queryFn: () => getCollectionGames(userId!, status, sort, page),
    enabled: !!userId,
  });
}
