import { createClient } from "@/lib/supabase/client";
import type { CollectionStatus } from "@/types";

export async function getCollectionCounts(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("status")
    .eq("user_id", userId);

  if (error) throw error;

  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
    total++;
  }
  return { counts, total };
}

export interface CollectionGameRow {
  id: string;
  game_id: string;
  status: CollectionStatus;
  created_at: string;
  games: {
    id: string;
    title: string;
    title_en: string | null;
    thumbnail: string | null;
    min_players: number;
    max_players: number;
    avg_rating: number | null;
  };
}

export async function getCollectionGames(
  userId: string,
  status?: CollectionStatus | "all",
  sort: "newest" | "name" = "newest",
  page = 0,
  pageSize = 20
) {
  const supabase = createClient();
  let query = supabase
    .from("collections")
    .select(
      "id, game_id, status, created_at, games(id, title, title_en, thumbnail, min_players, max_players, avg_rating)",
      { count: "exact" }
    )
    .eq("user_id", userId);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: (data ?? []) as unknown as CollectionGameRow[],
    total: count ?? 0,
  };
}
