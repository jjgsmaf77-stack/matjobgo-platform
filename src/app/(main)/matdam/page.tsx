import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  MATDAM_COLORS,
  parseImages,
  parseTags,
  authorBadge,
  type MatdamCategory,
} from "./_constants";

export default async function MatdamPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = (sp.category || "ALL") as "ALL" | MatdamCategory;
  const sort = sp.sort === "popular" ? "popular" : "recent";
  const query = sp.q?.trim() || "";

  const where: any = {};
  if (category !== "ALL") where.category = category;
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { content: { contains: query } },
    ];
  }

  const orderBy: any =
    sort === "popular"
      ? [{ isPinned: "desc" }, { likeCount: "desc" }, { createdAt: "desc" }]
      : [{ isPinned: "desc" }, { createdAt: "desc" }];

  const [posts, stats] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            student: { select: { studentType: true, isMentor: true } },
          },
        },
      },
      orderBy,
      take: 50,
    }),
    prisma.post.groupBy({
      by: ["category"],
      _count: { _all: true },
    }),
  ]);

  const countMap = new Map<string, number>();
  for (const row of stats) countMap.set(row.category, row._count._all);
  const totalCount = stats.reduce((acc, r) => acc + r._count._all, 0);

  return (
    <div style={{ backgroundColor: MATDAM_COLORS.accentBg }}>
      {/* 헤더 - 카테고리별 동적 히어로 (Warm Amber 테마) */}
      <section
        className="relative overflow-hidden transition-colors duration-500"
        style={{
          background:
            category === "ALL"
              ? MATDAM_COLORS.bgHeroDark
              : `linear-gradient(135deg, ${MATDAM_COLORS.bgHeroDark} 0%, ${CATEGORY_META[category].accent}55 60%, ${MATDAM_COLORS.bgHeroDark} 100%)`,
        }}
      >
        {/* 배경 그라데이션 (ALL 기본) */}
        {category === "ALL" && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${MATDAM_COLORS.bgHeroDark} 0%, ${MATDAM_COLORS.bgHeroMid} 50%, ${MATDAM_COLORS.bgHeroDark} 100%)`,
            }}
          />
        )}
        {/* 광채 */}
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500"
          style={{
            backgroundColor:
              category === "ALL"
                ? `${MATDAM_COLORS.primary}40`
                : `${CATEGORY_META[category].accent}50`,
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500"
          style={{
            backgroundColor:
              category === "ALL"
                ? `${MATDAM_COLORS.accent}30`
                : `${CATEGORY_META[category].accent}40`,
          }}
        />

        {/* 배경 초대형 워터마크 */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          aria-hidden="true"
        >
          <span
            key={category}
            className="text-[28vw] md:text-[22vw] font-black text-white/[0.035] tracking-[-0.05em] leading-none whitespace-nowrap"
          >
            {category === "ALL" ? "MATDAM" : CATEGORY_META[category].english}
          </span>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-8 pt-20 md:pt-28 pb-16 md:pb-20">
          {category === "ALL" ? (
            // === 전체 뷰 ===
            <>
              <p
                className="text-[12px] md:text-[13px] font-bold tracking-[0.35em] uppercase mb-8 md:mb-10"
                style={{ color: MATDAM_COLORS.accentLight }}
              >
                맛JobGO · Community
              </p>
              <h1 className="text-white font-black leading-[0.88] tracking-[-0.04em]">
                <span className="block text-[22vw] md:text-[240px] lg:text-[280px] xl:text-[320px]">
                  맛담
                </span>
                <span
                  className="block text-[14vw] md:text-[130px] lg:text-[160px] xl:text-[184px] bg-clip-text text-transparent mt-1 md:mt-2"
                  style={{
                    backgroundImage: `linear-gradient(90deg, #ffffff, ${MATDAM_COLORS.accentLight}, #ffffff)`,
                  }}
                >
                  MATDAM
                </span>
              </h1>
            </>
          ) : (
            // === 카테고리 뷰 ===
            <>
              <div className="flex items-center gap-3 mb-8 md:mb-10 flex-wrap">
                <Link
                  href="/matdam"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase transition backdrop-blur-sm"
                >
                  <Icon name="arrow-left" size={12} strokeWidth={3} />
                  맛담 전체
                </Link>
                <span className="text-white/40 text-[12px] md:text-[13px] font-bold tracking-[0.3em] uppercase">
                  Matdam · Category
                </span>
              </div>

              {/* 카테고리 아이콘 (SVG, 중형) */}
              <div
                className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl mb-6 md:mb-8 backdrop-blur-sm"
                style={{
                  backgroundColor: `${CATEGORY_META[category].accent}30`,
                  border: `1px solid ${CATEGORY_META[category].accent}50`,
                }}
              >
                <Icon
                  name={CATEGORY_META[category].iconName}
                  size={40}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </div>

              {/* 한글 카테고리 이름 초대형 */}
              {(() => {
                const label = CATEGORY_META[category].label;
                const english = CATEGORY_META[category].english;
                const isLongKo = label.length >= 6;
                const isLongEn = english.length >= 9;

                const koSize = isLongKo
                  ? "text-[13vw] md:text-[120px] lg:text-[150px] xl:text-[180px]"
                  : "text-[18vw] md:text-[180px] lg:text-[220px] xl:text-[260px]";
                const enSize = isLongEn
                  ? "text-[8vw] md:text-[70px] lg:text-[85px] xl:text-[100px]"
                  : "text-[10vw] md:text-[90px] lg:text-[110px] xl:text-[130px]";

                return (
                  <h1
                    key={category}
                    className="text-white font-black leading-[0.88] tracking-[-0.04em] overflow-hidden"
                  >
                    <span className={`block whitespace-nowrap ${koSize}`}>
                      {label}
                    </span>
                    <span
                      className={`block whitespace-nowrap mt-1 md:mt-2 bg-clip-text text-transparent ${enSize}`}
                      style={{
                        backgroundImage: `linear-gradient(90deg, #ffffff, ${CATEGORY_META[category].accent}, #ffffff)`,
                      }}
                    >
                      {english}
                    </span>
                  </h1>
                );
              })()}
            </>
          )}

          <div className="flex items-end justify-between flex-wrap gap-6 mt-10 md:mt-14">
            <div className="max-w-xl">
              <h2 className="text-white text-[22px] md:text-[30px] font-bold leading-[1.2] tracking-tight">
                {category === "ALL" ? (
                  <>
                    고등학생과 대학생이
                    <br />
                    이야기를 나누는 공간
                  </>
                ) : (
                  CATEGORY_META[category].tagline
                )}
              </h2>
              <p className="text-white/50 text-[13px] md:text-[14px] mt-4 leading-relaxed">
                {category === "ALL" ? (
                  <>
                    학습경험 · 프로그램 후기 · 교육과정 · 사회공헌 · 진로고민 ·
                    노하우 · 레시피
                    <br />
                    7개 카테고리로 자유롭게 공유하고 선배에게 멘토링을 받아보세요
                  </>
                ) : (
                  <>
                    {CATEGORY_META[category].desc} · 현재{" "}
                    <span className="text-white font-semibold">
                      {countMap.get(category) || 0}
                    </span>
                    건의 이야기가 있어요
                  </>
                )}
              </p>
            </div>
            <Link
              href="/matdam/new"
              className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-full text-[14px] font-semibold transition shadow-2xl"
              style={{
                backgroundColor: MATDAM_COLORS.primary,
                boxShadow: `0 20px 40px -10px ${MATDAM_COLORS.primary}80`,
              }}
            >
              <Icon name="plus" size={16} strokeWidth={2.5} />
              새 글 쓰기
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 + 검색 + 정렬 */}
      <section
        className="border-b sticky top-14 z-30"
        style={{
          backgroundColor: MATDAM_COLORS.accentBg,
          borderColor: `${MATDAM_COLORS.primary}15`,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8 py-5">
          <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1 -mx-1 px-1 scrollbar-hide">
            <CategoryChip
              href={buildHref({ category: "ALL", sort, q: query })}
              active={category === "ALL"}
              label={`전체 · ${totalCount}`}
            />
            {CATEGORY_ORDER.map((cat) => (
              <CategoryChipWithIcon
                key={cat}
                href={buildHref({ category: cat, sort, q: query })}
                active={category === cat}
                iconName={CATEGORY_META[cat].iconName}
                label={`${CATEGORY_META[cat].label} · ${countMap.get(cat) || 0}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <form method="GET" className="flex-1 min-w-[240px] max-w-md">
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="sort" value={sort} />
              <input
                name="q"
                defaultValue={query}
                placeholder="제목 · 내용 검색"
                className="w-full px-4 py-2.5 bg-white border border-transparent rounded-full text-[13px] focus:border-[#D97706]/40 focus:ring-2 focus:ring-[#D97706]/15 outline-none transition"
              />
            </form>
            <div
              className="flex gap-1 rounded-full p-1"
              style={{ backgroundColor: "#fff" }}
            >
              <Link
                href={buildHref({ category, sort: "recent", q: query })}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition ${
                  sort === "recent"
                    ? "text-white"
                    : "text-black/50 hover:text-black"
                }`}
                style={
                  sort === "recent"
                    ? { backgroundColor: MATDAM_COLORS.primary }
                    : {}
                }
              >
                최신순
              </Link>
              <Link
                href={buildHref({ category, sort: "popular", q: query })}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition ${
                  sort === "popular"
                    ? "text-white"
                    : "text-black/50 hover:text-black"
                }`}
                style={
                  sort === "popular"
                    ? { backgroundColor: MATDAM_COLORS.primary }
                    : {}
                }
              >
                인기순
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 포스트 목록 */}
      <section
        className="min-h-[60vh]"
        style={{ backgroundColor: MATDAM_COLORS.accentBg }}
      >
        <div className="max-w-[1440px] mx-auto px-8 py-10">
          {posts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#D97706]/10 p-16 text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-5 inline-flex items-center justify-center"
                style={{ backgroundColor: MATDAM_COLORS.accentSoft }}
              >
                <Icon
                  name="chat"
                  size={28}
                  strokeWidth={1.5}
                  style={{ color: MATDAM_COLORS.primary }}
                />
              </div>
              <h3 className="text-[18px] font-bold text-black mb-2">
                아직 이 주제로 쓴 글이 없어요
              </h3>
              <p className="text-[14px] text-black/50 mb-6">
                첫 번째로 이야기를 나눠보세요
              </p>
              <Link
                href="/matdam/new"
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full text-[13px] font-semibold transition"
                style={{ backgroundColor: MATDAM_COLORS.primary }}
              >
                <Icon name="plus" size={14} strokeWidth={2.5} />새 글 쓰기
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => {
                const cat = CATEGORY_META[post.category as MatdamCategory];
                const images = parseImages(post.images);
                const tags = parseTags(post.tags);
                const badge = authorBadge(
                  post.author?.role,
                  post.author?.student || null
                );
                return (
                  <Link
                    key={post.id}
                    href={`/matdam/${post.id}`}
                    className="group bg-white rounded-3xl border border-[#D97706]/8 overflow-hidden hover:shadow-lg hover:shadow-[#D97706]/10 hover:border-[#D97706]/20 transition-all duration-300"
                  >
                    {images[0] && (
                      <div
                        className="aspect-[16/10] overflow-hidden"
                        style={{ backgroundColor: MATDAM_COLORS.accentSoft }}
                      >
                        <img
                          src={images[0]}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {post.isPinned && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{
                              backgroundColor: "#FEE2E2",
                              color: "#B91C1C",
                            }}
                          >
                            <Icon name="pin" size={10} strokeWidth={2.5} />
                            고정
                          </span>
                        )}
                        <span
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: MATDAM_COLORS.accentSoft,
                            color: MATDAM_COLORS.primaryDark,
                          }}
                        >
                          <Icon
                            name={cat?.iconName || "book"}
                            size={10}
                            strokeWidth={2.5}
                          />
                          {cat?.label}
                        </span>
                        {post.isMentorAnswer && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                            style={{ backgroundColor: MATDAM_COLORS.primary }}
                          >
                            멘토 답변
                          </span>
                        )}
                      </div>
                      <h3 className="text-[16px] font-bold text-black mb-2 line-clamp-2 leading-snug group-hover:text-[#D97706] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[13px] text-black/50 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-2 py-0.5 rounded font-medium"
                              style={{
                                backgroundColor: MATDAM_COLORS.accentSoft,
                                color: MATDAM_COLORS.primaryDark,
                              }}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${badge.cls} text-[10px] px-2 py-0.5 rounded-full font-bold`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-[12px] text-black/40 font-medium">
                            {post.author?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-black/40">
                          <span className="inline-flex items-center gap-1">
                            <Icon name="eye" size={12} strokeWidth={1.75} />
                            {post.viewCount}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="heart" size={12} strokeWidth={1.75} />
                            {post.likeCount}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="chat" size={12} strokeWidth={1.75} />
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function CategoryChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition shrink-0"
      style={
        active
          ? { backgroundColor: MATDAM_COLORS.primary, color: "white" }
          : { backgroundColor: "white", color: "rgba(0,0,0,0.6)" }
      }
    >
      {label}
    </Link>
  );
}

function CategoryChipWithIcon({
  href,
  active,
  label,
  iconName,
}: {
  href: string;
  active: boolean;
  label: string;
  iconName: import("@/components/Icon").IconName;
}) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition shrink-0"
      style={
        active
          ? { backgroundColor: MATDAM_COLORS.primary, color: "white" }
          : { backgroundColor: "white", color: "rgba(0,0,0,0.6)" }
      }
    >
      <Icon name={iconName} size={14} strokeWidth={2} />
      {label}
    </Link>
  );
}

function buildHref({
  category,
  sort,
  q,
}: {
  category: string;
  sort: string;
  q: string;
}) {
  const params = new URLSearchParams();
  if (category !== "ALL") params.set("category", category);
  if (sort !== "recent") params.set("sort", sort);
  if (q) params.set("q", q);
  const s = params.toString();
  return s ? `/matdam?${s}` : "/matdam";
}
