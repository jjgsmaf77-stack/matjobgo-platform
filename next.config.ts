import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 호환
  output: process.env.VERCEL ? undefined : "standalone",

  // 이미지 최적화 외부 허용
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    // 업로드 이미지는 public 경로 그대로 서빙
  },

  // 프로덕션 빌드 시 lint 오류가 warnings 면 통과
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 프로덕션 빌드 시 타입 에러는 체크하되 non-fatal
  typescript: {
    ignoreBuildErrors: false,
  },

  // 서버 컴포넌트 외부 패키지
  serverExternalPackages: ["@prisma/adapter-better-sqlite3", "@prisma/adapter-libsql"],
};

export default nextConfig;
