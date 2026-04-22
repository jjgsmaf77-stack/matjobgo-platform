import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export default async function PartnersPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const schools = [
    {
      name: "진경여자고등학교",
      location: "전주시",
      role: "주력 협력학교",
      years: "2025 ~",
      programs: ["On-D-Gourmet 1차", "조리대회 지도", "조리융합캠프 1·2차", "김장봉사 1차"],
      note: "조리 관련 특성화 학과 운영. 하이브리드 조리대회 주최교.",
    },
    {
      name: "덕암정보고등학교",
      location: "군산시",
      role: "주력 협력학교",
      years: "2025 ~",
      programs: ["On-D-Gourmet 1차", "조리대회 지도", "조리융합캠프 1·2차", "김장봉사 2차"],
      note: "정보·조리 계열 특성화고. 군산 지역 학생 인재풀.",
    },
    {
      name: "남원제일고등학교",
      location: "남원시",
      role: "협력학교",
      years: "2025 ~",
      programs: ["COOKING 브릿지 조리대회 지도", "조리융합캠프 1차"],
      note: "남원 향토음식 연계 가능. 2차년도 확대 예정.",
    },
  ];

  const institutions = [
    {
      name: "호원대학교",
      type: "주관 대학",
      role: "RISE사업 총괄 · 호텔조리학과 운영",
      color: "#991B1B",
    },
    {
      name: "전북특별자치도",
      type: "지원 기관",
      role: "RISE 사업 지원 · 지역혁신 총괄",
      color: "#DC2626",
    },
    {
      name: "전북교육청",
      type: "협력 기관",
      role: "직업계고 연계 · 교사 연수 지원",
      color: "#D4A574",
    },
    {
      name: "군산시 · 전주시 · 남원시",
      type: "지자체",
      role: "지역 행사 · 현장 실습 지원",
      color: "#B8923E",
    },
  ];

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
              Partners · 협력 네트워크
            </p>
          </div>
          <h1 className="font-sans-ko text-[40px] md:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight">
            함께 만드는<br />
            <span className="text-[#DC2626]">전북 조리 생태계</span>
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            RISE Track 4-3-2는 <span className="font-bold text-[#991B1B]">3개 직업계고</span> ·
            <span className="font-bold text-[#991B1B]"> 15+ 외식업체</span> ·
            <span className="font-bold text-[#991B1B]"> 4개 공공기관</span>과 함께
            협력 네트워크를 구축하고 있습니다.
          </p>
        </div>
      </section>

      {/* 협력 학교 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-3">
                Partner Schools
              </p>
              <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
                협력 직업계고
              </h2>
              <div className="w-16 h-1 bg-[#D4A574] mt-5" />
            </div>
            <div className="bg-[#991B1B] text-white px-5 py-2 rounded-full text-[13px] font-bold">
              {schools.length} 개교 · 2025년 현재
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {schools.map((s, idx) => (
              <div
                key={s.name}
                className="bg-white border border-[#DC2626]/15 rounded-3xl overflow-hidden hover:border-[#DC2626]/50 hover:shadow-xl hover:shadow-[#DC2626]/5 transition-all"
              >
                <div className="bg-[#991B1B] p-6 relative">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[#D4A574]" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#FCA5A5] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">
                        {s.role}
                      </p>
                      <h3 className="font-sans-ko text-[20px] font-black text-white leading-tight">
                        {s.name}
                      </h3>
                      <p className="text-white/70 text-[12px] mt-1.5">
                        {s.location} · {s.years}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                      <Icon name="school" size={22} strokeWidth={1.75} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] text-[#44403C] leading-[1.7] mb-5">{s.note}</p>
                  <div>
                    <p className="text-[11px] font-bold text-[#B8923E] tracking-wider uppercase mb-3">
                      참여 프로그램
                    </p>
                    <ul className="space-y-2">
                      {s.programs.map((p) => (
                        <li key={p} className="flex gap-2 text-[12.5px] text-[#2D1B0A] leading-relaxed">
                          <div className="w-1 h-1 rounded-full bg-[#DC2626] mt-2 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 협력 외식업체 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-3">
                Partner Companies
              </p>
              <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
                협력 외식업체
              </h2>
              <div className="w-16 h-1 bg-[#D4A574] mt-5" />
            </div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#991B1B] transition"
            >
              전체 기업 보기
              <Icon name="arrow-right" size={13} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {companies.slice(0, 15).map((c, idx) => (
              <Link
                key={c.id}
                href={`/companies/${c.id}`}
                className="bg-white border border-[#DC2626]/10 rounded-2xl p-5 hover:border-[#DC2626]/40 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                    <Icon name="building" size={16} strokeWidth={2} className="text-[#DC2626]" />
                  </div>
                  <span className="text-[9px] font-bold text-[#B8923E] tracking-wider">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4 className="font-sans-ko text-[13.5px] font-black text-[#991B1B] mb-1.5 leading-tight line-clamp-2 group-hover:text-[#DC2626] transition-colors">
                  {c.companyName}
                </h4>
                {c.industry && (
                  <p className="text-[11px] text-[#DC2626] font-semibold">{c.industry}</p>
                )}
                {c.address && (
                  <p className="text-[11px] text-[#44403C]/60 mt-2 line-clamp-1">
                    {c.address.replace("전북특별자치도 ", "")}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* 보조 설명 */}
          <div className="mt-10 bg-white border-l-4 border-[#D4A574] p-6 md:p-8 rounded-r-2xl">
            <p className="font-sans-ko text-[15px] md:text-[16px] font-bold text-[#991B1B] mb-2">
              MOU 체결 기준 및 혜택
            </p>
            <p className="text-[13.5px] text-[#44403C] leading-[1.8]">
              협력 업체는 사업자등록 인증 · 최소 5인 이상 고용 업체를 우선하며,
              MOU 체결 시 <span className="font-bold text-[#DC2626]">무료 채용공고 상시 등록</span>,
              <span className="font-bold text-[#DC2626]"> AI 매칭 추천</span>,
              호원대 교수진 자문, 산학 프로젝트 참여 기회를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 협력 기관 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
              Institutions
            </p>
            <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
              지원 · 협력 공공기관
            </h2>
            <div className="w-16 h-1 bg-[#D4A574] mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutions.map((i) => (
              <div
                key={i.name}
                className="bg-white border-2 rounded-3xl p-7 hover:shadow-lg transition-all"
                style={{ borderColor: `${i.color}30` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${i.color}15` }}
                >
                  <Icon
                    name="building"
                    size={20}
                    strokeWidth={1.75}
                    style={{ color: i.color }}
                  />
                </div>
                <p
                  className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
                  style={{ color: i.color }}
                >
                  {i.type}
                </p>
                <h4 className="font-sans-ko text-[16px] font-black text-[#991B1B] mb-3 leading-tight">
                  {i.name}
                </h4>
                <p className="text-[13px] text-[#44403C] leading-relaxed">{i.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 네트워크 요약 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="bg-[#991B1B] rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#DC2626]/30 rounded-full blur-3xl" />
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4A574]" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[#FCA5A5] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
                  Become a Partner
                </p>
                <h2 className="font-sans-ko text-[28px] md:text-[36px] font-black text-white leading-[1.15] mb-5">
                  우리와 함께<br />
                  전북 조리 생태계를 만들어요
                </h2>
                <p className="text-white/75 text-[14px] md:text-[15px] leading-[1.8] mb-6">
                  기업 · 기관 · 학교 모두 환영합니다. MOU 체결부터 현장 실습, 멘토 파견, 공동 프로젝트까지 다양한 방식으로 참여하실 수 있습니다.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-white text-[13px] font-semibold">
                  <Icon name="mail" size={14} strokeWidth={2} />
                  inki0110@howon.ac.kr · 063-450-7261
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: schools.length, label: "협력학교" },
                  { num: companies.length, label: "협력업체" },
                  { num: institutions.length, label: "지원기관" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl px-5 py-6 text-center"
                  >
                    <div className="font-sans-ko text-[40px] md:text-[48px] font-black text-[#991B1B] leading-none">
                      {s.num}
                    </div>
                    <div className="text-[11px] font-bold text-[#DC2626] mt-2 tracking-wider">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
