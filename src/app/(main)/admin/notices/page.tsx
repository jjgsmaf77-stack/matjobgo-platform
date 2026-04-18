import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NoticesManager from "./NoticesManager";

export default async function AdminNoticesPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/login");

  const notices = await prisma.notice.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
      <p className="text-gray-600 mb-8">
        플랫폼 사용자에게 전달할 공지사항을 작성하고 관리합니다
      </p>
      <NoticesManager
        initialNotices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          isPinned: n.isPinned,
          createdAt: n.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
