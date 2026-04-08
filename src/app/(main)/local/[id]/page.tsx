import Link from "next/link";
import { ArrowLeft, Share2, Star, MapPin, Phone, Clock } from "lucide-react";
import { ROUTES } from "@/constants";

export default async function LocalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  void id;

  const place = {
    name: "플레이보드", type: "카페", address: "서울 마포구 어울마당로 130",
    phone: "010-1234-5678", instagram: "@playboard_official",
    avgRating: 4.2, reviewCount: 23, gameCount: 500, isOpen: true,
    businessHours: [{ day: "월~금", open: "12:00", close: "24:00" }, { day: "토~일", open: "11:00", close: "02:00" }],
    entranceFee: "평일 3,000원/인 · 주말 4,000원/인",
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <Link href={ROUTES.LOCAL} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></Link>
        <button className="p-1"><Share2 className="w-5 h-5 text-gray-500" /></button>
      </div>

      <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <span className="text-6xl">🎲</span>
      </div>

      <div className="px-4 pt-5 pb-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
            <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{place.type}</span>
            <span className={`text-sm font-medium ${place.isOpen ? "text-emerald-600" : "text-gray-400"}`}>
              {place.isOpen ? "영업중" : "영업종료"}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-700">{place.avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">(리뷰 {place.reviewCount}개)</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 flex-shrink-0" />{place.address}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 flex flex-col gap-5">
          {/* 운영시간 */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Clock className="w-4 h-4" /><span className="text-sm font-medium">운영시간</span>
            </div>
            <div className="ml-6 flex flex-col gap-1">
              {place.businessHours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-gray-500">{h.day}</span>
                  <span className="font-medium text-gray-700">{h.open} - {h.close}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 요금 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">입장 요금</p>
            <p className="text-sm text-gray-500 ml-0">{place.entranceFee}</p>
          </div>

          {/* 연락처 */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Phone className="w-4 h-4" /><span className="text-sm font-medium">연락처</span>
            </div>
            <div className="ml-6 flex flex-col gap-1">
              <a href={`tel:${place.phone}`} className="text-sm text-primary-600">{place.phone}</a>
              <span className="text-sm text-gray-500">{place.instagram}</span>
            </div>
          </div>

          {/* 게임 수 */}
          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl">
            <span className="text-2xl">🎲</span>
            <div>
              <p className="font-semibold text-primary-700">{place.gameCount.toLocaleString()}+ 게임 보유</p>
              <p className="text-sm text-primary-500">다양한 장르의 보드게임을 즐겨보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
