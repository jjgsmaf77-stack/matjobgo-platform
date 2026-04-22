import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      user: true,
      jobPostings: { where: { status: "OPEN" }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!company) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border p-8">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-[#FEE2E2] rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <rect x="4" y="2" width="16" height="20" rx="2" strokeLinejoin="round" />
              <line x1="9" y1="22" x2="9" y2="18" strokeLinecap="round" />
              <line x1="15" y1="22" x2="15" y2="18" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
            {company.industry && <span className="text-[#DC2626] font-medium">{company.industry}</span>}
            {company.isVerified && <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">인증됨</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-xl text-sm">
          {company.address && <div><span className="text-gray-500">소재지</span><p className="font-medium mt-0.5">{company.address}</p></div>}
          {company.representative && <div><span className="text-gray-500">대표자</span><p className="font-medium mt-0.5">{company.representative}</p></div>}
          {company.employeeCount && <div><span className="text-gray-500">직원 수</span><p className="font-medium mt-0.5">{company.employeeCount}명</p></div>}
          {company.website && <div><span className="text-gray-500">웹사이트</span><p className="font-medium mt-0.5">{company.website}</p></div>}
        </div>

        {company.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">기업 소개</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{company.description}</p>
          </div>
        )}

        {company.idealTalent && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">인재상</h2>
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5">
              <p className="text-gray-700 whitespace-pre-wrap">{company.idealTalent}</p>
            </div>
          </div>
        )}

        {/* 채용공고 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            채용공고 <span className="text-[#DC2626]">({company.jobPostings.length})</span>
          </h2>
          {company.jobPostings.length === 0 ? (
            <p className="text-gray-500 py-4">현재 진행 중인 채용공고가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {company.jobPostings.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}
                  className="block bg-gray-50 rounded-xl p-5 hover:bg-[#FEF2F2] transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded">{job.field}</span>
                        {job.workLocation && <span>{job.workLocation}</span>}
                        {job.salary && <span className="text-emerald-600">{job.salary}</span>}
                      </div>
                    </div>
                    <span className="text-[#DC2626] font-medium text-sm">상세보기 →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
