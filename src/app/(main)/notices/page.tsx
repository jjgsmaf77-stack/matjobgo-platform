import { prisma } from "@/lib/prisma";

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
        <p className="text-gray-600 mt-2">
          맛JobGO 플랫폼의 소식과 공지사항을 확인하세요
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            등록된 공지사항이 없습니다
          </h3>
        </div>
      ) : (
        <ul className="space-y-4">
          {notices.map((n) => (
            <li
              key={n.id}
              className="bg-white rounded-2xl border p-6 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2">
                {n.isPinned && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                    📌 고정
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                {n.title}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {n.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
