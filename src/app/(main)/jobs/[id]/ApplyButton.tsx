"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ApplyButton({
  jobId,
  isLoggedIn,
  isStudent,
  alreadyApplied,
  companyUserId,
}: {
  jobId: string;
  isLoggedIn: boolean;
  isStudent: boolean;
  alreadyApplied: boolean;
  companyUserId: string;
}) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);

  if (!isLoggedIn) {
    return (
      <Link href="/login"
        className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition">
        로그인 후 지원하기
      </Link>
    );
  }

  if (!isStudent) {
    return null;
  }

  if (applied) {
    return (
      <div className="flex items-center gap-3">
        <span className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold">
          지원 완료
        </span>
        <Link href={`/messages?to=${companyUserId}`}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          기업에 메시지 보내기
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    setLoading(true);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobPostingId: jobId, coverLetter }),
    });
    if (res.ok) {
      setApplied(true);
      setShowForm(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition">
          지원하기
        </button>
      ) : (
        <div className="space-y-4">
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="지원 동기를 작성해주세요 (선택사항)"
          />
          <div className="flex gap-3">
            <button onClick={handleApply} disabled={loading}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
              {loading ? "지원 중..." : "지원 제출"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
