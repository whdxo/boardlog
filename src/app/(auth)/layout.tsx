import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-14 flex items-center px-6 bg-white border-b border-gray-200">
        <Link href="/" className="text-xl font-bold text-primary-500">
          BoardLog
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="py-4 text-center text-caption text-gray-400 border-t border-gray-100">
        © 2024 BoardLog. All rights reserved.
      </footer>
    </div>
  );
}
