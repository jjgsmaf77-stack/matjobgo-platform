"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { MATDAM_COLORS } from "../_constants";

export default function PostActions({
  postId,
  authorUserId,
  initialLiked,
  initialBookmarked,
  likeCount,
  isLoggedIn,
  canEdit,
}: {
  postId: string;
  authorUserId: string;
  initialLiked: boolean;
  initialBookmarked: boolean;
  likeCount: number;
  isLoggedIn: boolean;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [count, setCount] = useState(likeCount);
  const [busy, setBusy] = useState(false);

  const toggleLike = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (busy) return;
    setBusy(true);
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    }
    setBusy(false);
  };

  const toggleBookmark = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/posts/${postId}/bookmark`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarked(data.bookmarked);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/matdam");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLike}
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition disabled:opacity-50"
          style={
            liked
              ? { backgroundColor: MATDAM_COLORS.primary, color: "white" }
              : {
                  backgroundColor: MATDAM_COLORS.accentSoft,
                  color: MATDAM_COLORS.primaryDark,
                }
          }
        >
          <Icon
            name={liked ? "heart-filled" : "heart"}
            size={15}
            strokeWidth={2}
          />
          <span>좋아요 {count}</span>
        </button>
        <button
          onClick={toggleBookmark}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition"
          style={
            bookmarked
              ? { backgroundColor: MATDAM_COLORS.bgHeroDark, color: "white" }
              : {
                  backgroundColor: MATDAM_COLORS.accentSoft,
                  color: MATDAM_COLORS.primaryDark,
                }
          }
        >
          <Icon
            name={bookmarked ? "bookmark-filled" : "bookmark"}
            size={15}
            strokeWidth={2}
          />
          <span>{bookmarked ? "저장됨" : "저장"}</span>
        </button>
        {isLoggedIn && authorUserId && (
          <Link
            href={`/messages?to=${authorUserId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition"
            style={{
              backgroundColor: MATDAM_COLORS.accentSoft,
              color: MATDAM_COLORS.primaryDark,
            }}
          >
            <Icon name="mail" size={15} strokeWidth={2} />
            쪽지 보내기
          </Link>
        )}
      </div>
      {canEdit && (
        <div className="flex items-center gap-2">
          <Link
            href={`/matdam/${postId}/edit`}
            className="text-[12px] text-black/60 hover:text-[#D97706] font-medium"
          >
            수정
          </Link>
          <span className="text-black/10">|</span>
          <button
            onClick={handleDelete}
            className="text-[12px] text-black/60 hover:text-red-600 font-medium"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
