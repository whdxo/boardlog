import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, Bell, ExternalLink } from "lucide-react";
import { ROUTES } from "@/constants";

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  void id;

  const product = {
    title: "카르디아",
    thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop",
    originalPrice: 24000, discountRate: 20, discountedPrice: 19200,
    game: { id: "g1", title: "카르디아", avgRating: 8.1, ratingCount: 245 },
    stores: [
      { storeName: "코보게",           storeUrl: "#", price: 19200 },
      { storeName: "다이브다이스",     storeUrl: "#", price: 20000 },
      { storeName: "핫트랙스",         storeUrl: "#", price: 21600 },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <Link href={ROUTES.SHOP} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></Link>
        <button className="p-1"><Share2 className="w-5 h-5 text-gray-500" /></button>
      </div>

      <div className="relative aspect-square bg-gray-100">
        <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
      </div>

      <div className="px-4 py-5">
        <h1 className="text-xl font-bold text-gray-900">{product.title}</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</p>
          <div className="flex items-baseline gap-2">
            <span className="text-red-500 font-bold text-lg">{product.discountRate}%</span>
            <span className="text-2xl font-bold text-primary-600">{product.discountedPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 연관 게임 */}
        <div className="mt-5 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">🎲</div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.game.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-xs font-medium text-gray-600">{product.game.avgRating}</span>
              <span className="text-xs text-gray-400">({product.game.ratingCount})</span>
            </div>
          </div>
        </div>

        {/* 판매처 비교 */}
        <div className="mt-5">
          <h2 className="font-semibold text-gray-900 mb-3">판매처 비교</h2>
          <div className="flex flex-col gap-2">
            {product.stores.map((store, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <span className="text-sm font-medium text-gray-700">{store.storeName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary-600">{store.price.toLocaleString()}원</span>
                  <a href={store.storeUrl} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 bg-primary-50 text-primary-600 rounded-lg">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-6 flex gap-3">
          <button className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <Heart className="w-4 h-4" />위시리스트
          </button>
          <button className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <Bell className="w-4 h-4" />가격 알림
          </button>
          <a href={product.stores[0].storeUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700">
            구매하러 가기 <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
