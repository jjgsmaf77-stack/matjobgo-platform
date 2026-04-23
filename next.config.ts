import type { NextConfig } from "next";

// Next.js 16.2.3 기준 (eslint 옵션 제거됨)
const nextConfig: NextConfig = {
  // Vercel 배포 호환 (Vercel은 자체 output, 로컬은 standalone)
  output: process.env.VERCEL ? undefined : "standalone",

  // 이미지 외부 도메인 허용
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  // 서버 컴포넌트 외부 패키지 (번들 제외)
  serverExternalPackages: [
    "@prisma/adapter-better-sqlite3",
    "@prisma/adapter-libsql",
    "better-sqlite3",
  ],

  // 서버리스 번들에 dev.db · Prisma 클라이언트 포함
  // 키는 route path (picomatch) - "/*" 는 모든 라우트
  outputFileTracingIncludes: {
    "/*": [
      "./prisma/dev.db",
      "./prisma/schema.prisma",
      "./src/generated/prisma/**/*",
    ],
  },
};

export default nextConfig;
