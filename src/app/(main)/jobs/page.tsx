import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export default async function JobsPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { status: "OPEN" },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  // 분야별 집계
  const fieldCounts: Record<string, number> = {};
  jobs.forEach((j) => {
    fieldCounts[j.field] = (fieldCounts[j.field] || 0) + 1;
  });
  const topFields = Object.entries(fieldCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 최신 Featured 공고 (가장 최근, 상세 내용 포함)
  const featured = jobs[0];

  return (
    <div className="bg-[#FFFBF5]">
      {/* 헤더 */}
      <section className="relative bg-white border-b border-[#DC2626]/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-[#DC2626]" />
        <div className="absolute top-0 right-40 md:right-64 w-2 md:w-3 h-40 md:h-64 bg-[#D4A574]" />
        <div className="relative max-w-[1440px] mx-auto px-8 pt-20 md:pt-28 pb-16 md:pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4A574]" />
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.35em] uppercase">
              Jobs · 채용공고
            </p>
          </div>
          <h1 className="font-sans-ko text-[40px] md:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight max-w-3xl">
            전북 조리인재를<br />
            기다리는 <span className="text-[#DC2626]">{jobs.length}개</span> 공고
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            <span className="font-bold text-[#991B1B]">이성당 · 고궁수라간 · PNB풍년제과</span> 등
            전북 유명 외식업체의 실제 채용 공고. 희망 분야와 지역을 입력하고
            <span className="font-bold text-[#991B1B]"> AI 매칭 점수</span>로 나에게 맞는 공고를 찾아보세요.
          </p>

          {/* 분야별 필터 칩 */}
          {topFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="text-[11px] font-bold text-[#B8923E] tracking-wider uppercase self-center mr-2">
                인기 분야
              </span>
              {topFields.map(([field, count]) => (
                <span
                  key={field}
                  className="inline-flex items-center gap-1.5 bg-[#FEE2E2] text-[#991B1B] px-3 py-1.5 rounded-full text-[12px] font-bold"
                >
                  {field}
                  <span className="text-[#DC2626]">{count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured 공고 (딥 레드 블록 · Research 페이지 스타일) */}
      {featured && (
        <section className="bg-white pt-14 pb-10">
          <div className="max-w-[1440px] mx-auto px-8">
            <Link
              href={`/jobs/${featured.id}`}
              className="block bg-[#991B1B] rounded-3xl p-10 md:p-14 relative overflow-hidden hover:shadow-2xl hover:shadow-[#DC2626]/20 transition-all group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4A574]" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#DC2626]/25 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span className="bg-[#D4A574] text-[#2D1B0A] text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                    Featured · 최신 공고
                  </span>
                  <span className="text-[#FCA5A5] text-[11px] font-bold tracking-widest uppercase">
                    {featured.field} · {new Date(featured.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="grid md:grid-cols-[2fr_1fr] gap-10 items-center">
                  <div>
                    <h2 className="font-sans-ko text-[24px] md:text-[36px] font-black text-white leading-[1.2] tracking-tight mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-white/80 text-[14px] md:text-[15px] leading-[1.9] mb-5 line-clamp-2">
                      {featured.description}
                    </p>
                    <div className="flex items-center gap-5 text-[13px] text-white/70 flex-wrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="building" size={14} strokeWidth={2} />
                        {featured.company.companyName}
                      </span>
                      {featured.workLocation && (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="location" size={14} strokeWidth={2} />
                          {featured.workLocation}
                        </span>
                      )}
                      {featured.salary && (
                        <span className="inline-flex items-center gap-1.5 text-[#FCD34D] font-bold">
                          {featured.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#D4A574] text-[11px] font-bold tracking-wider uppercase mb-3">
                      Key Info
                    </p>
                    <ul className="space-y-2.5">
                      {featured.recruitCount && (
                        <li className="flex gap-2 text-[13px] text-white/85">
                          <div className="w-1 h-1 rounded-full bg-[#D4A574] mt-2 shrink-0" />
                          모집 {featured.recruitCount}명
                        </li>
                      )}
                      {featured.deadline && (
                        <li className="flex gap-2 text-[13px] text-white/85">
                          <div className="w-1 h-1 rounded-full bg-[#D4A574] mt-2 shrink-0" />
                          마감 {new Date(featured.deadline).toLocaleDateString("ko-KR")}
                        </li>
                      )}
                      {featured.workSchedule && (
                        <li className="flex gap-2 text-[13px] text-white/85">
                          <div className="w-1 h-1 rounded-full bg-[#D4A574] mt-2 shrink-0" />
                          {featured.workSchedule}
                        </li>
                      )}
                      <li className="flex gap-2 text-[13px] text-white/85">
                        <div className="w-1 h-1 rounded-full bg-[#D4A574] mt-2 shrink-0" />
                        즉시 지원 가능
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-white/60 text-[12px]">
                    클릭하여 상세 내용 및 지원하기
                  </span>
                  <span className="inline-flex items-center gap-2 text-white text-[13px] font-bold group-hover:gap-3 transition-all">
                    상세 보기
                    <Icon name="arrow-right" size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 공고 그리드 */}
      <section className="bg-[#FFFBF5] py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-2">
                All Jobs
              </p>
              <h2 className="font-sans-ko text-[26px] md:text-[32px] font-black text-[#991B1B]">
                전체 채용공고 <span className="text-[#DC2626]">{jobs.length}</span>
              </h2>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-[#DC2626]/10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FEE2E2] rounded-2xl mb-4">
                <Icon name="clipboard" size={28} strokeWidth={1.75} className="text-[#DC2626]" />
              </div>
              <h3 className="font-sans-ko text-[18px] font-black text-[#991B1B] mb-2">
                등록된 채용공고가 없습니다
              </h3>
              <p className="text-[#44403C]/60 text-[13px]">곧 새로운 채용공고가 등록될 예정입니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group bg-white rounded-3xl border border-[#DC2626]/10 p-6 md:p-7 hover:border-[#DC2626]/40 hover:shadow-lg hover:shadow-[#DC2626]/5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#D4A574] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-[#FEE2E2] text-[#991B1B] px-2.5 py-1 rounded-full text-[11px] font-bold">
                      {job.field}
                    </span>
                    {job.deadline && (
                      <span className="text-[11px] text-[#B8923E] font-semibold">
                        ~{new Date(job.deadline).toLocaleDateString("ko-KR")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-sans-ko text-[16px] md:text-[17px] font-black text-[#991B1B] mb-2 leading-tight line-clamp-2 group-hover:text-[#DC2626] transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-[13px] text-[#44403C]/80 mb-4 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="pt-4 border-t border-[#DC2626]/8 space-y-1.5 text-[12.5px]">
                    <div className="font-bold text-[#2D1B0A] inline-flex items-center gap-1.5">
                      <Icon name="building" size={12} strokeWidth={2} className="text-[#DC2626]" />
                      {job.company.companyName}
                    </div>
                    {job.workLocation && (
                      <div className="text-[#44403C]/60 inline-flex items-center gap-1.5">
                        <Icon name="location" size={12} strokeWidth={2} />
                        {job.workLocation}
                      </div>
                    )}
                    {job.salary && (
                      <div className="text-[#DC2626] font-bold">{job.salary}</div>
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
