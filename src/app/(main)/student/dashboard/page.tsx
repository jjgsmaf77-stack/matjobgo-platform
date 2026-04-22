import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "STUDENT") redirect("/login");

  const studentId = (session.user as any).studentId;
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });
  if (!student) redirect("/login");

  const applications = await prisma.application.findMany({
    where: { studentId },
    include: { jobPosting: { include: { company: true } } },
    orderBy: { appliedAt: "desc" },
  });

  const matchResults = await prisma.matchResult.findMany({
    where: { studentId },
    include: { company: true, jobPosting: true },
    orderBy: { matchScore: "desc" },
    take: 5,
  });

  const unreadMessages = await prisma.message.count({
    where: { receiverId: student.userId, isRead: false },
  });

  const desiredFields = student.desiredField ? JSON.parse(student.desiredField) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">안녕하세요, {student.user.name}님!</h1>
          <p className="text-gray-600 mt-1">{student.school}</p>
        </div>
        <Link href="/student/profile"
          className="bg-[#DC2626] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#991B1B] transition">
          프로필 수정
        </Link>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-2xl font-bold text-[#DC2626]">{applications.length}</div>
          <div className="text-sm text-gray-500 mt-1">지원 현황</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(a => a.status === "ACCEPTED").length}
          </div>
          <div className="text-sm text-gray-500 mt-1">합격</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-2xl font-bold text-blue-600">{matchResults.length}</div>
          <div className="text-sm text-gray-500 mt-1">추천 매칭</div>
        </div>
        <Link href="/messages" className="bg-white rounded-xl border p-5 hover:shadow transition">
          <div className="text-2xl font-bold text-purple-600">{unreadMessages}</div>
          <div className="text-sm text-gray-500 mt-1">안 읽은 메시지</div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 프로필 요약 */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">내 프로필</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">학교</span><p className="font-medium">{student.school}</p></div>
            {student.grade && <div><span className="text-gray-500">학년</span><p className="font-medium">{student.grade}학년</p></div>}
            <div>
              <span className="text-gray-500">희망분야</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {desiredFields.length > 0 ? desiredFields.map((f: string) => (
                  <span key={f} className="bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded text-xs">{f}</span>
                )) : <span className="text-gray-400">미설정</span>}
              </div>
            </div>
            <div>
              <span className="text-gray-500">자기소개서</span>
              <p className={student.introduction ? "font-medium" : "text-gray-400"}>
                {student.introduction ? "작성 완료" : "미작성"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">이력서</span>
              <p className={student.resumeFile ? "font-medium" : "text-gray-400"}>
                {student.resumeFile ? "업로드 완료" : "미업로드"}
              </p>
            </div>
          </div>
          <Link href="/student/profile"
            className="block text-center mt-4 text-[#DC2626] font-medium text-sm hover:underline">
            프로필 편집하기 →
          </Link>
        </div>

        {/* 추천 매칭 */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">추천 매칭 기업</h2>
          {matchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>프로필을 완성하면 맞춤 기업을 추천해드립니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchResults.map((match) => (
                <Link key={match.id} href={`/companies/${match.companyId}`}
                  className="block bg-gray-50 rounded-xl p-4 hover:bg-[#FEF2F2] transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{match.company.companyName}</h4>
                      {match.jobPosting && (
                        <p className="text-sm text-gray-500 mt-0.5">{match.jobPosting.title}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#DC2626]">{Math.round(match.matchScore)}%</div>
                      <div className="text-xs text-gray-400">매칭률</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 지원 현황 */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">지원 현황</h2>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>아직 지원 내역이 없습니다</p>
              <Link href="/jobs" className="text-[#DC2626] font-medium text-sm mt-2 inline-block hover:underline">
                채용공고 보러가기 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{app.jobPosting.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{app.jobPosting.company.companyName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      app.status === "REVIEWED" ? "bg-blue-100 text-blue-700" :
                      app.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {app.status === "PENDING" ? "검토 중" :
                       app.status === "REVIEWED" ? "검토 완료" :
                       app.status === "ACCEPTED" ? "합격" : "불합격"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
