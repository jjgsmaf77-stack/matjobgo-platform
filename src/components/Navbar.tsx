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
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              맛
            </div>
            <span className="text-xl font-bold text-gray-900">
              맛<span className="text-orange-600">Job</span>GO
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-orange-600 font-medium transition"
            >
              채용공고
            </Link>
            <Link
              href="/companies"
              className="text-gray-600 hover:text-orange-600 font-medium transition"
            >
              기업정보
            </Link>
            <Link
              href="/programs"
              className="text-gray-600 hover:text-orange-600 font-medium transition"
            >
              교육프로그램
            </Link>
            <Link
              href="/matdam"
              className="text-gray-600 hover:text-orange-600 font-medium transition inline-flex items-center gap-1"
            >
              맛담
              <span className="bg-[#D97706] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                NEW
              </span>
            </Link>
            <Link
              href="/notices"
              className="text-gray-600 hover:text-orange-600 font-medium transition"
            >
              공지사항
            </Link>

            {session ? (
              <>
                {role === "STUDENT" && (
                  <Link
                    href="/student/dashboard"
                    className="text-gray-600 hover:text-orange-600 font-medium transition"
                  >
                    내 대시보드
                  </Link>
                )}
                {role === "COMPANY" && (
                  <Link
                    href="/company/dashboard"
                    className="text-gray-600 hover:text-orange-600 font-medium transition"
                  >
                    기업 대시보드
                  </Link>
                )}
                {role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-600 hover:text-orange-600 font-medium transition"
                  >
                    관리자
                  </Link>
                )}
                <Link
                  href="/messages"
                  className="text-gray-600 hover:text-orange-600 font-medium transition"
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
                  className="text-gray-600 hover:text-orange-600 px-4 py-2 text-sm font-medium transition"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
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
              <Link href="/register" className="block py-2 text-orange-600 font-medium" onClick={() => setMobileOpen(false)}>회원가입</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
