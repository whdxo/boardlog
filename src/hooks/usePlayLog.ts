"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import type { PlayLog, PlayLogFormData } from "@/types";

// ── 플레이 로그 단건 조회 ──────────────────────────────────────
export function usePlayLog(id: string | undefined) {
  return useQuery({
    queryKey: ["play-log", id],
    queryFn: () => fetchApi<PlayLog>(`/api/play-logs/${id}`),
    enabled: !!id,
  });
}

// ── 플레이 로그 생성 ───────────────────────────────────────────
export function useCreatePlayLog() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: PlayLogFormData & { visibility: "public" | "private" }) =>
      fetchApi<{ id: string }>("/api/play-logs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["play-logs"] });
      router.push(ROUTES.MY_LOG_DETAIL(data.id));
    },
  });
}

// ── 플레이 로그 수정 ───────────────────────────────────────────
export function useUpdatePlayLog(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Partial<PlayLogFormData> & { visibility?: "public" | "private" }) =>
      fetchApi<{ id: string }>(`/api/play-logs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["play-log", id] });
      queryClient.invalidateQueries({ queryKey: ["play-logs"] });
      router.push(ROUTES.MY_LOG_DETAIL(id));
    },
  });
}

// ── 플레이 로그 삭제 ───────────────────────────────────────────
export function useDeletePlayLog() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/api/play-logs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["play-logs"] });
      router.push(ROUTES.MY);
    },
  });
}
