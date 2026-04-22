"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GalleryImage {
  name: string;
  url: string;
}

export default function GalleryManager({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage(`${files.length}장 업로드 완료`);
      router.refresh();
    } else {
      setMessage("업로드 실패");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`"${name}"을 삭제하시겠습니까?`)) return;
    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setImages(images.filter((img) => img.name !== name));
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-gray-900 mb-4">새 사진 업로드</h2>
        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#EF4444] hover:bg-[#FEF2F2] transition">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FEE2E2] rounded-2xl mb-3">
            <svg className="w-6 h-6 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <p className="font-medium text-gray-700">
            {uploading ? "업로드 중..." : "클릭 또는 파일을 드래그하세요"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            JPG, PNG, WEBP (여러 장 선택 가능)
          </p>
        </label>
        {message && (
          <p
            className={`mt-3 text-sm font-medium ${
              message.includes("실패")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-gray-900 mb-4">
          등록된 사진 ({images.length}장)
        </h2>
        {images.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            등록된 사진이 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.name}
                className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-3">
                  <p className="text-white text-xs truncate w-full text-center">
                    {img.name}
                  </p>
                  <button
                    onClick={() => handleDelete(img.name)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
