import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  CATEGORY_META,
  MATDAM_COLORS,
  parseImages,
  parseTags,
  authorBadge,
  type MatdamCategory,
} from "../_constants";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session ? ((session.user as any).id as string) : null;
  const role = session ? ((session.user as any).role as string) : null;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          student: {
            select: {
              studentType: true,
              school: true,
              major: true,
              isMentor: true,
            },
          },
        },
      },
    },
  });
  if (!post) notFound();

  // 조회수 +1
  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  const [liked, bookmarked] = userId
    ? await Promise.all([
        prisma.postLike.findUnique({
          where: { postId_userId: { postId: id, userId } },
        }),
        prisma.bookmark.findUnique({
          where: { postId_userId: { postId: id, userId } },
        }),
      ])
    : [null, null];

  const images = parseImages(post.images);
  const tags = parseTags(post.tags);
  const cat = CATEGORY_META[post.category as MatdamCategory];
  const badge = authorBadge(
    post.author?.role,
    post.author?.student || null
  );

  const canEdit = userId && (post.authorId === userId || role === "ADMIN");

  const authorSub = [
    post.author?.student?.school,
    post.author?.student?.major,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen" style={{ backgroundColor: MATDAM_COLORS.accentBg }}>
      <article className="max-w-[860px] mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* 뒤로가기 */}
        <Link
          href="/matdam"
          className="inline-flex items-center gap-1.5 text-[13px] text-black/50 hover:text-black mb-6 transition"
        >
          <Icon name="arrow-left" size={16} strokeWidth={2} />
          목록
        </Link>

        {/* 메인 카드 */}
        <div className="bg-white rounded-3xl border border-[#D97706]/10 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* 메타 */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {post.isPinned && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-bold"
                  style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                >
                  <Icon name="pin" size={11} strokeWidth={2.5} />
                  고정
                </span>
              )}
              <span
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold"
                style={{
                  backgroundColor: MATDAM_COLORS.accentSoft,
                  color: MATDAM_COLORS.primaryDark,
                }}
              >
                <Icon name={cat?.iconName || "book"} size={11} strokeWidth={2.5} />
                {cat?.label}
              </span>
              {post.isMentorAnswer && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-bold text-white"
                  style={{ backgroundColor: MATDAM_COLORS.primary }}
                >
                  멘토 답변
                </span>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-[24px] md:text-[32px] font-bold text-black leading-[1.25] tracking-tight">
              {post.title}
            </h1>

            {/* 작성자 + 메타 */}
            <div className="flex items-center justify-between flex-wrap gap-3 mt-6 pb-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${MATDAM_COLORS.primary}, ${MATDAM_COLORS.accent})`,
                  }}
                >
                  {post.author?.name?.[0] || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-[14px]">
                      {post.author?.name}
                    </span>
                    <span
                      className={`${badge.cls} text-[10px] px-2 py-0.5 rounded-full font-bold`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  {authorSub && (
                    <div className="text-[12px] text-black/40 mt-0.5">
                      {authorSub}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-black/40">
                <span>
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="eye" size={13} strokeWidth={1.75} />
                  {post.viewCount + 1}
                </span>
              </div>
            </div>

            {/* 본문 */}
            <div className="mt-8 text-[15.5px] text-black/80 leading-[1.85] whitespace-pre-wrap">
              {post.content}
            </div>

            {/* 이미지 */}
            {images.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((src, i) => (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl overflow-hidden aspect-[4/3]"
                    style={{ backgroundColor: MATDAM_COLORS.accentSoft }}
                  >
                    <img
                      src={src}
                      alt={`첨부 ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            )}

            {/* 태그 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-[12px] px-3 py-1 rounded-full font-medium"
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

            {/* 액션 (좋아요/북마크/공유/편집) */}
            <div className="mt-10 pt-6 border-t border-black/5">
              <PostActions
                postId={post.id}
                authorUserId={post.author?.id || ""}
                initialLiked={!!liked}
                initialBookmarked={!!bookmarked}
                likeCount={post.likeCount}
                isLoggedIn={!!userId}
                canEdit={!!canEdit}
              />
            </div>
          </div>
        </div>

        {/* 댓글 */}
        <div className="mt-8">
          <CommentSection
            postId={post.id}
            currentUserId={userId}
            currentRole={role}
          />
        </div>
      </article>
    </div>
  );
}
