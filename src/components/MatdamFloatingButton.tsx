"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 맛담 플랫폼 접속 플로팅 버튼
 * - 우하단 고정
 * - 맛담 경로 안에서는 숨김 (중복 방지)
 * - 스크롤 시에도 항상 보임
 */
export default function MatdamFloatingButton() {
  const pathname = usePathname();

  // 맛담 내부 페이지 · 로그인/회원가입 페이지에서는 숨김
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
      className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-[#D97706]/40 hover:shadow-[#D97706]/60 hover:scale-105 transition-all duration-300"
      aria-label="맛담 커뮤니티로 이동"
    >
      {/* 채팅 아이콘 */}
      <div className="relative w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
        <svg
          className="w-5 h-5"
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
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white">
          <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
        </span>
      </div>

      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
          Matdam
        </span>
        <span className="text-[15px] font-black font-sans-ko mt-1">
          맛담 바로가기
        </span>
      </div>

      {/* 화살표 */}
      <svg
        className="w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
