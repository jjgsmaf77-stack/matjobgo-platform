"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (session?.user as any)?.role;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#DC2626] rounded-xl flex items-center justify-center text-white font-black text-lg font-sans-ko">
              맛
            </div>
            <span className="text-xl font-black text-[#991B1B] flex items-baseline gap-0.5 font-sans-ko tracking-tight">
              <span>맛</span>
              <span className="text-[#DC2626] font-sans-ko">Job</span>
              <span>GO</span>
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-5">
            {/* 사업단 드롭다운 */}
            <div className="relative group">
              <button className="text-gray-600 hover:text-[#DC2626] font-medium transition inline-flex items-center gap-1">
                사업단
                <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="bg-white border border-[#DC2626]/15 rounded-2xl shadow-xl shadow-[#DC2626]/10 p-2 min-w-[220px]">
                  <Link href="/about-project" className="block px-4 py-2.5 rounded-xl hover:bg-[#FEF2F2] transition">
                    <div className="text-[13px] font-bold text-[#991B1B]">사업단 소개</div>
                    <div className="text-[11px] text-[#44403C]/60 mt-0.5">비전 · 조직 · 연혁</div>
                  </Link>
                  <Link href="/performance" className="block px-4 py-2.5 rounded-xl hover:bg-[#FEF2F2] transition">
                    <div className="text-[13px] font-bold text-[#991B1B]">사업 성과</div>
                    <div className="text-[11px] text-[#44403C]/60 mt-0.5">지표 · 하이라이트 · 로드맵</div>
                  </Link>
                  <Link href="/partners" className="block px-4 py-2.5 rounded-xl hover:bg-[#FEF2F2] transition">
                    <div className="text-[13px] font-bold text-[#991B1B]">협력 네트워크</div>
                    <div className="text-[11px] text-[#44403C]/60 mt-0.5">학교 · 기업 · 기관</div>
                  </Link>
                  <Link href="/research" className="block px-4 py-2.5 rounded-xl hover:bg-[#FEF2F2] transition">
                    <div className="text-[13px] font-bold text-[#991B1B]">정책연구</div>
                    <div className="text-[11px] text-[#44403C]/60 mt-0.5">연구보고서 · 실태조사</div>
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-[#DC2626] font-medium transition"
            >
              채용공고
            </Link>
            <Link
              href="/companies"
              className="text-gray-600 hover:text-[#DC2626] font-medium transition"
            >
              기업정보
            </Link>
            <Link
              href="/programs"
              className="text-gray-600 hover:text-[#DC2626] font-medium transition"
            >
              교육프로그램
            </Link>
            <Link
              href="/matdam"
              className="text-gray-600 hover:text-[#DC2626] font-medium transition inline-flex items-center gap-1"
            >
              맛담
              <span className="bg-[#D97706] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                NEW
              </span>
            </Link>
            <Link
              href="/notices"
              className="text-gray-600 hover:text-[#DC2626] font-medium transition"
            >
              공지사항
            </Link>

            {session ? (
              <>
                {role === "STUDENT" && (
                  <Link
                    href="/student/dashboard"
                    className="text-gray-600 hover:text-[#DC2626] font-medium transition"
                  >
                    내 대시보드
                  </Link>
                )}
                {role === "COMPANY" && (
                  <Link
                    href="/company/dashboard"
                    className="text-gray-600 hover:text-[#DC2626] font-medium transition"
                  >
                    기업 대시보드
                  </Link>
                )}
                {role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-600 hover:text-[#DC2626] font-medium transition"
                  >
                    관리자
                  </Link>
                )}
                <Link
                  href="/messages"
                  className="text-gray-600 hover:text-[#DC2626] font-medium transition"
                >
                  메시지
                </Link>
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-gray-500">
                    {session.user?.name}님
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-[#DC2626] px-4 py-2 text-sm font-medium transition"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-[#DC2626] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#991B1B] transition"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-2">
          <p className="pt-2 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8923E]">사업단</p>
          <Link href="/about-project" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>사업단 소개</Link>
          <Link href="/performance" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>사업 성과</Link>
          <Link href="/partners" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>협력 네트워크</Link>
          <Link href="/research" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>정책연구</Link>
          <p className="pt-3 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8923E]">플랫폼</p>
          <Link href="/jobs" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>채용공고</Link>
          <Link href="/companies" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>기업정보</Link>
          <Link href="/programs" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>교육프로그램</Link>
          <Link href="/matdam" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>맛담 <span className="bg-[#D97706] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ml-1">NEW</span></Link>
          <Link href="/notices" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>공지사항</Link>
          {session ? (
            <>
              {role === "STUDENT" && <Link href="/student/dashboard" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>내 대시보드</Link>}
              {role === "COMPANY" && <Link href="/company/dashboard" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>기업 대시보드</Link>}
              {role === "ADMIN" && <Link href="/admin/dashboard" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>관리자</Link>}
              <Link href="/messages" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>메시지</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-2 text-red-500">로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>로그인</Link>
              <Link href="/register" className="block py-2 text-[#DC2626] font-medium" onClick={() => setMobileOpen(false)}>회원가입</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
