import Link from "next/link";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
        <Link href="/" className="text-xl font-bold text-primary-500">
          BoardLog
        </Link>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {children}
      </main>
    </div>
  );
}
