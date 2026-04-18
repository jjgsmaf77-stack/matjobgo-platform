import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: { user: true, _count: { select: { jobPostings: { where: { status: "OPEN" } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">참여 기업</h1>
        <p className="text-gray-600 mt-2">전북 지역 외식업체 정보를 확인하세요</p>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <div className="text-5xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">등록된 기업이 없습니다</h3>
          <p className="text-gray-500">곧 참여 기업이 등록될 예정입니다.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}
              className="bg-white rounded-2xl border p-6 hover:shadow-lg transition block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{company.companyName}</h3>
                  {company.industry && (
                    <span className="text-sm text-orange-600">{company.industry}</span>
                  )}
                </div>
              </div>
              {company.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{company.description}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                {company.address && (
                  <span className="text-gray-500">📍 {company.address}</span>
                )}
                {company._count.jobPostings > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    채용 {company._count.jobPostings}건
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
