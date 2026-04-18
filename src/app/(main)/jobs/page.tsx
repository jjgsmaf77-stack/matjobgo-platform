import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function JobsPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { status: "OPEN" },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">채용공고</h1>
        <p className="text-gray-600 mt-2">전북 지역 외식업체의 채용 정보를 확인하세요</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">등록된 채용공고가 없습니다</h3>
          <p className="text-gray-500">곧 새로운 채용공고가 등록될 예정입니다.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}
              className="bg-white rounded-2xl border p-6 hover:shadow-lg transition block">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {job.field}
                </span>
                {job.deadline && (
                  <span className="text-sm text-gray-400">
                    ~{new Date(job.deadline).toLocaleDateString("ko-KR")}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-700">{job.company.companyName}</span>
                {job.workLocation && (
                  <>
                    <span>·</span>
                    <span>{job.workLocation}</span>
                  </>
                )}
              </div>
              {job.salary && (
                <div className="mt-2 text-sm text-emerald-600 font-medium">{job.salary}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
