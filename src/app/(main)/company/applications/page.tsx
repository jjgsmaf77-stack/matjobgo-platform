import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApplicationRow from "./ApplicationRow";

export default async function CompanyApplicationsPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") redirect("/login");

  const companyId = (session.user as any).companyId;
  const applications = await prisma.application.findMany({
    where: { jobPosting: { companyId } },
    include: {
      student: { include: { user: true } },
      jobPosting: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">지원자 관리</h1>
        <p className="text-gray-600 mt-2">
          우리 기업 채용공고에 지원한 학생들을 관리합니다
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <div className="text-5xl mb-4">📨</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            아직 지원자가 없습니다
          </h3>
          <p className="text-gray-500">
            채용공고를 적극 홍보하거나 학생을 직접 탐색해보세요
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">학생명</th>
                  <th className="text-left py-3 px-4 font-medium">학교/학년</th>
                  <th className="text-left py-3 px-4 font-medium">지원공고</th>
                  <th className="text-left py-3 px-4 font-medium">지원일</th>
                  <th className="text-left py-3 px-4 font-medium">상태</th>
                  <th className="text-left py-3 px-4 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    id={app.id}
                    studentName={app.student.user.name}
                    studentUserId={app.student.userId}
                    school={app.student.school}
                    grade={app.student.grade || ""}
                    jobTitle={app.jobPosting.title}
                    appliedAt={app.appliedAt.toISOString()}
                    status={app.status}
                    coverLetter={app.coverLetter || ""}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
