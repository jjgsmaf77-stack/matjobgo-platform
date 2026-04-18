import Link from "next/link";
import { readdir } from "fs/promises";
import path from "path";
import { Icon } from "@/components/Icon";

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
          <Link href="/" className="text-[22px] font-bold tracking-tight text-black">
            맛Job<span className="text-[#1428A0]">GO</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-[13px] font-medium text-black/70">
            <a href="#about" className="hover:text-black transition">소개</a>
            <a href="#features" className="hover:text-black transition">기능</a>
            <a href="#programs" className="hover:text-black transition">교육과정</a>
          </nav>
          <div className="flex items-center gap-5 text-[13px]">
            <Link href="/login" className="font-medium text-black/60 hover:text-black transition">
              로그인
            </Link>
            <Link href="/register" className="font-medium text-white bg-[#1428A0] px-5 py-2 rounded-full hover:bg-[#0f1f80] transition">
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - 맛JOB GO 초대형 브랜드 타이포 */}
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        {/* 배경 그라데이션 + 광채 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d1340] to-[#0a0a0a]" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#1428A0]/30 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#7a8fff]/20 rounded-full blur-[140px]" />

        {/* 배경 워터마크 MATJOBGO */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          aria-hidden="true"
        >
          <span className="text-[24vw] md:text-[18vw] font-black text-white/[0.03] tracking-[-0.05em] leading-none whitespace-nowrap">
            MATJOBGO
          </span>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-8 pt-24 md:pt-28 pb-28 md:pb-32 text-center">
          <p className="text-[#7a8fff] text-[12px] md:text-[13px] font-bold tracking-[0.35em] uppercase mb-10 md:mb-12">
            RISE Track IV · Regional Innovation
          </p>

          {/* 맛 JOB GO 초대형 로고 타이포 */}
          <h1 className="font-black leading-[0.85] tracking-[-0.04em] flex flex-wrap items-baseline justify-center gap-x-4 md:gap-x-8">
            <span className="text-white text-[28vw] md:text-[220px] lg:text-[260px] xl:text-[300px]">
              맛
            </span>
            <span className="text-[22vw] md:text-[180px] lg:text-[210px] xl:text-[240px] bg-gradient-to-r from-white via-[#7a8fff] to-[#1428A0] bg-clip-text text-transparent">
              JOB
            </span>
            <span className="text-white text-[22vw] md:text-[180px] lg:text-[210px] xl:text-[240px]">
              GO
            </span>
          </h1>

          <h2 className="text-white text-[26px] md:text-[36px] font-bold leading-[1.15] tracking-tight mt-10 md:mt-14">
            전북의 맛을 품은
            <br />
            로컬 조리 인재
          </h2>
          <p className="text-white/50 text-[14px] md:text-[16px] leading-relaxed max-w-lg mx-auto mt-5">
            호원대학교와 전북 지역 외식산업을 연결하는
            <br />
            AI 기반 스마트 인재 매칭 플랫폼
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 md:mt-12">
            <Link href="/register?role=student" className="inline-flex items-center justify-center px-8 py-[14px] bg-white text-black text-[14px] font-semibold rounded-full hover:bg-white/90 transition shadow-2xl shadow-[#1428A0]/30">
              학생 시작하기
            </Link>
            <Link href="/register?role=company" className="inline-flex items-center justify-center px-8 py-[14px] bg-white/10 text-white text-[14px] font-semibold rounded-full border border-white/20 hover:bg-white/15 transition">
              기업 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Stats - 대비되는 화이트 섹션 */}
      <section className="bg-[#f6f6f6]">
        <div className="max-w-[1440px] mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/5 rounded-2xl overflow-hidden">
            {[
              { num: "24+", label: "교육 참여 학생" },
              { num: "6+", label: "협력 기업" },
              { num: "3+", label: "교육 프로그램" },
              { num: "85%", label: "매칭 만족도" },
            ].map((s) => (
              <div key={s.label} className="bg-white py-10 px-6 text-center">
                <div className="text-[36px] font-bold text-black tracking-tight">{s.num}</div>
                <div className="text-[13px] text-black/40 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About - 간결한 소개 */}
      <section className="bg-white" id="about">
        <div className="max-w-[1440px] mx-auto px-8 py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#1428A0] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">About</p>
            <h2 className="text-[36px] md:text-[44px] font-bold text-black leading-tight tracking-tight mb-6">
              간단한 3단계로<br />시작하세요
            </h2>
            <p className="text-black/40 text-[16px] leading-relaxed">
              회원가입부터 매칭, 소통까지. 직관적인 플랫폼이 연결합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 mt-20">
            {[
              {
                step: "01",
                title: "프로필 등록",
                desc: "학생 또는 기업으로 가입하고, 상세한 프로필을 완성하세요.",
              },
              {
                step: "02",
                title: "AI 매칭",
                desc: "알고리즘이 분석한 최적의 매칭 결과를 확인하고, 직접 탐색할 수도 있습니다.",
              },
              {
                step: "03",
                title: "소통 & 채용",
                desc: "플랫폼 내 메시지로 소통하고, 지원 또는 스카우트를 진행합니다.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative px-10 py-12 text-center group">
                {i < 2 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-black/8" />}
                <div className="text-[11px] font-bold text-[#1428A0] tracking-[0.2em] mb-5">{item.step}</div>
                <h3 className="text-[20px] font-bold text-black mb-3">{item.title}</h3>
                <p className="text-[14px] text-black/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - 삼성 스타일 풀폭 카드 */}
      <section className="bg-[#f6f6f6]" id="features">
        <div className="max-w-[1440px] mx-auto px-8 py-28">
          <div className="text-center mb-20">
            <p className="text-[#1428A0] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">Features</p>
            <h2 className="text-[36px] md:text-[44px] font-bold text-black leading-tight tracking-tight">
              세 주체를 위한 맞춤 기능
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* 학생 */}
            <div className="bg-white rounded-3xl p-10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
              <div className="w-14 h-14 bg-[#e8ecff] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                <Icon name="student" size={26} strokeWidth={1.75} className="text-[#1428A0]" />
              </div>
              <h3 className="text-[22px] font-bold text-black mb-1">학생</h3>
              <p className="text-[12px] text-[#1428A0] font-semibold mb-6">직업계고 재학생</p>
              <ul className="space-y-4">
                {["이력서 · 자기소개 등록", "희망 분야 · 지역 설정", "채용공고 탐색 및 지원", "AI 기반 기업 매칭", "기업과 실시간 메시지"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[14px] text-black/60">
                    <div className="w-5 h-5 rounded-full bg-[#f0f2ff] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-[#1428A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* 기업 */}
            <div className="bg-[#1428A0] rounded-3xl p-10 hover:shadow-2xl hover:shadow-[#1428A0]/20 transition-all duration-500 group">
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
                <Icon name="school" size={26} strokeWidth={1.75} className="text-[#1428A0]" />
              </div>
              <h3 className="text-[22px] font-bold text-black mb-1">대학</h3>
              <p className="text-[12px] text-[#1428A0] font-semibold mb-6">호원대학교 사업단</p>
              <ul className="space-y-4">
                {["매칭 현황 대시보드", "프로그램 등록 · 관리", "학생 · 기업 모니터링", "취업률 · 정주율 통계", "공지사항 관리"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[14px] text-black/60">
                    <div className="w-5 h-5 rounded-full bg-[#f0f2ff] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-[#1428A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
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
            <p className="text-[#1428A0] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">Programs</p>
            <h2 className="text-[36px] md:text-[44px] font-bold text-black leading-tight tracking-tight">
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
              <div key={f.name} className="bg-[#f6f6f6] hover:bg-[#eef0ff] rounded-2xl p-8 text-center transition-all duration-300 cursor-default group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={f.iconName} size={26} strokeWidth={1.75} className="text-[#1428A0]" />
                </div>
                <div className="text-[16px] font-bold text-black">{f.name}</div>
                <div className="text-[12px] text-black/35 mt-1.5">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* 부가 프로그램 */}
          <div className="mt-8 bg-[#0a0a0a] rounded-3xl p-10 md:p-14">
            <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <p className="text-white/30 text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Additional Programs</p>
                <h3 className="text-[24px] font-bold text-white mb-3">COOKING 브릿지 & 융합조리캠프</h3>
                <p className="text-white/40 text-[14px] leading-relaxed max-w-lg">
                  직업계고 학생 대상 조리대회 지도, 지역 · 타지역 고교 협력 융합형 조리캠프,
                  지역사회 김장봉사 등 다양한 비교과 프로그램을 운영합니다.
                </p>
              </div>
              <div className="flex gap-3">
                {[
                  { label: "조리대회", val: "진경여고" },
                  { label: "캠프", val: "40명" },
                  { label: "봉사", val: "김장" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/8 rounded-2xl px-6 py-5 text-center min-w-[90px]">
                    <div className="text-[18px] font-bold text-white">{item.val}</div>
                    <div className="text-[11px] text-white/35 mt-1">{item.label}</div>
                  </div>
                ))}
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
              <h2 className="text-white text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-tight mb-6">
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
                  <h3 className="font-bold text-black text-[15px] mb-2 leading-snug">
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
                      <span className="text-[11px] font-semibold text-black">오지호 · 호원대 3학년</span>
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
                  <h3 className="font-bold text-black text-[15px] mb-2 leading-snug">
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
                      <span className="text-[11px] font-semibold text-black">김민수 · 진경여고 3학년</span>
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
              <p className="text-[#1428A0] text-[12px] font-bold tracking-[0.25em] uppercase mb-5">Gallery</p>
              <h2 className="text-[36px] md:text-[44px] font-bold text-black leading-tight tracking-tight">
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
                  <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/20 transition-colors duration-500" />
                </a>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1428A0] hover:gap-3 transition-all"
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

      {/* CTA - 삼성 스타일 임팩트 CTA */}
      <section className="bg-[#1428A0]">
        <div className="max-w-[1440px] mx-auto px-8 py-28 text-center">
          <h2 className="text-[36px] md:text-[48px] font-bold text-white leading-tight tracking-tight mb-5">
            지금, 전북의 미래를
            <br />
            함께 만들어가세요
          </h2>
          <p className="text-white/50 text-[15px] mb-12 max-w-md mx-auto leading-relaxed">
            맛JobGO에서 조리 인재와 지역 기업을 연결하고,
            전북 외식산업의 새로운 가능성을 열어갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#1428A0] text-[14px] font-bold rounded-full hover:bg-white/90 transition">
              무료로 시작하기
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center px-10 py-4 bg-white/10 text-white text-[14px] font-semibold rounded-full border border-white/15 hover:bg-white/15 transition">
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto px-8 py-14">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="text-[20px] font-bold text-white mb-4">
                맛Job<span className="text-[#7a8fff]">GO</span>
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
            © 2025 맛JobGO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
