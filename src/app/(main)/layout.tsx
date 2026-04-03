import GNB from "@/components/layout/GNB";
import TabBar from "@/components/layout/TabBar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: 실제 인증 연동 후 user 상태 주입
  const user = null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 데스크톱 GNB */}
      <GNB user={user} />

      {/* 콘텐츠 */}
      <main className="flex-1 pb-14 md:pb-0">{children}</main>

      {/* 데스크톱 푸터 */}
      <Footer />

      {/* 모바일 탭바 */}
      <TabBar />
    </div>
  );
}
