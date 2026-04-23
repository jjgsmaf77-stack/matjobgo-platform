import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function AboutProjectPage() {
  return (
    <div className="bg-[#FFFBF5]">
      {/* 헤더 */}
      <section className="relative bg-white overflow-hidden border-b border-[#DC2626]/10">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-[#DC2626]" />
        <div className="absolute top-0 right-40 md:right-64 w-2 md:w-3 h-40 md:h-64 bg-[#D4A574]" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 pt-14 md:pt-28 pb-12 md:pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4A574]" />
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.35em] uppercase">
              About the Project
            </p>
          </div>
          <h1 className="font-sans-ko text-[30px] sm:text-[38px] md:text-[52px] lg:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight max-w-3xl">
            전북의 맛<span className="text-[#D4A574]">(味)</span>을<br />
            <span className="text-[#DC2626]">'품'</span>은 로컬조리인재 양성
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-8 max-w-2xl">
            호원대학교 RISE사업 <span className="font-bold text-[#991B1B]">Track 4-3-2</span>는
            전북특별자치도의 <span className="bg-[#FEE2E2] px-1.5">외식산업 경쟁력 강화</span>와
            <span className="bg-[#FEE2E2] px-1.5">직업계고 학생의 지역 정주율 제고</span>를
            동시에 달성하는 지역혁신 생태계입니다.
          </p>
        </div>
      </section>

      {/* 비전 · 미션 · 가치 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-px bg-[#DC2626]/10 rounded-3xl overflow-hidden">
            {[
              {
                label: "VISION",
                title: "전북 외식산업의 미래",
                desc: "대학 · 직업계고 · 지역기업의 3자 연계로 지속 가능한 조리 인재 생태계를 구축합니다.",
                num: "01",
              },
              {
                label: "MISSION",
                title: "지역 정주형 인재 양성",
                desc: "실전 교육 · AI 매칭 · 산학 연계를 통해 학생이 전북에 남아 성장하도록 돕습니다.",
                num: "02",
              },
              {
                label: "VALUE",
                title: "맛(味) · 품(品)의 계승",
                desc: "전주비빔밥 · 남원추어탕 · 군산 이성당 등 전북 향토 브랜드의 전통을 이어갑니다.",
                num: "03",
              },
            ].map((v) => (
              <div key={v.num} className="bg-white p-10 md:p-12 relative">
                <div className="absolute top-8 right-8 font-sans-ko text-[56px] font-black text-[#FEE2E2] leading-none">
                  {v.num}
                </div>
                <p className="text-[#B8923E] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 relative">
                  {v.label}
                </p>
                <h3 className="font-sans-ko text-[22px] md:text-[24px] font-black text-[#991B1B] mb-4 relative">
                  {v.title}
                </h3>
                <p className="text-[14px] text-[#44403C] leading-[1.8] relative">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사업 개요 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-16">
            <div>
              <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
                Project Overview
              </p>
              <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
                사업 개요
              </h2>
              <div className="w-16 h-1 bg-[#D4A574] mt-5" />
            </div>
            <div className="space-y-6">
              {[
                { k: "사업명", v: "전북의 맛(味)을 '품'은 로컬조리인재 양성" },
                { k: "과제 구분", v: "RISE Track 4 · Regional Innovation" },
                { k: "세부 과제", v: "4-3-2 (호원대학교 주관)" },
                { k: "사업 기간", v: "2025년 ~ 2027년 (3개년)" },
                { k: "운영 주관", v: "호원대학교 호텔조리학과 · RISE사업단" },
                { k: "지원 기관", v: "전북특별자치도 · 교육청 · 전북대학교연합" },
                { k: "주요 대상", v: "전북 직업계고 재학생 · 호원대 학부생 · 지역 외식업체" },
                { k: "연간 예산", v: "정부 지원 RISE 사업비 (과제별 예산 편성)" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] gap-4 pb-5 border-b border-[#DC2626]/10"
                >
                  <div className="font-sans-ko text-[13px] font-bold text-[#DC2626] tracking-wider">
                    {row.k}
                  </div>
                  <div className="text-[14px] md:text-[15px] text-[#2D1B0A] leading-relaxed">
                    {row.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 조직 구성 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
              Organization
            </p>
            <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
              사업단 조직
            </h2>
            <div className="w-16 h-1 bg-[#D4A574] mx-auto mt-5" />
          </div>

          {/* 조직도 */}
          <div className="max-w-4xl mx-auto">
            {/* 최상위 */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#DC2626] text-white rounded-2xl px-8 py-5 text-center shadow-xl shadow-[#DC2626]/20">
                <p className="text-[10px] font-bold tracking-[0.2em] opacity-80 uppercase mb-1">
                  Leadership
                </p>
                <p className="font-sans-ko font-black text-[17px]">사업 총괄</p>
                <p className="text-[12px] opacity-90 mt-0.5">호원대학교 총장</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-[#DC2626]/30" />
            </div>

            {/* 사업단장 */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#991B1B] text-white rounded-2xl px-8 py-5 text-center">
                <p className="text-[10px] font-bold tracking-[0.2em] opacity-80 uppercase mb-1">
                  Director
                </p>
                <p className="font-sans-ko font-black text-[17px]">사업단장</p>
                <p className="text-[12px] opacity-90 mt-0.5">
                  호원대 호텔조리학과 홍인기 교수
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-[#DC2626]/30" />
            </div>

            {/* 3개 부문 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  role: "Education",
                  title: "교육운영팀",
                  items: [
                    "On-D-Gourmet 과정 기획 · 운영",
                    "COOKING 브릿지 직무연수",
                    "조리캠프 · 경진대회 주관",
                  ],
                },
                {
                  role: "Partnership",
                  title: "산학협력팀",
                  items: [
                    "외식업체 MOU 체결 · 관리",
                    "학생 인턴 · 채용 연계",
                    "지자체 · 교육청 협력",
                  ],
                },
                {
                  role: "Research",
                  title: "정책연구팀",
                  items: [
                    "지역 정주율 분석 연구",
                    "직업계고 실태조사",
                    "성과지표 · 만족도 분석",
                  ],
                },
              ].map((team) => (
                <div
                  key={team.title}
                  className="bg-white border-2 border-[#DC2626]/15 rounded-2xl p-6 hover:border-[#DC2626] hover:shadow-lg hover:shadow-[#DC2626]/5 transition-all"
                >
                  <p className="text-[#B8923E] text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
                    {team.role}
                  </p>
                  <h4 className="font-sans-ko text-[18px] font-black text-[#991B1B] mb-4">
                    {team.title}
                  </h4>
                  <ul className="space-y-2">
                    {team.items.map((it) => (
                      <li
                        key={it}
                        className="flex gap-2 text-[13px] text-[#44403C] leading-relaxed"
                      >
                        <div className="w-1 h-1 rounded-full bg-[#DC2626] mt-2 shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
              History
            </p>
            <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
              연혁 · 마일스톤
            </h2>
            <div className="w-16 h-1 bg-[#D4A574] mx-auto mt-5" />
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* 세로 라인 */}
            <div className="absolute left-[19px] md:left-[79px] top-2 bottom-2 w-0.5 bg-[#DC2626]/20" />

            <div className="space-y-8">
              {[
                {
                  date: "2025.04",
                  title: "사업 착수 · RISE Track 4-3-2 승인",
                  desc: "호원대학교 주관으로 전북특별자치도와 협약 체결, 3개년 과제 확정.",
                },
                {
                  date: "2025.07",
                  title: "On-D-Gourmet 1차 교육 실시",
                  desc: "진경여고 · 덕암정보고 학생 24명 대상 K-로컬 아시안 퀴진 · 카페·베이커리 과정 (5일).",
                },
                {
                  date: "2025.09",
                  title: "COOKING 브릿지 · 하이브리드 조리대회 1차",
                  desc: "덕암정보고 · 남원제일고 조리대회 지도 + 온·오프라인 병행 본선 개최.",
                },
                {
                  date: "2025.11 ~ 12",
                  title: "조리융합캠프 1·2차 + 김장봉사 1·2차",
                  desc: "3개교 합동 캠프 80명 참여, 지역 독거 어르신 40가구에 김치 400포기 전달.",
                },
                {
                  date: "2025.12",
                  title: "제과제빵실 구축공사 완료",
                  desc: "호원대 호텔조리학과 제과제빵실 전면 리모델링 (30인 동시 실습 가능).",
                },
                {
                  date: "2026.03",
                  title: "정책연구 보고서 발간",
                  desc: "『직업계고 고등학생의 지역이탈 결정요인과 지역정주 활성화 조건』 500명 설문.",
                },
                {
                  date: "2026.04",
                  title: "맛JobGO 플랫폼 오픈",
                  desc: "AI 매칭 · 맛담 커뮤니티 · 15개 외식업체 연계 플랫폼 정식 런칭.",
                },
                {
                  date: "2026.05 ~ (예정)",
                  title: "2차년도 사업 고도화",
                  desc: "On-D-Gourmet 2차 (양식 & 사퀴테리) · 3차 (명장 베이커리) · 수시 특별전형 연계.",
                  upcoming: true,
                },
              ].map((ev, i) => (
                <div key={i} className="flex gap-5 md:gap-8 relative">
                  <div className="shrink-0 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-sans-ko font-black text-[12px] md:text-[13px] border-4 ${
                        ev.upcoming
                          ? "bg-white border-[#D4A574] text-[#B8923E]"
                          : "bg-[#DC2626] border-[#FEE2E2] text-white"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="hidden md:block font-sans-ko text-[13px] font-bold text-[#991B1B] mt-2 whitespace-nowrap">
                      {ev.date}
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-[#DC2626]/10 p-5 md:p-6 hover:border-[#DC2626]/30 transition">
                    <div className="md:hidden text-[12px] font-bold text-[#DC2626] mb-1">
                      {ev.date}
                    </div>
                    <h4 className="font-sans-ko text-[16px] md:text-[17px] font-black text-[#991B1B] mb-2">
                      {ev.title}
                      {ev.upcoming && (
                        <span className="ml-2 bg-[#FEF3C7] text-[#B8923E] text-[10px] px-2 py-0.5 rounded-full">
                          예정
                        </span>
                      )}
                    </h4>
                    <p className="text-[13.5px] text-[#44403C] leading-[1.7]">
                      {ev.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 CTA */}
      <section className="relative bg-white py-20 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4A574]" />
        <div className="absolute top-1 left-0 w-1/3 h-0.5 bg-[#DC2626]" />
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="bg-[#991B1B] rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#DC2626]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#D4A574]/20 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-[2fr_1fr] gap-8 md:gap-12 items-center">
              <div>
                <p className="text-[#FCA5A5] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
                  Get Involved
                </p>
                <h2 className="font-sans-ko text-[32px] md:text-[44px] font-black text-white leading-[1.1] tracking-tight mb-5">
                  맛JobGO에 동참하세요
                </h2>
                <p className="text-white/80 text-[15px] leading-[1.8] max-w-lg">
                  학생으로 가입해 교육과 취업 기회를 얻거나, 기업·기관으로 참여해
                  지역 조리 인재와 함께 성장하세요.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#991B1B] px-6 py-4 rounded-full text-[14px] font-bold hover:bg-[#FFFBF5] transition"
                >
                  지금 가입하기
                  <Icon name="arrow-right" size={14} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center justify-center gap-2 bg-[#DC2626] text-white px-6 py-4 rounded-full text-[14px] font-bold hover:bg-[#991B1B] transition"
                >
                  협력 파트너 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
