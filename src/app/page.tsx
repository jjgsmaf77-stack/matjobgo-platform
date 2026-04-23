import Link from "next/link";
import { readdir } from "fs/promises";
import path from "path";
import { Icon } from "@/components/Icon";
import MatdamFloatingButton from "@/components/MatdamFloatingButton";

async function getGalleryImages(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "public", "uploads", "gallery");
    const files = await readdir(dir);
    return files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()
      .map((f) => `/uploads/gallery/${f}`);
  } catch {
    return [];
  }
}

// 모자이크 패턴: 17장 기준 — 일부 타일은 2x2(feature), 일부는 2x1(wide)
// col-span, row-span 을 positional 로 배분해 시각적 리듬 확보
function mosaicSpan(i: number): string {
  // 0-based index
  const pattern: Record<number, string> = {
    0: "md:col-span-2 md:row-span-2",     // 좌상단 feature
    4: "md:col-span-2",                    // 가로로 길게
    7: "md:col-span-2 md:row-span-2",     // 중앙 feature
    11: "md:col-span-2",                   // wide
    14: "md:col-span-2 md:row-span-2",    // 우하단 feature
  };
  return pattern[i] || "";
}

export default async function Home() {
  const galleryImages = await getGalleryImages();
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Header - 삼성 스타일 미니멀 네비게이션 */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5 text-[24px] font-black tracking-tight text-[#991B1B] font-sans-ko">
            <span>맛</span>
            <span className="text-[#DC2626] font-sans-ko">JOB</span>
            <span>GO</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-[13px] font-medium text-black/70">
            <a href="#about" className="hover:text-[#991B1B] transition">소개</a>
            <a href="#features" className="hover:text-[#991B1B] transition">기능</a>
            <a href="#programs" className="hover:text-[#991B1B] transition">교육과정</a>
          </nav>
          <div className="flex items-center gap-5 text-[13px]">
            <Link href="/login" className="font-medium text-black/60 hover:text-[#991B1B] transition">
              로그인
            </Link>
            <Link href="/register" className="font-medium text-white bg-[#DC2626] px-5 py-2 rounded-full hover:bg-[#991B1B] transition">
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - 크림 배경 + 레드 브랜드 + 골드 액센트 (레드와 조화로운 팔레트) */}
      <section className="relative bg-[#FFFBF5] overflow-hidden">
        {/* 장식 블록 - 우상단 레드 사각형 (PPT 스타일) */}
        <div className="absolute top-0 right-0 w-32 md:w-56 h-32 md:h-56 bg-[#DC2626]" />
        <div className="absolute top-0 right-32 md:right-56 w-2 md:w-3 h-32 md:h-56 bg-[#D4A574]" />
        {/* 좌하단 골드 얇은 선 */}
        <div className="absolute bottom-0 left-0 w-40 md:w-64 h-1.5 bg-[#D4A574]" />
        <div className="absolute bottom-1.5 left-0 w-24 md:w-40 h-1 bg-[#991B1B]" />

        {/* 배경 워터마크 MATJOBGO (아주 은은한 레드) */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          aria-hidden="true"
        >
          <span className="text-[24vw] md:text-[18vw] font-black text-[#DC2626]/[0.04] tracking-[-0.05em] leading-none whitespace-nowrap">
            MATJOBGO
          </span>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-8 pt-24 md:pt-32 pb-28 md:pb-32 text-center">
          {/* RISE 라벨 (골드) */}
          <div className="inline-flex items-center gap-3 mb-10 md:mb-12">
            <div className="w-8 h-px bg-[#D4A574]" />
            <p className="text-[#B8923E] text-[12px] md:text-[13px] font-bold tracking-[0.35em] uppercase">
              RISE Track IV · Regional Innovation
            </p>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>

          {/* 맛 JOB GO 초대형 타이포 - 레드 계조로 깊이감 */}
          <h1 className="font-sans-ko font-black leading-[0.9] tracking-[-0.05em] flex flex-wrap items-center justify-center gap-x-6 md:gap-x-12 text-[22vw] md:text-[200px] lg:text-[240px] xl:text-[280px]">
            <span className="text-[#991B1B]">맛</span>
            <span className="text-[#DC2626]">JOB</span>
            <span className="text-[#991B1B]">GO</span>
          </h1>

          {/* 골드 언더라인 악센트 */}
          <div className="flex justify-center mt-8 md:mt-10">
            <div className="w-20 h-1.5 bg-[#D4A574]" />
          </div>

          <h2 className="font-sans-ko text-[#2D1B0A] text-[26px] md:text-[36px] font-bold leading-[1.15] tracking-tight mt-8 md:mt-10">
            전북의 맛을 품은
            <br />
            <span className="text-[#DC2626]">로컬 조리 인재</span>
          </h2>
          <p className="text-[#44403C] text-[14px] md:text-[16px] leading-relaxed max-w-lg mx-auto mt-5">
            호원대학교와 전북 지역 외식산업을 연결하는<br />
            AI 기반 스마트 인재 매칭 플랫폼
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10 md:mt-12 flex-wrap">
            <Link
              href="/register?role=student"
              className="inline-flex items-center justify-center px-8 py-[14px] bg-[#DC2626] text-white text-[14px] font-bold rounded-full hover:bg-[#991B1B] transition shadow-xl shadow-[#DC2626]/25"
            >
              학생 시작하기
            </Link>
            <Link
              href="/register?role=company"
              className="inline-flex items-center justify-center px-8 py-[14px] bg-white text-[#991B1B] text-[14px] font-bold rounded-full border-2 border-[#991B1B]/15 hover:border-[#DC2626] hover:text-[#DC2626] transition"
            >
              기업 시작하기
            </Link>
            <Link
              href="/matdam"
              className="group inline-flex items-center justify-center gap-2 px-8 py-[14px] bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white text-[14px] font-bold rounded-full hover:from-[#B45309] hover:to-[#D97706] transition shadow-xl shadow-[#D97706]/30 relative"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              맛담 커뮤니티 둘러보기
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#D97706] text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-lg">
                NEW
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats - 구체화된 임팩트 지표 */}
      <section className="bg-[#FFFBF5] border-y border-[#DC2626]/10">
        <div className="max-w-[1440px] mx-auto px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {([
              {
                num: "35+",
                unit: "명",
                label: "교육 참여 학생",
                sub: "덕암정보고 · 진경여고 · 남원제일고",
                iconName: "student" as const,
              },
              {
                num: "15+",
                unit: "곳",
                label: "협력 외식업체",
                sub: "이성당 · 고궁 · 삼백집 등 전북 명가",
                iconName: "building" as const,
              },
              {
                num: "7",
                unit: "개",
                label: "교육 · 활동 트랙",
                sub: "On-D-Gourmet · 브릿지 · 캠프 · 봉사",
                iconName: "trophy" as const,
              },
              {
                num: "4.8",
                unit: "/ 5.0",
                label: "만족도 조사 평균",
                sub: "2025년 1차년도 참여자 기준",
                iconName: "heart-filled" as const,
              },
            ]).map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-3xl border border-[#DC2626]/10 p-7 md:p-8 hover:border-[#DC2626]/40 hover:shadow-lg hover:shadow-[#DC2626]/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                    <Icon
                      name={s.iconName}
                      size={22}
                      strokeWidth={1.75}
                      className="text-[#DC2626]"
                    />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="font-sans-ko text-[40px] md:text-[48px] font-black text-[#991B1B] leading-none tracking-tight">
                    {s.num}
                  </div>
                  <div className="text-[14px] font-semibold text-[#DC2626]">
                    {s.unit}
                  </div>
                </div>
                <div className="font-sans-ko text-[14px] font-bold text-[#991B1B] mt-3">
                  {s.label}
                </div>
                <div className="text-[12px] text-black/45 leading-relaxed mt-1.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About - 플랫폼 가치 제안 (신규 디자인) */}
      <section className="bg-white" id="about">
        <div className="max-w-[1440px] mx-auto px-8 py-24 md:py-32">
          {/* 섹션 헤더 */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-16 items-end mb-16">
            <div>
              <p className="text-[#DC2626] text-[12px] font-bold tracking-[0.3em] uppercase mb-5">
                About · 이렇게 연결됩니다
              </p>
              <h2 className="font-sans-ko text-[36px] md:text-[48px] font-black text-[#991B1B] leading-[1.1] tracking-tight">
                전북 조리인재의<br />
                <span className="text-[#DC2626]">성장 파트너</span>
              </h2>
            </div>
            <div>
              <p className="text-[#991B1B] text-[15px] md:text-[17px] leading-[1.8] font-medium">
                맛JobGO는 단순한 매칭 플랫폼이 아닙니다.<br />
                호원대학교 · 전북 직업계고 · 지역 외식업체가
                실질적으로 연결되어, <span className="bg-[#DC2626] text-white px-1.5 py-0.5">정주율을 높이고 조리 인재를 길러내는
                지역혁신 생태계</span>입니다.
              </p>
            </div>
          </div>

          {/* 3 Pillar Cards (AI 매칭 카드 제거) */}
          <div className="grid md:grid-cols-3 gap-5 mb-20">
            {([
              {
                iconName: "book-open" as const,
                title: "전문 교육 커리큘럼",
                sub: "Curriculum",
                desc: "실제 외식업체 판매 메뉴 기반 맞춤 집중 교육",
                items: [
                  "On-D-Gourmet (양식·사퀴테리·K-아시안)",
                  "COOKING 브릿지 (NCS 직무연수)",
                  "융합조리캠프 (3개교 협력 운영)",
                  "하이브리드 조리대회 (온·오프 병행)",
                ],
              },
              {
                iconName: "hand-heart" as const,
                title: "산학 연계 채용",
                sub: "Partnership",
                desc: "전북 유명 외식업체와 MOU 기반 현장 · 채용 지원",
                items: [
                  "이성당 · 고궁수라간 · PNB풍년 등 15곳",
                  "현장 실습 → 정규직 채용 연계",
                  "호원대 수시 특별전형 가산점",
                  "1학년 등록금 50% 장학 연계",
                ],
              },
              {
                iconName: "chat" as const,
                title: "맛담 커뮤니티",
                sub: "Community",
                desc: "고교생-대학생 멘토링과 경험 공유 공간",
                items: [
                  "학습경험 · 프로그램 후기 · 교육과정 공유",
                  "대학생 선배의 멘토 Q&A",
                  "진로고민 · 노하우 · 레시피 7개 카테고리",
                  "댓글 · 좋아요 · 북마크 · 쪽지",
                ],
              },
            ]).map((p, idx) => (
              <div
                key={p.title}
                className="group relative bg-white rounded-3xl border border-[#DC2626]/10 p-7 md:p-8 hover:border-[#DC2626]/40 hover:shadow-xl hover:shadow-[#DC2626]/5 transition-all duration-300"
              >
                {/* 번호 뱃지 */}
                <div className="absolute top-6 right-6 font-sans-ko text-[56px] font-black text-[#FEE2E2] leading-none group-hover:text-[#FECACA] transition-colors">
                  0{idx + 1}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#DC2626] flex items-center justify-center mb-6 relative">
                  <Icon
                    name={p.iconName}
                    size={22}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DC2626] mb-2 relative">
                  {p.sub}
                </p>
                <h3 className="font-sans-ko text-[20px] font-bold text-[#991B1B] mb-2.5 relative">
                  {p.title}
                </h3>
                <p className="text-[13px] text-black/55 leading-relaxed mb-5 relative">
                  {p.desc}
                </p>
                <ul className="space-y-2 relative">
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[12.5px] text-[#991B1B]/80 leading-relaxed"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#DC2626] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Journey 2열: 학생 · 기업 */}
          <div className="bg-[#FFFBF5] border border-[#DC2626]/10 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-[1fr_auto_1fr]">
              {/* 학생 여정 */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#DC2626] flex items-center justify-center">
                    <Icon
                      name="student"
                      size={20}
                      strokeWidth={2}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#DC2626]">
                      For Students
                    </p>
                    <h4 className="font-sans-ko text-[22px] font-black text-[#991B1B]">
                      학생 여정
                    </h4>
                  </div>
                </div>
                <ol className="space-y-5">
                  {[
                    {
                      step: "1",
                      title: "가입 + 프로필 등록",
                      desc: "소속 학교, 학년, 희망 분야(한식·양식·제과 등), 희망 근무지역, 자격증·경력 입력",
                    },
                    {
                      step: "2",
                      title: "교육 프로그램 참여",
                      desc: "On-D-Gourmet 5일 집중 · COOKING 브릿지 조리대회 지도 · 김장봉사 · 조리캠프 (전액 무료, 조리복·재료 지원)",
                    },
                    {
                      step: "3",
                      title: "AI 매칭 + 관심 기업 탐색",
                      desc: "100점 스코어 기반 자동 추천. 기업 프로필 열람, 실제 공고에 직접 지원",
                    },
                    {
                      step: "4",
                      title: "취업 · 대학 진학",
                      desc: "협력 업체 채용 / 호원대 호텔조리학과 수시 특별전형 (1학년 등록금 50% 감면)",
                    },
                  ].map((s) => (
                    <li key={s.step} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#DC2626] text-[#DC2626] flex items-center justify-center font-sans-ko font-bold text-[14px]">
                        {s.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <h5 className="font-sans-ko font-bold text-[15px] text-[#991B1B] mb-1">
                          {s.title}
                        </h5>
                        <p className="text-[12.5px] text-black/55 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 중앙 커넥터 */}
              <div className="hidden md:flex items-center justify-center px-2">
                <div className="relative h-full flex flex-col items-center">
                  <div className="flex-1 w-px bg-[#DC2626]/20" />
                  <div className="w-16 h-16 rounded-full bg-[#DC2626] flex items-center justify-center shadow-xl shadow-[#DC2626]/30 my-3">
                    <span className="font-sans-ko text-white font-black text-[11px] tracking-tight text-center leading-tight">
                      맛Job<br />GO
                    </span>
                  </div>
                  <div className="flex-1 w-px bg-[#DC2626]/20" />
                </div>
              </div>

              {/* 기업 여정 */}
              <div className="p-8 md:p-12 bg-white md:bg-transparent border-t md:border-t-0 border-[#DC2626]/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#991B1B] flex items-center justify-center">
                    <Icon
                      name="building"
                      size={20}
                      strokeWidth={2}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#991B1B]">
                      For Companies
                    </p>
                    <h4 className="font-sans-ko text-[22px] font-black text-[#991B1B]">
                      기업 여정
                    </h4>
                  </div>
                </div>
                <ol className="space-y-5">
                  {[
                    {
                      step: "1",
                      title: "가입 + 기업정보 등록",
                      desc: "업체 소개, 인재상, 대표 메뉴, 근무 환경을 정리. 사업자등록 기반 인증",
                    },
                    {
                      step: "2",
                      title: "채용공고 등록 (무료)",
                      desc: "분야·자격·급여·근무시간 입력 즉시 AI 매칭 실행. 맞춤 학생에 자동 추천 노출",
                    },
                    {
                      step: "3",
                      title: "인재 탐색 · 스카우트",
                      desc: "공개 학생 프로필 열람, 매칭률 높은 인재에 직접 메시지 · 면접 제안",
                    },
                    {
                      step: "4",
                      title: "채용 + 장기 성장 지원",
                      desc: "지원자 합격/불합격 처리, 호원대 교수 자문 · 산학 프로그램 연계",
                    },
                  ].map((s) => (
                    <li key={s.step} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#991B1B] text-[#991B1B] flex items-center justify-center font-sans-ko font-bold text-[14px]">
                        {s.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <h5 className="font-sans-ko font-bold text-[15px] text-[#991B1B] mb-1">
                          {s.title}
                        </h5>
                        <p className="text-[12.5px] text-black/55 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* 하단 CTA 바 */}
            <div className="bg-[#DC2626] px-8 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white text-[14px] md:text-[15px] font-semibold">
                지금 가입하면 1차년도 프로그램 결과물 갤러리와
                15개 협력 업체 공고를 즉시 볼 수 있습니다
              </p>
              <div className="flex gap-2.5 shrink-0">
                <Link
                  href="/register?role=student"
                  className="bg-white text-[#DC2626] px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#FFFBF5] transition whitespace-nowrap"
                >
                  학생 가입
                </Link>
                <Link
                  href="/register?role=company"
                  className="bg-[#991B1B] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#991B1B] transition whitespace-nowrap"
                >
                  기업 가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - 삼성 스타일 풀폭 카드 */}
      <section className="bg-[#f6f6f6]" id="features">
        <div className="max-w-[1440px] mx-auto px-8 py-28">
          <div className="text-center mb-20">
            <p className="text-[#DC2626] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">Features</p>
            <h2 className="font-sans-ko text-[36px] md:text-[44px] font-bold text-[#991B1B] leading-tight tracking-tight">
              세 주체를 위한 맞춤 기능
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* 학생 */}
            <div className="bg-white rounded-3xl p-10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
              <div className="w-14 h-14 bg-[#FEE2E2] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                <Icon name="student" size={26} strokeWidth={1.75} className="text-[#DC2626]" />
              </div>
              <h3 className="text-[22px] font-bold text-[#991B1B] mb-1">학생</h3>
              <p className="text-[12px] text-[#DC2626] font-semibold mb-6">직업계고 재학생</p>
              <ul className="space-y-4">
                {["이력서 · 자기소개 등록", "희망 분야 · 지역 설정", "채용공고 탐색 및 지원", "AI 기반 기업 매칭", "기업과 실시간 메시지"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[14px] text-black/60">
                    <div className="w-5 h-5 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* 기업 */}
            <div className="bg-[#DC2626] rounded-3xl p-10 hover:shadow-2xl hover:shadow-[#DC2626]/20 transition-all duration-500 group">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                <Icon name="building" size={26} strokeWidth={1.75} className="text-white" />
              </div>
              <h3 className="text-[22px] font-bold text-white mb-1">기업</h3>
              <p className="text-[12px] text-white/60 font-semibold mb-6">전북 지역 외식업체</p>
              <ul className="space-y-4">
                {["기업 정보 · 인재상 등록", "채용공고 작성 · 관리", "학생 프로필 탐색 · 스카우트", "AI 기반 인재 매칭", "지원자 관리 및 소통"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[14px] text-white/70">
                    <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* 대학 */}
            <div className="bg-white rounded-3xl p-10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
              <div className="w-14 h-14 bg-[#f0f0f0] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                <Icon name="school" size={26} strokeWidth={1.75} className="text-[#DC2626]" />
              </div>
              <h3 className="text-[22px] font-bold text-[#991B1B] mb-1">대학</h3>
              <p className="text-[12px] text-[#DC2626] font-semibold mb-6">호원대학교 사업단</p>
              <ul className="space-y-4">
                {["매칭 현황 대시보드", "프로그램 등록 · 관리", "학생 · 기업 모니터링", "취업률 · 정주율 통계", "공지사항 관리"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[14px] text-black/60">
                    <div className="w-5 h-5 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs - 교육 과정 */}
      <section className="bg-white" id="programs">
        <div className="max-w-[1440px] mx-auto px-8 py-28">
          <div className="text-center mb-20">
            <p className="text-[#DC2626] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">Programs</p>
            <h2 className="font-sans-ko text-[36px] md:text-[44px] font-bold text-[#991B1B] leading-tight tracking-tight">
              On-D-Gourmet 교육 과정
            </h2>
            <p className="text-black/40 text-[15px] mt-4">전북 로컬 식재료를 활용한 전문 조리 교육</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { name: "한식", desc: "전주비빔밥 · 한정식", iconName: "bowl-rice" as const },
              { name: "양식", desc: "모던 유러피안 퀴진", iconName: "pasta" as const },
              { name: "제과제빵", desc: "수제 베이커리 · 디저트", iconName: "bread" as const },
              { name: "카페 · 바리스타", desc: "스페셜티 커피", iconName: "coffee" as const },
            ]).map((f) => (
              <div key={f.name} className="bg-[#f6f6f6] hover:bg-[#FEF2F2] rounded-2xl p-8 text-center transition-all duration-300 cursor-default group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={f.iconName} size={26} strokeWidth={1.75} className="text-[#DC2626]" />
                </div>
                <div className="text-[16px] font-bold text-[#991B1B]">{f.name}</div>
                <div className="text-[12px] text-black/35 mt-1.5">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* 부가 프로그램 - 크림 배경 + 골드 사이드바 */}
          <div className="mt-8 bg-white rounded-3xl border border-[#DC2626]/15 overflow-hidden">
            <div className="grid md:grid-cols-[1fr_auto]">
              <div className="p-10 md:p-14 relative">
                <div className="absolute left-0 top-10 md:top-14 bottom-10 md:bottom-14 w-1 bg-[#D4A574]" />
                <div className="pl-6">
                  <p className="text-[#B8923E] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
                    Additional Programs
                  </p>
                  <h3 className="font-sans-ko text-[24px] md:text-[28px] font-black text-[#991B1B] mb-3 tracking-tight">
                    COOKING 브릿지 & 융합조리캠프
                  </h3>
                  <p className="text-[#44403C] text-[14px] leading-relaxed max-w-lg">
                    직업계고 학생 대상 조리대회 지도, 지역 · 타지역 고교 협력 융합형 조리캠프, 지역사회 김장봉사 등 다양한 비교과 프로그램을 운영합니다.
                  </p>
                </div>
              </div>
              <div className="p-10 md:p-14 md:pl-4 bg-[#FFFBF5] border-t md:border-t-0 md:border-l border-[#DC2626]/10 flex items-center">
                <div className="flex gap-3">
                  {[
                    { label: "조리대회", val: "진경여고" },
                    { label: "캠프", val: "40명" },
                    { label: "봉사", val: "김장" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white border border-[#D4A574]/40 rounded-2xl px-5 py-5 text-center min-w-[90px]"
                    >
                      <div className="font-sans-ko text-[16px] md:text-[18px] font-black text-[#DC2626]">
                        {item.val}
                      </div>
                      <div className="text-[11px] text-[#B8923E] font-semibold mt-1 tracking-wider">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 맛담 커뮤니티 (Warm Amber) */}
      <section className="bg-[#1A0F04] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0F04] via-[#3D2410] to-[#1A0F04]" />
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-[#D97706]/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-[#F59E0B]/25 rounded-full blur-[120px]" />
        <div className="relative max-w-[1440px] mx-auto px-8 py-28">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-16 items-center">
            <div>
              <p className="text-[#FCD34D] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">
                맛담 · MatDam
              </p>
              <h2 className="font-sans-ko text-white text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-tight mb-6">
                고등학생과 대학생이<br />
                이야기를 나누는 공간
              </h2>
              <p className="text-white/60 text-[15px] leading-relaxed mb-10 max-w-lg">
                학습경험 · 프로그램 후기 · 교육과정 · 사회공헌 · 진로고민을
                자유롭게 공유하고, 호원대 호텔조리학과 선배들에게 직접 멘토링을 받아보세요.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-lg">
                {([
                  { iconName: "book" as const, label: "학습경험" },
                  { iconName: "trophy" as const, label: "프로그램 후기" },
                  { iconName: "compass" as const, label: "진로고민" },
                  { iconName: "bowl" as const, label: "레시피" },
                ]).map((c) => (
                  <div
                    key={c.label}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2"
                  >
                    <Icon
                      name={c.iconName}
                      size={22}
                      strokeWidth={1.5}
                      className="text-[#FCD34D]"
                    />
                    <div className="text-[12px] text-white/70 font-medium">
                      {c.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  href="/matdam"
                  className="inline-flex items-center gap-2 bg-[#D97706] text-white px-7 py-3.5 rounded-full text-[14px] font-semibold hover:bg-[#B45309] transition shadow-2xl shadow-[#D97706]/40"
                >
                  맛담 둘러보기
                  <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/matdam/new"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-full text-[14px] font-semibold border border-white/20 hover:bg-white/15 transition"
                >
                  글쓰기
                </Link>
              </div>
            </div>

            {/* 가상 글 미리보기 카드 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#F59E0B]/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#D97706]/30 rounded-full blur-3xl" />
              <div className="relative space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/40 transform md:-rotate-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#D97706] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      멘토 답변
                    </span>
                    <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                      <Icon name="compass" size={10} strokeWidth={2.5} />
                      진로고민
                    </span>
                  </div>
                  <h3 className="font-bold text-[#991B1B] text-[15px] mb-2 leading-snug">
                    지역에서 시작하는 조리사도 충분히 경쟁력 있어요
                  </h3>
                  <p className="text-black/50 text-[12px] leading-relaxed line-clamp-3">
                    향토음식 전문성은 오히려 희소 가치예요. 남원 추어탕처럼 브랜드 파워 있는 노포에서 시작하면 레퍼런스가 됩니다...
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold text-[11px]">
                        오
                      </div>
                      <span className="text-[11px] font-semibold text-[#991B1B]">오지호 · 호원대 3학년</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-black/40">
                      <span className="inline-flex items-center gap-0.5">
                        <Icon name="heart" size={10} strokeWidth={2} />24
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Icon name="chat" size={10} strokeWidth={2} />7
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/40 transform md:rotate-1 md:ml-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                      <Icon name="lightbulb" size={10} strokeWidth={2.5} />
                      노하우
                    </span>
                  </div>
                  <h3 className="font-bold text-[#991B1B] text-[15px] mb-2 leading-snug">
                    한식조리기능사 실기 3주 단기 합격 루틴
                  </h3>
                  <p className="text-black/50 text-[12px] leading-relaxed line-clamp-2">
                    1주차는 전체 감 잡기, 2주차는 매일 2과제 연습, 3주차는 취약 과제 집중...
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold text-[11px]">
                        김
                      </div>
                      <span className="text-[11px] font-semibold text-[#991B1B]">김민수 · 진경여고 3학년</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-black/40">
                      <span className="inline-flex items-center gap-0.5">
                        <Icon name="heart" size={10} strokeWidth={2} />18
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Icon name="chat" size={10} strokeWidth={2} />4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery - 모자이크 형태의 교육 결과물 */}
      {galleryImages.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1440px] mx-auto px-8 py-28">
            <div className="text-center mb-16">
              <p className="text-[#DC2626] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">Gallery</p>
              <h2 className="font-sans-ko text-[36px] md:text-[44px] font-bold text-[#991B1B] leading-tight tracking-tight">
                학생들이 만든<br />전북의 맛
              </h2>
              <p className="text-black/40 text-[15px] mt-5">
                On-D-Gourmet · COOKING 브릿지 · 융합조리캠프 참여 학생들의 조리 결과물
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[110px] md:auto-rows-[120px] gap-2.5 md:gap-3 grid-flow-dense">
              {galleryImages.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-2xl bg-[#f6f6f6] ${mosaicSpan(i)}`}
                >
                  <img
                    src={src}
                    alt={`교육 결과물 ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#991B1B]/0 group-hover:bg-[#991B1B]/20 transition-colors duration-500" />
                </a>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#DC2626] hover:gap-3 transition-all"
              >
                교육 프로그램 전체 보기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA - 크림 배경 + 레드 강조 + 골드 장식 */}
      <section className="relative bg-[#FFFBF5] overflow-hidden">
        {/* 장식 블록 */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#DC2626]" />
        <div className="absolute top-1.5 left-0 w-1/3 h-1 bg-[#D4A574]" />
        <div className="absolute bottom-0 right-0 w-2/3 h-1.5 bg-[#991B1B]" />
        <div className="absolute bottom-1.5 right-0 w-20 h-1 bg-[#D4A574]" />

        <div className="relative max-w-[1440px] mx-auto px-8 py-24 md:py-28 text-center">
          <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.3em] uppercase mb-6">
            Join MatJobGO
          </p>
          <h2 className="font-sans-ko text-[36px] md:text-[52px] font-black text-[#991B1B] leading-[1.1] tracking-tight mb-6">
            지금, <span className="text-[#DC2626]">전북의 미래</span>를
            <br />
            함께 만들어가세요
          </h2>
          <p className="text-[#44403C] text-[15px] md:text-[16px] mb-12 max-w-lg mx-auto leading-relaxed">
            맛JobGO에서 조리 인재와 지역 기업을 연결하고,<br />
            전북 외식산업의 새로운 가능성을 열어갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#DC2626] text-white text-[14px] font-bold rounded-full hover:bg-[#991B1B] transition shadow-xl shadow-[#DC2626]/25"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#991B1B] text-[14px] font-bold rounded-full border-2 border-[#991B1B]/15 hover:border-[#DC2626] hover:text-[#DC2626] transition"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#991B1B]">
        <div className="max-w-[1440px] mx-auto px-8 py-14">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="text-[20px] font-bold text-white mb-4">
                맛Job<span className="text-[#DC2626]">GO</span>
              </div>
              <p className="text-[12px] text-white/25 leading-relaxed">
                전북의 맛을 품은
                <br />
                로컬조리인재 양성 플랫폼
              </p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase mb-4">플랫폼</h4>
              <ul className="space-y-2.5 text-[13px] text-white/30">
                <li><Link href="/register" className="hover:text-white transition">회원가입</Link></li>
                <li><Link href="/login" className="hover:text-white transition">로그인</Link></li>
                <li><Link href="/jobs" className="hover:text-white transition">채용공고</Link></li>
                <li><Link href="/programs" className="hover:text-white transition">교육 프로그램</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase mb-4">운영</h4>
              <ul className="space-y-2.5 text-[13px] text-white/30">
                <li>호원대학교 호텔조리학과</li>
                <li>맛잡고 사업단</li>
                <li>RISE 지역혁신중심 대학지원체계</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase mb-4">연락처</h4>
              <ul className="space-y-2.5 text-[13px] text-white/30">
                <li>전라북도 군산시 임피면 월하로 64</li>
                <li>호원대학교 호텔조리학과</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/8 mt-12 pt-8 text-[12px] text-white/20 text-center">
            © 2026 맛JobGO. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 맛담 플로팅 버튼 · 전 페이지 공통 */}
      <MatdamFloatingButton />
    </div>
  );
}
