"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CULINARY_FIELDS = [
  "한식", "양식", "중식", "일식", "제과제빵",
  "카페·베이커리", "퓨전요리", "급식조리", "기타",
];

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    school: "", grade: "", introduction: "", desiredField: [] as string[],
    desiredLocation: "", skills: "", experience: "", portfolioUrl: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.student) {
          setForm({
            school: data.student.school || "",
            grade: data.student.grade || "",
            introduction: data.student.introduction || "",
            desiredField: data.student.desiredField ? JSON.parse(data.student.desiredField) : [],
            desiredLocation: data.student.desiredLocation || "",
            skills: data.student.skills || "",
            experience: data.student.experience || "",
            portfolioUrl: data.student.portfolioUrl || "",
          });
        }
        setLoading(false);
      });
  }, []);

  const toggleField = (field: string) => {
    setForm((prev) => ({
      ...prev,
      desiredField: prev.desiredField.includes(field)
        ? prev.desiredField.filter((f) => f !== field)
        : [...prev.desiredField, field],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "desiredField") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const res = await fetch("/api/student/profile", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      setMessage("프로필이 저장되었습니다.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("저장 중 오류가 발생했습니다.");
    }
    setSaving(false);
  };

  if (loading) return <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">프로필 수정</h1>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
          message.includes("오류") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>{message}</div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소속 고등학교 *</label>
            <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
            <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">선택</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="졸업">졸업</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">취업 희망 분야</label>
          <div className="flex flex-wrap gap-2">
            {CULINARY_FIELDS.map((field) => (
              <button key={field} type="button" onClick={() => toggleField(field)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  form.desiredField.includes(field)
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
                }`}>{field}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">희망 근무 지역</label>
          <input value={form.desiredLocation} onChange={(e) => setForm({ ...form, desiredLocation: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="예: 전주, 군산, 익산 등" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">자기소개서</label>
          <textarea value={form.introduction}
            onChange={(e) => setForm({ ...form, introduction: e.target.value })} rows={8}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="자신의 강점, 조리 분야에 대한 열정, 목표 등을 자유롭게 작성해주세요" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">보유 기술/자격증</label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="예: 한식조리기능사, 양식조리기능사, 위생사 등" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">경력/경험</label>
          <textarea value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={3}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="실습, 아르바이트, 대회 경험 등" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이력서 업로드 (PDF)</label>
          <input type="file" accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">포트폴리오 URL</label>
          <input value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="https://" />
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
          {saving ? "저장 중..." : "프로필 저장"}
        </button>
      </form>
    </div>
  );
}
