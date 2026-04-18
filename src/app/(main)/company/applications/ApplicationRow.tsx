"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "검토 중", cls: "bg-yellow-100 text-yellow-700" },
  REVIEWED: { label: "검토 완료", cls: "bg-blue-100 text-blue-700" },
  ACCEPTED: { label: "합격", cls: "bg-green-100 text-green-700" },
  REJECTED: { label: "불합격", cls: "bg-red-100 text-red-700" },
};

export default function ApplicationRow({
  id,
  studentName,
  studentUserId,
  school,
  grade,
  jobTitle,
  appliedAt,
  status: initialStatus,
  coverLetter,
}: {
  id: string;
  studentName: string;
  studentUserId: string;
  school: string;
  grade: string;
  jobTitle: string;
  appliedAt: string;
  status: string;
  coverLetter: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const meta = STATUS_LABELS[status] || STATUS_LABELS.PENDING;

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    const res = await fetch("/api/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id, status: newStatus }),
    });
    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <tr className="border-b last:border-0 hover:bg-gray-50">
        <td className="py-3 px-4 font-medium">{studentName}</td>
        <td className="py-3 px-4 text-gray-500">
          {school}
          {grade && ` · ${grade}학년`}
        </td>
        <td className="py-3 px-4 text-gray-700">{jobTitle}</td>
        <td className="py-3 px-4 text-gray-500">
          {new Date(appliedAt).toLocaleDateString("ko-KR")}
        </td>
        <td className="py-3 px-4">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${meta.cls}`}
          >
            {meta.label}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="text-orange-600 hover:underline text-xs"
            >
              {open ? "닫기" : "상세"}
            </button>
            <Link
              href={`/messages?to=${studentUserId}`}
              className="text-blue-600 hover:underline text-xs"
            >
              메시지
            </Link>
          </div>
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50 border-b last:border-0">
          <td colSpan={6} className="py-4 px-6">
            <div className="bg-white rounded-xl p-5 border">
              <h4 className="font-bold text-gray-900 mb-2">지원 동기</h4>
              <p className="text-gray-700 whitespace-pre-wrap text-sm">
                {coverLetter || "(작성된 지원 동기가 없습니다)"}
              </p>
              <div className="flex gap-2 mt-5 flex-wrap">
                {["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"].map((s) => (
                  <button
                    key={s}
                    disabled={loading || status === s}
                    onClick={() => updateStatus(s)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                      status === s
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {STATUS_LABELS[s].label}(으)로 변경
                  </button>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
