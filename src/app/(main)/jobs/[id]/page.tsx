import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ApplyButton from "./ApplyButton";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: { company: { include: { user: true } } },
  });

  if (!job) notFound();

  const existingApplication =
    session && (session.user as any)?.studentId
      ? await prisma.application.findUnique({
          where: {
            studentId_jobPostingId: {
              studentId: (session.user as any).studentId,
              jobPostingId: id,
            },
          },
        })
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              {job.field}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-3">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company.companyName}</p>
          </div>
          {job.status === "OPEN" && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              모집 중
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          {job.workLocation && (
            <div><span className="text-sm text-gray-500">근무지</span><p className="font-medium">{job.workLocation}</p></div>
          )}
          {job.salary && (
            <div><span className="text-sm text-gray-500">급여</span><p className="font-medium text-emerald-600">{job.salary}</p></div>
          )}
          {job.workSchedule && (
            <div><span className="text-sm text-gray-500">근무시간</span><p className="font-medium">{job.workSchedule}</p></div>
          )}
          {job.recruitCount && (
            <div><span className="text-sm text-gray-500">모집인원</span><p className="font-medium">{job.recruitCount}명</p></div>
          )}
          {job.deadline && (
            <div><span className="text-sm text-gray-500">마감일</span><p className="font-medium">{new Date(job.deadline).toLocaleDateString("ko-KR")}</p></div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">상세 내용</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">자격요건</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {job.benefits && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">복리후생</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.benefits}</p>
            </div>
          )}
        </div>

        {/* 기업 정보 */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-bold text-gray-900 mb-4">기업 정보</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-lg">{job.company.companyName}</h3>
            {job.company.industry && <p className="text-sm text-orange-600 mt-1">{job.company.industry}</p>}
            {job.company.description && <p className="text-gray-600 mt-2">{job.company.description}</p>}
            {job.company.address && <p className="text-sm text-gray-500 mt-2">📍 {job.company.address}</p>}
          </div>
        </div>

        {/* 지원 버튼 */}
        <div className="mt-8 pt-8 border-t">
          <ApplyButton
            jobId={job.id}
            isLoggedIn={!!session}
            isStudent={(session?.user as any)?.role === "STUDENT"}
            alreadyApplied={!!existingApplication}
            companyUserId={job.company.userId}
          />
        </div>
      </div>
    </div>
  );
}
