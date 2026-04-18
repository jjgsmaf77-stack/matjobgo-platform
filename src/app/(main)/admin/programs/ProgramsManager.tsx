"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  schedule: string;
  location: string;
  maxParticipants: number | null;
  status: string;
}

const CATEGORIES = [
  { value: "ON_D_GOURMET", label: "On-D-Gourmet" },
  { value: "COOKING_BRIDGE", label: "COOKING 브릿지" },
  { value: "CAMP", label: "융합조리캠프" },
  { value: "VOLUNTEER", label: "사회봉사" },
];

const STATUSES = [
  { value: "UPCOMING", label: "예정" },
  { value: "ONGOING", label: "진행 중" },
  { value: "COMPLETED", label: "완료" },
];

export default function ProgramsManager({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const router = useRouter();
  const [programs, setPrograms] = useState(initialPrograms);
  const [form, setForm] = useState({
    title: "",
    category: "ON_D_GOURMET",
    description: "",
    schedule: "",
    location: "",
    maxParticipants: "",
    status: "UPCOMING",
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setPrograms([data.program, ...programs]);
      setForm({
        title: "",
        category: "ON_D_GOURMET",
        description: "",
        schedule: "",
        location: "",
        maxParticipants: "",
        status: "UPCOMING",
      });
      router.refresh();
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/programs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setPrograms(programs.map((p) => (p.id === id ? { ...p, status } : p)));
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPrograms(programs.filter((p) => p.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border p-6 space-y-4"
      >
        <h2 className="font-bold text-gray-900">새 프로그램 등록</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="프로그램 제목"
            required
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none sm:col-span-2"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <input
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            placeholder="일정 (예: 2026년 5~6월)"
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="장소"
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="number"
            value={form.maxParticipants}
            onChange={(e) =>
              setForm({ ...form, maxParticipants: e.target.value })
            }
            placeholder="모집 인원"
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="프로그램 설명"
            rows={3}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none sm:col-span-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="block w-full bg-orange-600 text-white py-2.5 rounded-xl font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {saving ? "등록 중..." : "프로그램 등록"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-bold text-gray-900">등록된 프로그램</h2>
        </div>
        {programs.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            등록된 프로그램이 없습니다
          </div>
        ) : (
          <ul className="divide-y">
            {programs.map((p) => {
              const cat = CATEGORIES.find((c) => c.value === p.category);
              return (
                <li key={p.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-medium">
                          {cat?.label || p.category}
                        </span>
                        <select
                          value={p.status}
                          onChange={(e) => updateStatus(p.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-0.5 rounded border ${
                            p.status === "UPCOMING"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : p.status === "ONGOING"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <h3 className="font-bold text-gray-900">{p.title}</h3>
                      {p.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {p.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        {p.schedule && <span>📅 {p.schedule}</span>}
                        {p.location && <span>📍 {p.location}</span>}
                        {p.maxParticipants && (
                          <span>👥 최대 {p.maxParticipants}명</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
