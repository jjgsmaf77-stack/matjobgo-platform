import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 영문 본문용 · Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 한글 고딕 · 단정한 모던 산세리프 (브랜드 · 헤드라인 · 본문)
const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans-ko",
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "맛JobGO - 전북의 맛을 품은 로컬조리인재 양성 플랫폼",
  description:
    "호원대학교 RISE사업 | 대학-직업계고-지역기업 간 협력 플랫폼으로 전북 로컬조리인재를 양성합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFBF5]">{children}</body>
    </html>
  );
}
