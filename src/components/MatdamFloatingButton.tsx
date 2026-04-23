"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 맛담 플랫폼 접속 플로팅 버튼
 * - 우하단 고정
 * - 맛담 · 로그인 · 회원가입 경로에서 자동 숨김
 * - 모바일: 원형 아이콘 버튼 (14x14)
 * - 데스크톱: 텍스트 포함 pill (sm 브레이크포인트부터)
 */
export default function MatdamFloatingButton() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/matdam") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register")
  ) {
    return null;
  }

  return (
    <Link
      href="/matdam"
      aria-label="맛담 커뮤니티로 이동"
      className="group fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white shadow-2xl shadow-[#D97706]/40 hover:shadow-[#D97706]/60 hover:scale-105 transition-all duration-300
        w-14 h-14 sm:w-auto sm:h-auto
        rounded-full sm:pl-4 sm:pr-5 sm:py-3
        flex items-center justify-center sm:gap-2.5"
    >
      {/* 아이콘 영역 - 모바일에서는 그냥 아이콘 */}
      <div className="relative sm:w-9 sm:h-9 sm:rounded-full sm:bg-white/20 flex items-center justify-center">
        <svg
          className="w-6 h-6 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {/* pulse dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white">
          <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
        </span>
      </div>

      {/* 텍스트 라벨 - sm 이상에서만 */}
      <div className="hidden sm:flex flex-col items-start leading-none">
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
          Matdam
        </span>
        <span className="text-[15px] font-black font-sans-ko mt-1">
          맛담 바로가기
        </span>
      </div>

      {/* 화살표 - sm 이상에서만 */}
      <svg
        className="hidden sm:block w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>

      {/* 모바일 전용 툴팁 (탭 전 가시성) */}
      <span className="sm:hidden absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#2D1B0A] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-focus:opacity-100 pointer-events-none transition-opacity">
        맛담
      </span>
    </Link>
  );
}
