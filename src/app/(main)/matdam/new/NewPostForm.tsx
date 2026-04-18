"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { CATEGORY_META, CATEGORY_ORDER, MATDAM_COLORS } from "../_constants";

export default function NewPostForm() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("LEARNING");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const t = tagInput.trim().replace(/^#+/, "");
    if (!t || tags.includes(t) || tags.length >= 5) {
      setTagInput("");
      return;
    }
    setTags([...tags, t]);
    setTagInput("");
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    const res = await fetch("/api/posts/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setImages((prev) => [...prev, ...data.uploaded]);
    } else {
      setError("이미지 업로드 실패");
    }
    setUploading(false);
    e.target.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, content, tags, images }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/matdam/${data.post.id}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "등록 실패");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* 카테고리 선택 */}
      <div className="bg-white rounded-3xl border border-[#D97706]/10 p-6 md:p-8">
        <label
          className="block text-[12px] font-bold tracking-[0.2em] uppercase mb-4"
          style={{ color: MATDAM_COLORS.primary }}
        >
          카테고리
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="p-4 rounded-2xl border-2 transition flex flex-col items-center gap-2"
                style={
                  active
                    ? {
                        borderColor: MATDAM_COLORS.primary,
                        backgroundColor: MATDAM_COLORS.accentSoft,
                        color: MATDAM_COLORS.primaryDark,
                      }
                    : {
                        borderColor: "transparent",
                        backgroundColor: MATDAM_COLORS.accentBg,
                        color: "rgba(0,0,0,0.6)",
                      }
                }
              >
                <Icon name={meta.iconName} size={22} strokeWidth={1.75} />
                <div className="text-[12px] font-bold">{meta.label}</div>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-black/40 mt-3">
          {CATEGORY_META[category as keyof typeof CATEGORY_META]?.desc}
        </p>
      </div>

      {/* 제목 */}
      <div className="bg-white rounded-3xl border border-[#D97706]/10 p-6 md:p-8">
        <label
          className="block text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: MATDAM_COLORS.primary }}
        >
          제목
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="어떤 이야기인가요?"
          maxLength={200}
          className="w-full px-0 py-2 text-[22px] md:text-[26px] font-bold text-black placeholder:text-black/25 border-0 outline-none"
        />
        <div className="text-[11px] text-black/30 text-right">
          {title.length}/200
        </div>
      </div>

      {/* 내용 */}
      <div className="bg-white rounded-3xl border border-[#D97706]/10 p-6 md:p-8">
        <label
          className="block text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: MATDAM_COLORS.primary }}
        >
          내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="자유롭게 이야기를 적어주세요. 경험한 내용, 느낀 점, 궁금한 점 모두 환영합니다."
          rows={12}
          className="w-full px-0 py-2 text-[15px] text-black placeholder:text-black/25 leading-[1.8] border-0 outline-none resize-none"
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="bg-white rounded-3xl border border-[#D97706]/10 p-6 md:p-8">
        <label
          className="block text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: MATDAM_COLORS.primary }}
        >
          이미지 ({images.length})
        </label>
        <label
          className="block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition hover:bg-[#FFFBF0]"
          style={{ borderColor: `${MATDAM_COLORS.primary}30` }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2"
            style={{ backgroundColor: MATDAM_COLORS.accentSoft }}
          >
            <Icon
              name="camera"
              size={22}
              strokeWidth={1.75}
              style={{ color: MATDAM_COLORS.primary }}
            />
          </div>
          <p className="text-[13px] font-semibold text-black/70">
            {uploading ? "업로드 중..." : "클릭하여 이미지 추가"}
          </p>
          <p className="text-[11px] text-black/40 mt-1">
            JPG · PNG · WEBP (10MB 이하, 여러 장 가능)
          </p>
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {images.map((src) => (
              <div
                key={src}
                className="relative aspect-square rounded-xl overflow-hidden bg-[#f6f6f6] group"
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((x) => x !== src))
                  }
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-[#0a0a0a]/80 text-white rounded-full text-[11px] font-bold opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 태그 */}
      <div className="bg-white rounded-3xl border border-[#D97706]/10 p-6 md:p-8">
        <label
          className="block text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: MATDAM_COLORS.primary }}
        >
          태그 (선택, 최대 5개)
        </label>
        <div className="flex gap-2 flex-wrap items-center">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[12px] px-3 py-1 rounded-full font-medium inline-flex items-center gap-1.5"
              style={{
                backgroundColor: MATDAM_COLORS.accentSoft,
                color: MATDAM_COLORS.primaryDark,
              }}
            >
              #{t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="font-bold opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            onBlur={addTag}
            placeholder="태그 입력 후 Enter"
            className="flex-1 min-w-[160px] px-3 py-1.5 text-[12px] rounded-full outline-none focus:bg-white focus:ring-2 focus:ring-[#D97706]/20"
            style={{ backgroundColor: MATDAM_COLORS.accentBg }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-5 py-4 rounded-2xl text-[13px] font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white text-black/60 rounded-full text-[13px] font-semibold border border-black/10 hover:bg-[#FFFBF0] transition"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          className="px-8 py-3 text-white rounded-full text-[13px] font-semibold transition disabled:opacity-50"
          style={{ backgroundColor: MATDAM_COLORS.primary }}
        >
          {submitting ? "등록 중..." : "게시하기"}
        </button>
      </div>
    </form>
  );
}
