import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentsSearchPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") redirect("/login");

  const students = await prisma.student.findMany({
    where: { isPublic: true },
    include: { user: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">학생 탐색</h1>
        <p className="text-gray-600 mt-2">우리 기업에 맞는 인재를 찾아보세요</p>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M6 12.5V16c3.5 2 8.5 2 12 0v-3.5M2 10l10-5 10 5-10 5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">등록된 학생이 없습니다</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => {
            const fields = student.desiredField ? JSON.parse(student.desiredField) : [];
            return (
              <div key={student.id} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M6 12.5V16c3.5 2 8.5 2 12 0v-3.5M2 10l10-5 10 5-10 5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{student.user.name}</h3>
                    <p className="text-sm text-gray-500">{student.school}</p>
                  </div>
                </div>

                {fields.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {fields.map((f: string) => (
                      <span key={f} className="bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded text-xs">{f}</span>
                    ))}
                  </div>
                )}

                {student.introduction && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{student.introduction}</p>
                )}

                {student.skills && (
                  <p className="text-sm text-gray-500 mb-3">🏅 {student.skills}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <Link href={`/messages?to=${student.userId}`}
                    className="flex-1 text-center bg-[#DC2626] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#991B1B] transition">
                    메시지 보내기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
