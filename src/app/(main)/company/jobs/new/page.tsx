"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELDS = ["한식", "양식", "중식", "일식", "제과제빵", "카페·베이커리", "퓨전요리", "급식조리", "기타"];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", field: "", description: "", requirements: "",
    salary: "", workLocation: "", workSchedule: "",
    benefits: "", recruitCount: "", deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        recruitCount: form.recruitCount ? parseInt(form.recruitCount) : null,
        deadline: form.deadline || null,
      }),
    });
    if (res.ok) {
      router.push("/company/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">채용공고 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">공고 제목 *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none"
            placeholder="예: 양식조리사 모집" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">분야 *</label>
          <select name="field" value={form.field} onChange={handleChange} required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none">
            <option value="">분야 선택</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명 *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={6}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none resize-none"
            placeholder="업무 내용, 근무 환경 등을 상세히 작성해주세요" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">자격요건</label>
          <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none resize-none"
            placeholder="필요 자격증, 경력 등" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">급여 조건</label>
            <input name="salary" value={form.salary} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none"
              placeholder="예: 월 220만원~" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">근무지</label>
            <input name="workLocation" value={form.workLocation} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none"
              placeholder="예: 전주시 완산구" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">근무시간</label>
            <input name="workSchedule" value={form.workSchedule} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none"
              placeholder="예: 09:00~18:00 (주5일)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">모집인원</label>
            <input name="recruitCount" type="number" value={form.recruitCount} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none"
              placeholder="명" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">복리후생</label>
          <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={2}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none resize-none"
            placeholder="4대보험, 식사제공, 교육지원 등" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">마감일</label>
          <input name="deadline" type="date" value={form.deadline} onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DC2626] outline-none" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#DC2626] text-white py-3 rounded-xl font-bold hover:bg-[#991B1B] transition disabled:opacity-50">
          {loading ? "등록 중..." : "채용공고 등록"}
        </button>
      </form>
    </div>
  );
}
