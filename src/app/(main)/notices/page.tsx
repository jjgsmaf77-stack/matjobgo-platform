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
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </div>
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
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                    </svg>
                    고정
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
