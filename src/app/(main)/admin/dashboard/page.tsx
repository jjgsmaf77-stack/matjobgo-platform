import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/login");

  const [
    studentCount,
    companyCount,
    jobCount,
    applicationCount,
    matchCount,
    messageCount,
    recentStudents,
    recentCompanies,
    recentApplications,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.company.count(),
    prisma.jobPosting.count({ where: { status: "OPEN" } }),
    prisma.application.count(),
    prisma.matchResult.count(),
    prisma.message.count(),
    prisma.student.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.company.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.application.findMany({
      include: {
        student: { include: { user: true } },
        jobPosting: { include: { company: true } },
      },
      orderBy: { appliedAt: "desc" },
      take: 10,
    }),
  ]);

  const acceptedCount = await prisma.application.count({ where: { status: "ACCEPTED" } });
  const matchRate = applicationCount > 0 ? Math.round((acceptedCount / applicationCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">맛JobGO 플랫폼 현황 (호원대학교 RISE사업단)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/gallery"
            className="bg-white text-gray-700 px-4 py-2 rounded-xl font-medium border hover:bg-gray-50 transition text-sm">
            갤러리 관리
          </Link>
          <Link href="/admin/programs"
            className="bg-white text-gray-700 px-4 py-2 rounded-xl font-medium border hover:bg-gray-50 transition text-sm">
            프로그램 관리
          </Link>
          <Link href="/admin/notices"
            className="bg-white text-gray-700 px-4 py-2 rounded-xl font-medium border hover:bg-gray-50 transition text-sm">
            공지사항 관리
          </Link>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "등록 학생", value: studentCount, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "등록 기업", value: companyCount, color: "text-[#DC2626]", bg: "bg-[#FEF2F2]" },
          { label: "채용공고", value: jobCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "총 지원", value: applicationCount, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "매칭 건수", value: matchCount, color: "text-red-600", bg: "bg-red-50" },
          { label: "취업률", value: `${matchRate}%`, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-5`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 최근 등록 학생 */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">최근 등록 학생</h2>
          <div className="space-y-3">
            {recentStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <span className="font-medium">{s.user.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{s.school}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            ))}
            {recentStudents.length === 0 && <p className="text-gray-400 text-sm">등록된 학생이 없습니다</p>}
          </div>
        </div>

        {/* 최근 등록 기업 */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-900 mb-4">최근 등록 기업</h2>
          <div className="space-y-3">
            {recentCompanies.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <span className="font-medium">{c.companyName}</span>
                  {c.industry && <span className="text-sm text-[#DC2626] ml-2">{c.industry}</span>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  c.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {c.isVerified ? "인증" : "미인증"}
                </span>
              </div>
            ))}
            {recentCompanies.length === 0 && <p className="text-gray-400 text-sm">등록된 기업이 없습니다</p>}
          </div>
        </div>
      </div>

      {/* 최근 지원 현황 */}
      <div className="mt-8 bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-gray-900 mb-4">최근 지원 현황</h2>
        {recentApplications.length === 0 ? (
          <p className="text-gray-400 text-sm">지원 내역이 없습니다</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-3 font-medium">학생</th>
                  <th className="text-left py-3 font-medium">학교</th>
                  <th className="text-left py-3 font-medium">지원 기업</th>
                  <th className="text-left py-3 font-medium">공고</th>
                  <th className="text-left py-3 font-medium">상태</th>
                  <th className="text-left py-3 font-medium">일자</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{app.student.user.name}</td>
                    <td className="py-3 text-gray-500">{app.student.school}</td>
                    <td className="py-3 text-gray-500">{app.jobPosting.company.companyName}</td>
                    <td className="py-3 text-gray-500">{app.jobPosting.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        app.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                        app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {app.status === "PENDING" ? "검토 중" :
                         app.status === "ACCEPTED" ? "합격" :
                         app.status === "REJECTED" ? "불합격" : "검토 완료"}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{new Date(app.appliedAt).toLocaleDateString("ko-KR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 플랫폼 활동 지표 */}
      <div className="mt-8 bg-[#DC2626] rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">맛JobGO 플랫폼 성과 요약</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold">{studentCount + companyCount}</div>
            <div className="text-white/80 mt-1">총 회원 수</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{applicationCount}</div>
            <div className="text-white/80 mt-1">총 지원 건수</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{messageCount}</div>
            <div className="text-white/80 mt-1">교환된 메시지</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{matchRate}%</div>
            <div className="text-white/80 mt-1">취업 연계율</div>
          </div>
        </div>
      </div>
    </div>
  );
}
