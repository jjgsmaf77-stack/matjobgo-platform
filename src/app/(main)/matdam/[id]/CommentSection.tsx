"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authorBadge, MATDAM_COLORS } from "../_constants";

interface CommentAuthor {
  id: string;
  name: string;
  role: string;
  student?: { studentType?: string | null; isMentor?: boolean | null } | null;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: CommentAuthor;
  parentId: string | null;
  createdAt: string;
  replies?: Comment[];
}

export default function CommentSection({
  postId,
  currentUserId,
  currentRole,
}: {
  postId: string;
  currentUserId: string | null;
  currentRole: string | null;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const load = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent("");
      await load();
    }
    setSubmitting(false);
  };

  const submitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, parentId }),
    });
    if (res.ok) {
      setReplyContent("");
      setReplyTo(null);
      await load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  };

  const totalCount =
    comments.length +
    comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-[#D97706]/10 p-8 md:p-10">
      <h2 className="text-[18px] font-bold text-black tracking-tight mb-6">
        댓글 {totalCount}
      </h2>

      {currentUserId ? (
        <form onSubmit={submit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="생각을 나눠주세요"
            rows={3}
            className="w-full px-5 py-4 border-2 border-transparent rounded-2xl text-[14px] focus:bg-white focus:border-[#D97706]/30 outline-none resize-none transition leading-relaxed"
            style={{ backgroundColor: MATDAM_COLORS.accentBg }}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="text-white px-6 py-2.5 rounded-full text-[13px] font-semibold transition disabled:opacity-50"
              style={{ backgroundColor: MATDAM_COLORS.primary }}
            >
              {submitting ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      ) : (
        <div
          className="mb-8 rounded-2xl p-6 text-center"
          style={{ backgroundColor: MATDAM_COLORS.accentBg }}
        >
          <p className="text-[13px] text-black/50 mb-3">
            로그인하고 의견을 남겨보세요
          </p>
          <Link
            href="/login"
            className="inline-block text-white px-5 py-2 rounded-full text-[12px] font-semibold transition"
            style={{ backgroundColor: MATDAM_COLORS.primary }}
          >
            로그인
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-[13px] text-black/40">
          불러오는 중...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-[13px] text-black/40">
          첫 번째 댓글의 주인공이 되어주세요
        </div>
      ) : (
        <ul className="divide-y divide-black/5">
          {comments.map((c) => {
            const badge = authorBadge(c.author.role, c.author.student || null);
            const canDelete =
              currentUserId === c.authorId || currentRole === "ADMIN";
            return (
              <li key={c.id} className="py-5">
                <CommentRow
                  c={c}
                  badge={badge}
                  canDelete={canDelete}
                  onDelete={handleDelete}
                  onReply={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  replyOpen={replyTo === c.id}
                  replyContent={replyContent}
                  onReplyContent={setReplyContent}
                  onSubmitReply={() => submitReply(c.id)}
                  isLoggedIn={!!currentUserId}
                />
                {c.replies && c.replies.length > 0 && (
                  <ul
                    className="mt-4 ml-10 md:ml-12 pl-5 border-l-2 space-y-4"
                    style={{ borderColor: MATDAM_COLORS.accentSoft }}
                  >
                    {c.replies.map((r) => {
                      const rBadge = authorBadge(
                        r.author.role,
                        r.author.student || null
                      );
                      const rCanDelete =
                        currentUserId === r.authorId ||
                        currentRole === "ADMIN";
                      return (
                        <li key={r.id}>
                          <CommentRow
                            c={r}
                            badge={rBadge}
                            canDelete={rCanDelete}
                            onDelete={handleDelete}
                            isReply
                            isLoggedIn={!!currentUserId}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CommentRow({
  c,
  badge,
  canDelete,
  onDelete,
  onReply,
  replyOpen,
  replyContent,
  onReplyContent,
  onSubmitReply,
  isReply,
  isLoggedIn,
}: {
  c: Comment;
  badge: { label: string; cls: string };
  canDelete: boolean;
  onDelete: (id: string) => void;
  onReply?: () => void;
  replyOpen?: boolean;
  replyContent?: string;
  onReplyContent?: (v: string) => void;
  onSubmitReply?: () => void;
  isReply?: boolean;
  isLoggedIn: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div
          className={`${
            isReply ? "w-8 h-8 text-[13px]" : "w-9 h-9 text-[14px]"
          } rounded-full flex items-center justify-center text-white font-bold shrink-0`}
          style={{
            background: `linear-gradient(135deg, ${MATDAM_COLORS.primary}, ${MATDAM_COLORS.accent})`,
          }}
        >
          {c.author.name?.[0] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-black text-[13px]">
              {c.author.name}
            </span>
            <span
              className={`${badge.cls} text-[10px] px-2 py-0.5 rounded-full font-bold`}
            >
              {badge.label}
            </span>
            <span className="text-[11px] text-black/40">
              {formatTime(c.createdAt)}
            </span>
          </div>
          <p className="text-[14px] text-black/80 mt-1.5 leading-relaxed whitespace-pre-wrap">
            {c.content}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {!isReply && isLoggedIn && onReply && (
              <button
                onClick={onReply}
                className="text-[11px] text-black/40 hover:text-[#1428A0] font-medium"
              >
                답글
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(c.id)}
                className="text-[11px] text-black/40 hover:text-red-500 font-medium"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
      {replyOpen && !isReply && onReplyContent && onSubmitReply && (
        <div className="mt-3 ml-12">
          <textarea
            value={replyContent || ""}
            onChange={(e) => onReplyContent(e.target.value)}
            placeholder="답글 작성"
            rows={2}
            className="w-full px-4 py-3 border-2 border-transparent rounded-2xl text-[13px] focus:bg-white focus:border-[#D97706]/30 outline-none resize-none"
            style={{ backgroundColor: MATDAM_COLORS.accentBg }}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={onSubmitReply}
              disabled={!replyContent?.trim()}
              className="text-white px-4 py-1.5 rounded-full text-[12px] font-semibold transition disabled:opacity-50"
              style={{ backgroundColor: MATDAM_COLORS.primary }}
            >
              답글 등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return date.toLocaleDateString("ko-KR");
}
