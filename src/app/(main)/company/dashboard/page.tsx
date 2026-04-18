import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CompanyDashboard() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") redirect("/login");

  const companyId = (session.user as any).companyId;
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { user: true },
  });
  if (!company) redirect("/login");

  const jobPostings = await prisma.jobPosting.findMany({
    where: { companyId },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  const recentApplications = await prisma.application.findMany({
    where: { jobPosting: { companyId } },
    include: { student: { include: { user: true } }, jobPosting: true },
    orderBy: { appliedAt: "desc" },
    take: 10,
  });

  const matchResults = await prisma.matchResult.findMany({
    where: { companyId },
    include: { student: { include: { user: true } }, jobPosting: true },
    orderBy: { matchScore: "desc" },
    take: 5,
  });

  const unreadMessages = await prisma.message.count({
    where: { receiverId: company.userId, isRead: false },
  });

  const totalApplications = recentApplications.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
          <p className="text-gray-600 mt-1">기업 대시보드</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/company/applications"
            className="bg-white text-gray-700 px-5 py-2.5 rounded-xl font-medium border hover:bg-gray-50 transition">
            지원자 관리
          </Link>
          <Link href="/company/profile"
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
            기업정보 수정
          </Link>
          <Link href="/company/jobs/new"
            className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-700 transition">
            + 채용공고 등록
          </Link>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-2xl font-bold text-orange-600">{jobPostings.length}</div>
          <div className="text-sm text-gray-500 mt-1">등록 공고</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
          <div className="text-sm text-gray-500 mt-1">받은 지원</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-2xl font-bold text-green-600">{matchResults.length}</div>
          <div className="text-sm text-gray-500 mt-1">추천 인재</div>
        </div>
        <Link href="/messages" className="bg-white rounded-xl border p-5 hover:shadow transition">
          <div className="text-2xl font-bold text-purple-600">{unreadMessages}</div>
          <div className="text-sm text-gray-500 mt-1">안 읽은 메시지</div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 채용공고 관리 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">채용공고 관리</h2>
            <Link href="/company/jobs/new" className="text-orange-600 text-sm font-medium hover:underline">
              + 새 공고
            </Link>
          </div>
          {jobPostings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>등록된 채용공고가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobPostings.map((job) => (
                <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/jobs/${job.id}`} className="font-medium text-gray-900 hover:text-orange-600">
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">{job.field}</span>
                        <span>지원 {job._count.applications}건</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      job.status === "OPEN" ? "bg-green-100 text-green-700" :
                      job.status === "CLOSED" ? "bg-gray-100 text-gray-500" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {job.status === "OPEN" ? "모집 중" : job.status === "CLOSED" ? "마감" : "임시저장"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 추천 인재 */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">추천 인재</h2>
          {matchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>채용공고를 등록하면 맞춤 인재를 추천해드립니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchResults.map((match) => (
                <div key={match.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{match.student.user.name}</h4>
                      <p className="text-sm text-gray-500">{match.student.school}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">{Math.round(match.matchScore)}%</div>
                      <div className="text-xs text-gray-400">매칭률</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/company/students"
            className="block text-center mt-4 text-orange-600 font-medium text-sm hover:underline">
            전체 학생 탐색 →
          </Link>
        </div>
      </div>

      {/* 최근 지원 현황 */}
      {recentApplications.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">최근 지원 현황</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-3 font-medium">학생명</th>
                  <th className="text-left py-3 font-medium">학교</th>
                  <th className="text-left py-3 font-medium">지원 공고</th>
                  <th className="text-left py-3 font-medium">지원일</th>
                  <th className="text-left py-3 font-medium">상태</th>
                  <th className="text-left py-3 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{app.student.user.name}</td>
                    <td className="py-3 text-gray-500">{app.student.school}</td>
                    <td className="py-3 text-gray-500">{app.jobPosting.title}</td>
                    <td className="py-3 text-gray-500">{new Date(app.appliedAt).toLocaleDateString("ko-KR")}</td>
                    <td className="py-3">
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
                    </td>
                    <td className="py-3">
                      <Link href={`/messages?to=${app.student.userId}`}
                        className="text-blue-600 hover:underline text-xs">메시지</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
