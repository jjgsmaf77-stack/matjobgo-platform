import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveSqlitePath(): string {
  // 1순위: 명시적 경로 지정 (SQLITE_PATH)
  if (process.env.SQLITE_PATH) return process.env.SQLITE_PATH;

  // 2순위: Vercel serverless 환경에서 번들된 prisma/dev.db
  //        process.cwd() = 함수 루트 / (번들에 prisma/ 포함됨)
  if (process.env.VERCEL) {
    return path.join(process.cwd(), "prisma", "dev.db");
  }

  // 3순위: Netlify functions
  if (process.env.NETLIFY) {
    return path.join(process.cwd(), "prisma", "dev.db");
  }

  // 로컬 개발: 루트의 dev.db
  return "dev.db";
}

function createPrismaClient() {
  // 최우선: Turso LibSQL (환경변수 설정 시)
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tursoToken,
    });
    return new PrismaClient({ adapter });
  }

  // 기본: SQLite (로컬 또는 번들된 dev.db)
  const dbPath = resolveSqlitePath();
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
