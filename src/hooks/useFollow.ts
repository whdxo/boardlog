"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

// ── 팔로우 상태 조회 ────────────────────────────────────────────
export function useFollowStatus(userId: string | undefined, isLoggedIn: boolean) {
  return useQuery({
    queryKey: ["follow", userId, isLoggedIn],
    queryFn: () => fetchApi<{ isFollowing: boolean }>(`/api/users/${userId}/follow`),
    enabled: !!userId && isLoggedIn,
    staleTime: 60 * 1000,
  });
}

// ── 팔로우 / 언팔로우 mutation ─────────────────────────────────
export function useToggleFollow(targetUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isFollowing }: { isFollowing: boolean }) =>
      fetchApi<{ isFollowing: boolean }>(`/api/users/${targetUserId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      }),
    onSuccess: (data) => {
      // isLoggedIn=true인 캐시 키로 갱신
      queryClient.setQueryData(["follow", targetUserId, true], data);
      // 프로필 데이터도 무효화 (follower_count 갱신을 위해)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
