import { Bell, Tag, Clock, Info } from "lucide-react";
import MobileHeader from "@/components/layout/MobileHeader";
import type { Notification } from "@/types";

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", userId: "u1", type: "price_change", title: "가격 변동 알림", body: "관심 게임 '카탄'이 10% 할인 중이에요!", isRead: false, createdAt: "2024-03-16T10:00:00Z" },
  { id: "2", userId: "u1", type: "log_saved", title: "기록 저장 완료", body: "팬데믹 플레이 기록이 저장되었어요.", isRead: true, createdAt: "2024-03-15T18:30:00Z" },
  { id: "3", userId: "u1", type: "system", title: "서비스 업데이트", body: "보드게임 검색 기능이 개선되었어요. 더 빠르게 찾아보세요!", isRead: true, createdAt: "2024-03-10T09:00:00Z" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  price_change: <Tag size={16} className="text-success" />,
  log_saved: <Bell size={16} className="text-primary-500" />,
  play_reminder: <Clock size={16} className="text-accent-400" />,
  system: <Info size={16} className="text-gray-400" />,
};

export default function NotificationsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="알림" />
      <div className="px-4 md:px-6 py-6">
        <h1 className="text-h1 font-bold text-gray-900 mb-6 hidden md:block">알림</h1>

        {MOCK_NOTIFICATIONS.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-body text-gray-500">새로운 알림이 없어요</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 py-4 border-b border-gray-100 ${!n.isRead ? "bg-primary-50 -mx-4 px-4 md:-mx-6 md:px-6" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  {TYPE_ICON[n.type] ?? <Bell size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-semibold text-gray-900">{n.title}</p>
                  <p className="text-caption text-gray-600 mt-0.5">{n.body}</p>
                  <p className="text-tiny text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
