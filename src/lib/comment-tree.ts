import type { Comment } from "@/types";

// DB에서 가져온 flat 댓글 배열을 트리 구조로 변환
// Comment 타입의 replies 필드와 호환 (대댓글 1-depth)
export function buildCommentTree(rows: Comment[]): Comment[] {
  const map = new Map<string, Comment>();

  // 1. 모든 댓글을 replies 초기화해서 Map에 등록
  for (const row of rows) {
    map.set(row.id, { ...row, replies: [] });
  }

  const roots: Comment[] = [];

  // 2. 루트 댓글과 대댓글 분리
  for (const node of map.values()) {
    if (!node.parentId) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.replies!.push(node);
      } else {
        // 부모가 없는 대댓글은 루트로 처리
        roots.push(node);
      }
    }
  }

  return roots;
}
