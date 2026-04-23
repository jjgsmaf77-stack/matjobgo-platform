import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://matjobgo.co.kr"),
  title: {
    default: "맛JobGO · 전북 로컬조리인재 양성 플랫폼",
    template: "%s | 맛JobGO",
  },
  description:
    "호원대학교 RISE사업 Track 4-3-2 | 대학·직업계고·전북 외식업체를 잇는 AI 스마트 인재 매칭 플랫폼. 이성당·고궁·PNB풍년 등 20개 명가와 함께합니다.",
  keywords: [
    "맛JobGO",
    "호원대학교",
    "RISE사업",
    "전북",
    "조리인재",
    "직업계고",
    "외식업체",
    "채용",
    "맛담",
  ],
  openGraph: {
    title: "맛JobGO · 전북 로컬조리인재 양성 플랫폼",
    description: "전북의 맛을 품은 로컬 조리 인재를 연결합니다",
    url: "https://matjobgo.co.kr",
    siteName: "맛JobGO",
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#991B1B",
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
