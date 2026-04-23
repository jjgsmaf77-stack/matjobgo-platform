import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";
import Link from "next/link";

export default async function PerformancePage() {
  // 실데이터 집계
  const [
    studentTotal,
    companyTotal,
    jobTotal,
    programTotal,
    postTotal,
    applicationTotal,
    matchTotal,
    acceptedTotal,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.company.count(),
    prisma.jobPosting.count({ where: { status: "OPEN" } }),
    prisma.program.count(),
    prisma.post.count(),
    prisma.application.count(),
    prisma.matchResult.count(),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
  ]);

  const matchRate = applicationTotal > 0
    ? Math.round((acceptedTotal / applicationTotal) * 100)
    : 0;

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
              Performance · 사업 성과
            </p>
          </div>
          <h1 className="font-sans-ko text-[30px] sm:text-[38px] md:text-[52px] lg:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight">
            <span className="text-[#DC2626]">숫자</span>로 보는<br />
            1차년도 성과
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            RISE 사업 Track 4-3-2 <span className="font-bold text-[#991B1B]">2025년</span> 한 해
            동안의 투입과 산출. 지표와 스토리로 사업의 실질적 효과를 공개합니다.
          </p>
        </div>
      </section>

      {/* 핵심 지표 8개 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {([
              { num: studentTotal + "+", unit: "명", label: "누적 학생 회원", sub: "덕암 · 진경 · 남원제일", icon: "student" as const },
              { num: companyTotal + "+", unit: "곳", label: "협력 외식업체", sub: "전북 유명 브랜드 + 신규", icon: "building" as const },
              { num: jobTotal + "+", unit: "건", label: "등록 채용공고", sub: "즉시 지원 가능한 공고", icon: "trophy" as const },
              { num: programTotal, unit: "개", label: "운영 프로그램", sub: "교육 · 대회 · 봉사 포함", icon: "book-open" as const },
              { num: postTotal + "+", unit: "건", label: "맛담 누적 게시글", sub: "멘토링 · 후기 · 레시피", icon: "chat" as const },
              { num: "17", unit: "점", label: "갤러리 결과물", sub: "On-D-Gourmet 조리 실습", icon: "camera" as const },
              { num: matchTotal + "+", unit: "건", label: "AI 매칭 누적", sub: "100점 스코어 매칭", icon: "target" as const },
              { num: "4.8", unit: "/5.0", label: "만족도 평균", sub: "2025 참여자 조사", icon: "heart-filled" as const },
            ]).map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[#DC2626]/10 rounded-3xl p-6 md:p-7 hover:border-[#DC2626]/40 hover:shadow-lg hover:shadow-[#DC2626]/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                    <Icon name={s.icon} size={20} strokeWidth={1.75} className="text-[#DC2626]" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="font-sans-ko text-[32px] md:text-[36px] font-black text-[#991B1B] leading-none">
                    {s.num}
                  </div>
                  <div className="text-[12px] font-semibold text-[#DC2626]">{s.unit}</div>
                </div>
                <div className="font-sans-ko text-[13px] font-bold text-[#991B1B] mt-2.5">{s.label}</div>
                <div className="text-[11px] text-[#44403C]/60 mt-1 leading-snug">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 활동별 성과 하이라이트 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
              Highlights
            </p>
            <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
              프로그램별 성과 하이라이트
            </h2>
            <div className="w-16 h-1 bg-[#D4A574] mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                tag: "On-D-Gourmet",
                title: "취업지원 집중 교육 1차",
                stat: "24명",
                statLabel: "참여 학생",
                desc: "진경여고 · 덕암정보고 학생 대상 K-로컬 아시안 퀴진 & 카페·베이커리 5일 집중. 재료비·조리복 전액 지원.",
                metrics: ["평균 만족도 4.7/5.0", "수료율 100%", "PNB풍년 명장 초빙"],
              },
              {
                tag: "COOKING 브릿지",
                title: "하이브리드 조리대회",
                stat: "60명",
                statLabel: "참가 학생",
                desc: "덕암정보고(10월) · 진경여고(12월) 두 차례 본선 개최. 온·오프라인 병행 진행, 호원대 수시 가산점 연계.",
                metrics: ["대상 1 · 금상 2 · 은상 3 · 동상 5", "3개교 연합 심사", "호텔조리학과 장학 연계"],
              },
              {
                tag: "융합조리캠프",
                title: "지역·타지역 고교 협력",
                stat: "80명",
                statLabel: "1·2차 총 참여",
                desc: "진경여고 · 덕암정보고 · 남원제일고 3개교 합동 1일 집중 캠프. 전북 외식문화 기술 교류.",
                metrics: ["1차 40명 · 2차 40명", "평균 만족도 4.8/5.0", "2차년도 확대 예정"],
              },
              {
                tag: "사회공헌",
                title: "김장봉사 · 지역 나눔",
                stat: "400포기",
                statLabel: "김치 · 40가구 전달",
                desc: "진경여고(12/5) · 덕암정보고(12/10) 김장봉사. 지역 독거 어르신 대상. 학생 자발 참여.",
                metrics: ["총 60명 자원 참여", "지역 정주의식 제고", "전북일보 보도 선정"],
              },
            ].map((h) => (
              <div
                key={h.title}
                className="bg-white border border-[#DC2626]/10 rounded-3xl p-8 md:p-10 hover:border-[#DC2626]/30 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-[#D4A574]" />
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <p className="inline-block bg-[#FEE2E2] text-[#991B1B] text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wider mb-3">
                      {h.tag}
                    </p>
                    <h3 className="font-sans-ko text-[22px] font-black text-[#991B1B] leading-tight">
                      {h.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-sans-ko text-[40px] font-black text-[#DC2626] leading-none">
                      {h.stat}
                    </div>
                    <div className="text-[11px] font-semibold text-[#B8923E] mt-1">
                      {h.statLabel}
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-[#44403C] leading-[1.8] mb-5">{h.desc}</p>
                <ul className="space-y-2 pt-5 border-t border-[#DC2626]/10">
                  {h.metrics.map((m) => (
                    <li key={m} className="flex gap-2 text-[13px] text-[#2D1B0A] items-start">
                      <Icon name="check" size={14} strokeWidth={2.5} className="text-[#DC2626] mt-1 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 임팩트 스토리 */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
              Stories
            </p>
            <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
              학생 · 기업 임팩트 스토리
            </h2>
            <div className="w-16 h-1 bg-[#D4A574] mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote:
                  "덕암정보고 3학년 때 On-D-Gourmet을 수료했어요. 지금은 PNB풍년제과 인턴 3개월차. RISE 사업이 아니었다면 경험 못 했을 기회였습니다.",
                name: "김○○",
                role: "덕암정보고 졸업 → 호원대 호텔조리학과 1학년",
                tag: "학생",
              },
              {
                quote:
                  "지역 업체에 우수 인력이 안 와서 고민이었는데, 맛JobGO로 주니어 조리사 2명을 충원했습니다. 학교 시절부터 관찰한 학생이라 믿음이 갑니다.",
                name: "박셰프",
                role: "비스트로 전주 · 양식 셰프",
                tag: "기업",
              },
              {
                quote:
                  "조리대회 지도를 받으며 전국 대회 출전까지 했어요. 선배 멘토와 맛담에서 계속 교류하고 있습니다.",
                name: "윤○○",
                role: "진경여고 3학년 · 양식 전공 희망",
                tag: "학생",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="bg-[#FFFBF5] border border-[#DC2626]/10 rounded-3xl p-8 relative"
              >
                <div className="absolute top-6 right-6 font-serif text-[80px] leading-none text-[#DC2626]/10 select-none">
                  "
                </div>
                <span className="inline-block bg-[#991B1B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider mb-4">
                  {s.tag}
                </span>
                <p className="font-sans-ko text-[15px] text-[#2D1B0A] leading-[1.8] mb-6 relative">
                  {s.quote}
                </p>
                <div className="pt-4 border-t border-[#DC2626]/10">
                  <p className="font-sans-ko font-black text-[15px] text-[#991B1B]">{s.name}</p>
                  <p className="text-[12px] text-[#44403C]/70 mt-0.5">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연도별 로드맵 */}
      <section className="bg-[#FFFBF5] py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-4">
              3-Year Roadmap
            </p>
            <h2 className="font-sans-ko text-[32px] md:text-[40px] font-black text-[#991B1B] leading-tight tracking-tight">
              3개년 로드맵 · 목표 지표
            </h2>
            <div className="w-16 h-1 bg-[#D4A574] mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-3 gap-0 bg-[#DC2626]/10 rounded-3xl overflow-hidden">
            {[
              {
                year: "2025",
                label: "1차년도 · 기반 구축",
                status: "완료",
                color: "#991B1B",
                items: [
                  "플랫폼 개발 · 오픈",
                  "MOU 15개 체결",
                  "On-D-Gourmet 1차",
                  "제과제빵실 구축",
                  "조리대회 2회 개최",
                ],
              },
              {
                year: "2026",
                label: "2차년도 · 확산 · 고도화",
                status: "진행 중",
                color: "#DC2626",
                items: [
                  "On-D-Gourmet 2·3차",
                  "3개교 → 5개교 확대",
                  "조리 교사 직무연수",
                  "호원대 수시 특별전형",
                  "맛담 5개교 연합",
                ],
              },
              {
                year: "2027",
                label: "3차년도 · 자립 · 성과",
                status: "계획",
                color: "#D4A574",
                items: [
                  "매칭 취업률 85% 달성",
                  "지역 정주율 75% 달성",
                  "플랫폼 타지역 공유",
                  "국가 우수사례 선정",
                  "사회공헌 상시 운영",
                ],
              },
            ].map((y) => (
              <div key={y.year} className="bg-white p-8 md:p-10 relative">
                <div
                  className="absolute top-0 left-0 h-1.5 w-full"
                  style={{ backgroundColor: y.color }}
                />
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-sans-ko text-[40px] font-black text-[#991B1B] leading-none">
                    {y.year}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${y.color}20`,
                      color: y.color,
                    }}
                  >
                    {y.status}
                  </span>
                </div>
                <p className="font-sans-ko text-[14px] font-bold text-[#DC2626] mb-5">
                  {y.label}
                </p>
                <ul className="space-y-2.5">
                  {y.items.map((it) => (
                    <li key={it} className="flex gap-2 text-[13.5px] text-[#2D1B0A] leading-relaxed">
                      <div
                        className="w-1 h-1 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: y.color }}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14 md:py-16 border-t border-[#DC2626]/10">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h3 className="font-sans-ko text-[22px] md:text-[28px] font-black text-[#991B1B] mb-4">
            더 자세한 연차 보고서가 필요하신가요?
          </h3>
          <p className="text-[#44403C] text-[14px] mb-8">
            정책연구 자료 · 통계 원본 · 만족도 원자료는 자료실에서 요청해주세요.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-6 py-3 rounded-full text-[13px] font-bold hover:bg-[#991B1B] transition"
            >
              정책연구 보기
              <Icon name="arrow-right" size={14} strokeWidth={2.5} />
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 bg-white text-[#991B1B] px-6 py-3 rounded-full text-[13px] font-bold border-2 border-[#991B1B]/15 hover:border-[#DC2626] hover:text-[#DC2626] transition"
            >
              협력 네트워크
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
