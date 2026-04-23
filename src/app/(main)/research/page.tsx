import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function ResearchPage() {
  const reports = [
    {
      year: "2026",
      status: "발간",
      type: "정책연구보고서",
      title: "직업계고 고등학생의 지역이탈 결정요인과 지역정주 활성화 조건 방안",
      authors: "호원대학교 RISE사업단 · 홍인기 외",
      pages: "약 120p",
      summary:
        "전북 직업계고 재학생 500명 · 지역 기업 인사담당자 50명을 대상으로 한 대규모 실태조사. 지역이탈의 주요 결정요인(진학 · 임금 · 문화)을 분석하고, 대학-직업계고-지역기업 연계 매칭 플랫폼의 필요성과 효과를 정량 · 정성 방법론으로 입증.",
      keyFindings: [
        "졸업 후 타지역 이탈 희망 비율: 64.3%",
        "핵심 이탈요인: 임금격차(38%), 교육기회(27%), 문화격차(19%)",
        "지역정주 전환 조건: '실질적 취업 연계'가 72%로 1순위",
        "대학-고교-기업 연계 플랫폼 효과성: 91% 공감",
      ],
      featured: true,
    },
    {
      year: "2025",
      status: "발간",
      type: "기초실태조사",
      title: "전북 외식산업 인력 수급 실태 및 미래 수요 전망",
      authors: "호원대 호텔조리학과 · 맛잡고사업단",
      pages: "약 80p",
      summary:
        "전북 외식업체 200개 표본을 대상으로 한 인력 수급 실태 조사. 분야별(한식·양식·제과제빵) 인력 부족률, 희망 채용 연령대, 최저 희망 근속기간 등을 분석.",
      keyFindings: [
        "외식업체 평균 인력 부족률: 23.7%",
        "가장 부족한 분야: 양식(31%), 제과제빵(28%)",
        "신입 희망 학력: 고졸(54%) · 대졸(40%)",
        "채용 후 1년 정착률: 52%",
      ],
    },
    {
      year: "2025",
      status: "발간",
      type: "프로그램 평가보고서",
      title: "On-D-Gourmet 1차 교육 만족도 조사 결과 분석",
      authors: "맛잡고사업단 성과평가팀",
      pages: "약 30p",
      summary:
        "2025년 7월 실시된 On-D-Gourmet 1차 취업지원 프로그램 참여자 24명 대상 전 과정 만족도 조사. 강사 · 커리큘럼 · 시설 · 운영 · 종합의 5개 차원 분석.",
      keyFindings: [
        "종합 만족도: 4.7/5.0",
        "강사 전문성: 4.8/5.0 (최고)",
        "실습 비중 확대 요청: 84%",
        "재참여 의향: 96%",
      ],
    },
    {
      year: "2026",
      status: "진행 중",
      type: "정책연구보고서",
      title: "AI 기반 인재 매칭 플랫폼의 지역 정주 기여도 분석",
      authors: "맛잡고사업단 · 정책연구팀",
      pages: "진행 중",
      summary:
        "맛JobGO 플랫폼 런칭 후 6개월간의 매칭 데이터를 기반으로, AI 매칭이 실제 채용 · 장기근속 · 지역정주에 미치는 효과를 측정.",
      keyFindings: [
        "2026년 하반기 발간 예정",
        "매칭 → 지원 → 채용 전환율 분석",
        "매칭 점수별 근속기간 상관관계",
        "지역 외 이탈 방지 효과 추정",
      ],
      upcoming: true,
    },
    {
      year: "2027",
      status: "계획",
      type: "종합성과보고서",
      title: "RISE Track 4-3-2 3개년 종합 성과 분석 및 확산 모델",
      authors: "호원대학교 RISE사업단",
      pages: "예정",
      summary:
        "3개년(2025~2027) 전체 사업의 투입 · 산출 · 성과를 정량 분석하고, 타 지역 확산을 위한 표준 운영 모델을 제안하는 종합 보고서.",
      keyFindings: [
        "전체 투입 · 산출 종합 평가",
        "지역별 확산 가능성 분석",
        "후속 사업 발전 방안",
        "정부 RISE 사업 우수사례 보고",
      ],
      upcoming: true,
    },
  ];

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
              Research · 정책연구
            </p>
          </div>
          <h1 className="font-sans-ko text-[30px] sm:text-[38px] md:text-[52px] lg:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight max-w-3xl">
            <span className="text-[#DC2626]">데이터</span>로 증명하는<br />
            지역혁신의 근거
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            맛잡고사업단은 단순한 교육 기관이 아닌
            <span className="font-bold text-[#991B1B]"> 전북 조리인재 생태계의 연구 기지</span>입니다.
            실태조사 · 정책연구 · 성과분석을 통해 근거 기반 운영을 실천합니다.
          </p>
        </div>
      </section>

      {/* 핵심 연구 (Featured) */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          {reports
            .filter((r) => r.featured)
            .map((r) => (
              <div
                key={r.title}
                className="bg-[#991B1B] rounded-3xl p-10 md:p-16 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4A574]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#DC2626]/25 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="bg-[#D4A574] text-[#2D1B0A] text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                      Featured · 주요 연구
                    </span>
                    <span className="text-[#FCA5A5] text-[11px] font-bold tracking-widest uppercase">
                      {r.type} · {r.year}
                    </span>
                  </div>
                  <h2 className="font-sans-ko text-[26px] md:text-[40px] font-black text-white leading-[1.2] tracking-tight mb-6 max-w-4xl">
                    {r.title}
                  </h2>
                  <div className="grid md:grid-cols-[2fr_1fr] gap-10 md:gap-14">
                    <div>
                      <p className="text-white/80 text-[14px] md:text-[15px] leading-[1.9] mb-6">
                        {r.summary}
                      </p>
                      <div className="flex items-center gap-5 text-[13px] text-white/60 flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="users" size={14} strokeWidth={2} />
                          {r.authors}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="book" size={14} strokeWidth={2} />
                          {r.pages}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#D4A574] text-[11px] font-bold tracking-wider uppercase mb-3">
                        Key Findings
                      </p>
                      <ul className="space-y-2.5">
                        {r.keyFindings.map((f) => (
                          <li
                            key={f}
                            className="flex gap-2 text-[13px] text-white/85 leading-relaxed"
                          >
                            <div className="w-1 h-1 rounded-full bg-[#D4A574] mt-2 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8 pt-8 border-t border-white/15 flex-wrap">
                    <button className="inline-flex items-center gap-2 bg-white text-[#991B1B] px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#FFFBF5] transition">
                      <Icon name="arrow-right" size={14} strokeWidth={2.5} />
                      요약본 요청
                    </button>
                    <button className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-white/15 transition">
                      <Icon name="mail" size={14} strokeWidth={2} />
                      원문 문의
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 연구 목록 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-3">
                Library
              </p>
              <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
                연구자료 라이브러리
              </h2>
              <div className="w-16 h-1 bg-[#D4A574] mt-5" />
            </div>
            <div className="bg-white border border-[#DC2626]/20 text-[#991B1B] px-5 py-2 rounded-full text-[13px] font-bold">
              총 {reports.length} 편
            </div>
          </div>

          <div className="space-y-4">
            {reports
              .filter((r) => !r.featured)
              .map((r) => (
                <div
                  key={r.title}
                  className="bg-white border border-[#DC2626]/10 rounded-3xl p-6 md:p-8 hover:border-[#DC2626]/30 hover:shadow-md transition-all"
                >
                  <div className="grid md:grid-cols-[auto_1fr_auto] gap-5 md:gap-8 items-start">
                    {/* 년도 배지 */}
                    <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:min-w-[80px]">
                      <div
                        className="font-sans-ko text-[32px] md:text-[40px] font-black leading-none"
                        style={{
                          color: r.upcoming ? "#D4A574" : "#991B1B",
                        }}
                      >
                        {r.year}
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: r.upcoming
                            ? "#FEF3C7"
                            : r.status === "진행 중"
                            ? "#FEE2E2"
                            : "#F0FDF4",
                          color: r.upcoming
                            ? "#B8923E"
                            : r.status === "진행 중"
                            ? "#DC2626"
                            : "#15803D",
                        }}
                      >
                        {r.status}
                      </span>
                    </div>

                    {/* 본문 */}
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DC2626] mb-2">
                        {r.type}
                      </p>
                      <h3 className="font-sans-ko text-[17px] md:text-[19px] font-black text-[#991B1B] leading-tight mb-3">
                        {r.title}
                      </h3>
                      <p className="text-[13.5px] text-[#44403C] leading-[1.8] mb-4">
                        {r.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {r.keyFindings.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#991B1B] text-[11.5px] px-2.5 py-1 rounded-full font-medium"
                          >
                            <div className="w-1 h-1 rounded-full bg-[#DC2626]" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 메타 */}
                    <div className="md:text-right text-[11px] text-[#44403C]/70 space-y-1 md:min-w-[140px]">
                      <p className="flex md:justify-end items-center gap-1.5">
                        <Icon name="users" size={11} strokeWidth={2} />
                        {r.authors}
                      </p>
                      <p className="flex md:justify-end items-center gap-1.5">
                        <Icon name="book" size={11} strokeWidth={2} />
                        {r.pages}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 연구 요청 안내 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "원문 열람 요청",
                desc: "연구 보고서 전문은 학술·공공 목적에 한해 메일로 요청하실 수 있습니다.",
                action: "요청하기",
              },
              {
                num: "02",
                title: "공동 연구 제안",
                desc: "지역 · 교육 · 외식산업 관련 공동 연구를 제안하실 수 있습니다.",
                action: "제안하기",
              },
              {
                num: "03",
                title: "인용 · 활용",
                desc: "보고서 인용 시 출처 표기(호원대학교 RISE사업단)를 부탁드립니다.",
                action: "인용 가이드",
              },
            ].map((c) => (
              <div
                key={c.num}
                className="bg-[#FFFBF5] border border-[#DC2626]/10 rounded-3xl p-7 md:p-8 hover:border-[#DC2626]/30 transition-all relative overflow-hidden"
              >
                <div className="absolute top-6 right-6 font-sans-ko text-[56px] font-black text-[#FEE2E2] leading-none">
                  {c.num}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center mb-5 relative">
                  <Icon name="mail" size={18} strokeWidth={2} className="text-white" />
                </div>
                <h3 className="font-sans-ko text-[18px] font-black text-[#991B1B] mb-3 relative">
                  {c.title}
                </h3>
                <p className="text-[13.5px] text-[#44403C] leading-[1.8] mb-5 relative">
                  {c.desc}
                </p>
                <div className="text-[13px] font-bold text-[#DC2626] relative inline-flex items-center gap-1">
                  {c.action}
                  <Icon name="arrow-right" size={13} strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="mailto:inki0110@howon.ac.kr"
              className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-7 py-3.5 rounded-full text-[14px] font-bold hover:bg-[#991B1B] transition shadow-xl shadow-[#DC2626]/25"
            >
              <Icon name="mail" size={15} strokeWidth={2} />
              inki0110@howon.ac.kr 로 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
