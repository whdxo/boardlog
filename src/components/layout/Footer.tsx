import Link from "next/link";
import { ROUTES } from "@/constants";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-[1080px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* 브랜드 */}
          <div className="md:flex-1">
            <p className="text-lg font-bold text-gray-900 mb-2">BoardLog</p>
            <p className="text-caption text-gray-500">
              보드게임을 사랑하는 사람들의 플랫폼
            </p>
          </div>

          {/* 링크 */}
          <div className="flex gap-16">
            <div>
              <p className="text-caption font-semibold text-gray-400 uppercase mb-3">
                서비스
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={ROUTES.GAMES}
                    className="text-body text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    게임 탐색
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.MY}
                    className="text-body text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    내 기록
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-caption font-semibold text-gray-400 uppercase mb-3">
                지원
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={ROUTES.TERMS}
                    className="text-body text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.PRIVACY}
                    className="text-body text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.GUIDELINES}
                    className="text-body text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    서비스 가이드라인
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-caption text-gray-400">
            © 2024 BoardLog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
