import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      user: true,
      _count: { select: { jobPostings: { where: { status: "OPEN" } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const industryCounts: Record<string, number> = {};
  companies.forEach((c) => {
    if (c.industry) industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
  });
  const topIndustries = Object.entries(industryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const featured = companies.find((c) => c.isVerified);
  const verifiedCount = companies.filter((c) => c.isVerified).length;
  const totalJobs = companies.reduce((sum, c) => sum + c._count.jobPostings, 0);

  return (
    <div className="bg-[#FFFBF5]">
      {/* 헤더 */}
      <section className="relative bg-white border-b border-[#DC2626]/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-[#DC2626]" />
        <div className="absolute top-0 right-40 md:right-64 w-2 md:w-3 h-40 md:h-64 bg-[#D4A574]" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 pt-14 md:pt-28 pb-12 md:pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4A574]" />
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.35em] uppercase">
              Companies · 협력 외식업체
            </p>
          </div>
          <h1 className="font-sans-ko text-[30px] sm:text-[38px] md:text-[52px] lg:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight max-w-3xl">
            전북의 맛을 지키는<br />
            <span className="text-[#DC2626]">{companies.length}개</span> 명가
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            <span className="font-bold text-[#991B1B]">이성당(군산) · 고궁수라간(전주) · 삼백집</span> 등
            전북 유명 브랜드부터 신흥 파인다이닝까지.
            MOU 체결 업체와 함께 맞춤 채용·현장 실습·산학 협력을 진행합니다.
          </p>
          {topIndustries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="text-[11px] font-bold text-[#B8923E] tracking-wider uppercase self-center mr-2">
                업종 분포
              </span>
              {topIndustries.map(([industry, count]) => (
                <span
                  key={industry}
                  className="inline-flex items-center gap-1.5 bg-[#FEE2E2] text-[#991B1B] px-3 py-1.5 rounded-full text-[12px] font-bold"
                >
                  {industry}
                  <span className="text-[#DC2626]">{count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="bg-white pt-14 pb-10">
          <div className="max-w-[1440px] mx-auto px-8">
            <Link
              href={`/companies/${featured.id}`}
              className="block bg-[#991B1B] rounded-3xl p-10 md:p-14 relative overflow-hidden hover:shadow-2xl hover:shadow-[#DC2626]/20 transition-all group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4A574]" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#DC2626]/25 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span className="bg-[#D4A574] text-[#2D1B0A] text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                    Featured · MOU 인증
                  </span>
                  {featured.industry && (
                    <span className="text-[#FCA5A5] text-[11px] font-bold tracking-widest uppercase">
                      {featured.industry}
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <Icon name="building" size={48} strokeWidth={1.5} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-sans-ko text-[26px] md:text-[36px] font-black text-white leading-[1.15] tracking-tight mb-4">
                      {featured.companyName}
                    </h2>
                    {featured.description && (
                      <p className="text-white/80 text-[14px] md:text-[15px] leading-[1.9] mb-5 line-clamp-3">
                        {featured.description}
                      </p>
                    )}
                    <div className="grid sm:grid-cols-3 gap-4 pt-5 border-t border-white/15">
                      {featured.representative && (
                        <div>
                          <p className="text-[#FCA5A5] text-[10px] font-bold tracking-widest uppercase mb-1">대표자</p>
                          <p className="text-white font-semibold text-[13px]">{featured.representative}</p>
                        </div>
                      )}
                      {featured.employeeCount && (
                        <div>
                          <p className="text-[#FCA5A5] text-[10px] font-bold tracking-widest uppercase mb-1">직원 수</p>
                          <p className="text-white font-semibold text-[13px]">{featured.employeeCount}명</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[#FCA5A5] text-[10px] font-bold tracking-widest uppercase mb-1">채용 공고</p>
                        <p className="text-[#FCD34D] font-black text-[15px]">{featured._count.jobPostings}건 진행 중</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-white/60 text-[12px] inline-flex items-center gap-1.5">
                    {featured.address && (
                      <>
                        <Icon name="location" size={12} strokeWidth={2} />
                        {featured.address.replace("전북특별자치도 ", "")}
                      </>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2 text-white text-[13px] font-bold group-hover:gap-3 transition-all">
                    기업 상세 보기
                    <Icon name="arrow-right" size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 전체 기업 그리드 */}
      <section className="bg-[#FFFBF5] py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-2">
                All Companies
              </p>
              <h2 className="font-sans-ko text-[26px] md:text-[32px] font-black text-[#991B1B]">
                전체 참여 기업 <span className="text-[#DC2626]">{companies.length}</span>
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="inline-flex items-center gap-2 text-[#44403C]">
                <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
                인증 {verifiedCount}곳
              </span>
              <span className="inline-flex items-center gap-2 text-[#44403C]">
                <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
                공고 {totalJobs}건
              </span>
            </div>
          </div>

          {companies.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-[#DC2626]/10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FEE2E2] rounded-2xl mb-4">
                <Icon name="building" size={28} strokeWidth={1.75} className="text-[#DC2626]" />
              </div>
              <h3 className="font-sans-ko text-[18px] font-black text-[#991B1B] mb-2">
                등록된 기업이 없습니다
              </h3>
              <p className="text-[#44403C]/60 text-[13px]">곧 참여 기업이 등록될 예정입니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="group bg-white rounded-3xl border border-[#DC2626]/10 p-6 md:p-7 hover:border-[#DC2626]/40 hover:shadow-lg hover:shadow-[#DC2626]/5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#D4A574] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#FEE2E2] rounded-2xl flex items-center justify-center shrink-0">
                      <Icon name="building" size={26} strokeWidth={1.75} className="text-[#DC2626]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-sans-ko font-black text-[#991B1B] text-[15px] leading-tight line-clamp-1 group-hover:text-[#DC2626] transition-colors">
                        {company.companyName}
                      </h3>
                      {company.industry && (
                        <span className="inline-block mt-1 text-[11px] text-[#DC2626] font-bold bg-[#FEE2E2] px-2 py-0.5 rounded">
                          {company.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  {company.description && (
                    <p className="text-[13px] text-[#44403C]/80 mb-4 line-clamp-2 leading-relaxed">
                      {company.description}
                    </p>
                  )}
                  <div className="pt-4 border-t border-[#DC2626]/8 flex items-center justify-between text-[12px] gap-2">
                    {company.address ? (
                      <span className="text-[#44403C]/60 inline-flex items-center gap-1.5 truncate min-w-0">
                        <Icon name="location" size={12} strokeWidth={2} className="text-[#B8923E] shrink-0" />
                        <span className="truncate">{company.address.replace("전북특별자치도 ", "")}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    {company._count.jobPostings > 0 && (
                      <span className="bg-[#DC2626] text-white text-[11px] px-2.5 py-1 rounded-full font-bold shrink-0">
                        공고 {company._count.jobPostings}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
