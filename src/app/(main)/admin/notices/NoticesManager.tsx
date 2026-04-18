"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export default function NoticesManager({
  initialNotices,
}: {
  initialNotices: Notice[];
}) {
  const router = useRouter();
  const [notices, setNotices] = useState(initialNotices);
  const [form, setForm] = useState({ title: "", content: "", isPinned: false });
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setNotices([
        {
          ...data.notice,
          createdAt: data.notice.createdAt || new Date().toISOString(),
        },
        ...notices,
      ]);
      setForm({ title: "", content: "", isPinned: false });
      router.refresh();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotices(notices.filter((n) => n.id !== id));
      router.refresh();
    }
  };

  const togglePin = async (id: string, current: boolean) => {
    const res = await fetch(`/api/notices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !current }),
    });
    if (res.ok) {
      setNotices(
        notices.map((n) => (n.id === id ? { ...n, isPinned: !current } : n))
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border p-6 space-y-4"
      >
        <h2 className="font-bold text-gray-900">새 공지사항 작성</h2>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="제목"
          required
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="내용"
          rows={5}
          required
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
        />
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
            className="w-4 h-4 accent-orange-600"
          />
          상단 고정
        </label>
        <button
          type="submit"
          disabled={saving}
          className="block w-full bg-orange-600 text-white py-2.5 rounded-xl font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {saving ? "등록 중..." : "공지사항 등록"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-bold text-gray-900">공지사항 목록</h2>
        </div>
        {notices.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            등록된 공지사항이 없습니다
          </div>
        ) : (
          <ul className="divide-y">
            {notices.map((n) => (
              <li key={n.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {n.isPinned && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                          </svg>
                          고정
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{n.title}</h3>
                    <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => togglePin(n.id, n.isPinned)}
                      className="text-xs text-orange-600 hover:underline"
                    >
                      {n.isPinned ? "고정 해제" : "상단 고정"}
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
