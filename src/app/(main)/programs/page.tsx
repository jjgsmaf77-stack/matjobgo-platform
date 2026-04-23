import { prisma } from "@/lib/prisma";
import { readdir } from "fs/promises";
import path from "path";

// 메인페이지와 동일한 단색 팔레트로 통일.
// 카테고리 구분은 색상 대신 라벨과 테두리로 표현.
const CATEGORY_LABELS: Record<string, string> = {
  ON_D_GOURMET: "On-D-Gourmet",
  COOKING_BRIDGE: "COOKING 브릿지",
  CAMP: "융합조리캠프",
  VOLUNTEER: "사회봉사",
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  UPCOMING: {
    label: "예정",
    cls: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/10",
  },
  ONGOING: {
    label: "진행 중",
    cls: "bg-[#DC2626] text-white border-[#DC2626]",
  },
  COMPLETED: {
    label: "완료",
    cls: "bg-[#f6f6f6] text-black/40 border-black/5",
  },
};

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

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });
  const galleryImages = await getGalleryImages();

  const highlightPrograms = [
    {
      step: "01",
      title: "On-D-Gourmet",
      desc: "전북 도내 외식업체에서 실제 판매하는 메뉴를 중심으로 한 취업지원 프로그램",
      bullets: [
        "명장-카페·베이커리 과정",
        "K-로컬 아시안 퀴진 과정",
        "양식조리 & 사퀴테리 과정",
      ],
    },
    {
      step: "02",
      title: "COOKING 브릿지",
      desc: "직업계고 교사 직무연수 및 학생 심화교육 프로그램",
      bullets: [
        "조리 교사 직무연수 지원",
        "NCS 국가직무표준능력 고도화",
        "조리 분야 융합전공능력 극대화",
      ],
    },
    {
      step: "03",
      title: "융합조리캠프",
      desc: "지역·타지역 고교 협력 융합형 조리캠프",
      bullets: [
        "전북 외식문화 기술 교류",
        "하이브리드 조리대회 개최",
        "인재 유입 기반 마련",
      ],
    },
    {
      step: "04",
      title: "지역 사회봉사",
      desc: "지역 밀착형 봉사 프로그램으로 사회 기여",
      bullets: [
        "김장봉사 활동",
        "지역 어르신 식사 봉사",
        "지역 정주의식 제고",
      ],
    },
  ];

  return (
    <div className="bg-[#FFFBF5]">
      {/* 헤더 - Research 페이지와 동일 구조 */}
      <section className="relative bg-white border-b border-[#DC2626]/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-[#DC2626]" />
        <div className="absolute top-0 right-40 md:right-64 w-2 md:w-3 h-40 md:h-64 bg-[#D4A574]" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 pt-14 md:pt-28 pb-12 md:pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4A574]" />
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.35em] uppercase">
              Programs · 교육 프로그램
            </p>
          </div>
          <h1 className="font-sans-ko text-[30px] sm:text-[38px] md:text-[52px] lg:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight max-w-3xl">
            실전 기반의<br />
            <span className="text-[#DC2626]">전문 조리 교육</span>
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            호원대학교 RISE사업단이 <span className="font-bold text-[#991B1B]">전북 직업계고 학생</span>과 함께 만든
            <span className="font-bold text-[#991B1B]"> 네 개의 프로그램 트랙</span>.
            실제 외식업체 메뉴 기반 교육부터 지역 봉사까지 다양한 경험을 제공합니다.
          </p>
        </div>
      </section>

      {/* 4대 프로그램 카드 */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-8 py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-px bg-black/5 rounded-3xl overflow-hidden">
            {highlightPrograms.map((p) => (
              <div
                key={p.step}
                className="bg-white p-10 md:p-12 hover:bg-[#f6f6f6] transition-colors duration-300"
              >
                <div className="text-[11px] font-bold text-[#DC2626] tracking-[0.25em] mb-5">
                  {p.step}
                </div>
                <h3 className="font-sans-ko text-[24px] font-bold text-[#991B1B] mb-3 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-[14px] text-black/50 leading-relaxed mb-6">
                  {p.desc}
                </p>
                <ul className="space-y-3">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-3 text-[13px] text-black/60"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                        <svg
                          className="w-2.5 h-2.5 text-[#DC2626]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 교육 결과물 갤러리 */}
      {galleryImages.length > 0 && (
        <section className="bg-[#f6f6f6]">
          <div className="max-w-[1440px] mx-auto px-8 py-20 md:py-24">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-[#DC2626] text-[12px] font-bold tracking-[0.25em] uppercase mb-3">
                  Gallery
                </p>
                <h2 className="font-sans-ko text-[28px] md:text-[36px] font-bold text-[#991B1B] leading-tight tracking-tight">
                  교육 결과물
                </h2>
                <p className="text-black/40 text-[14px] mt-2">
                  On-D-Gourmet 교육 참여 학생들의 조리 실습 결과물
                </p>
              </div>
              <span className="bg-white border border-black/5 text-black/60 px-4 py-1.5 rounded-full text-[12px] font-medium">
                총 {galleryImages.length}점
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {galleryImages.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block aspect-square bg-white rounded-2xl overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`교육 결과물 ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 프로그램 일정 */}
      {programs.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1440px] mx-auto px-8 py-20 md:py-24">
            <div className="mb-10">
              <p className="text-[#DC2626] text-[12px] font-bold tracking-[0.25em] uppercase mb-3">
                Timeline
              </p>
              <h2 className="font-sans-ko text-[28px] md:text-[36px] font-bold text-[#991B1B] leading-tight tracking-tight">
                프로그램 일정
              </h2>
              <p className="text-black/40 text-[14px] mt-2">
                총 {programs.length}건의 교육 프로그램
              </p>
            </div>

            <div className="divide-y divide-black/5 border-y border-black/5">
              {programs.map((program) => {
                const meta =
                  STATUS_META[program.status] || STATUS_META.COMPLETED;
                const catLabel =
                  CATEGORY_LABELS[program.category] || program.category;
                return (
                  <div
                    key={program.id}
                    className="py-7 md:py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 hover:bg-[#f6f6f6]/60 transition-colors -mx-4 md:-mx-6 px-4 md:px-6 rounded-xl"
                  >
                    <div className="md:w-40 shrink-0 flex md:flex-col items-start gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.cls}`}
                      >
                        {meta.label}
                      </span>
                      <span className="text-[11px] font-bold text-[#DC2626] tracking-[0.2em] uppercase">
                        {catLabel}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#991B1B] text-[17px] md:text-[18px] tracking-tight">
                        {program.title}
                      </h3>
                      {program.description && (
                        <p className="text-black/50 text-[13.5px] mt-2 leading-relaxed">
                          {program.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-5 mt-3 text-[12.5px] text-black/40">
                        {program.schedule && (
                          <span className="inline-flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {program.schedule}
                          </span>
                        )}
                        {program.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {program.location}
                          </span>
                        )}
                        {program.maxParticipants && (
                          <span className="inline-flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            최대 {program.maxParticipants}명
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
