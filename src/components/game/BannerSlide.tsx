"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface BannerSlideProps {
  items: BannerItem[];
  autoPlayInterval?: number;
}

export default function BannerSlide({
  items,
  autoPlayInterval = 5000,
}: BannerSlideProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval, items.length]);

  if (!items.length) return null;

  const item = items[current];

  return (
    <div className="relative w-full rounded-xl overflow-hidden aspect-[16/9] md:aspect-[3/1] bg-gray-200">
      {/* 이미지 */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        className="object-cover"
        priority
      />

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* 텍스트 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
        <p className="text-h1 md:text-display font-bold leading-tight drop-shadow">
          {item.title}
        </p>
        {item.subtitle && (
          <p className="text-caption md:text-body mt-1 text-white/80">
            {item.subtitle}
          </p>
        )}
        {item.ctaLabel && item.ctaHref && (
          <Link
            href={item.ctaHref}
            className="inline-block mt-3 px-4 py-1.5 bg-white text-gray-900 text-caption font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {item.ctaLabel}
          </Link>
        )}
      </div>

      {/* 도트 인디케이터 */}
      {items.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === current ? "bg-white w-4" : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
