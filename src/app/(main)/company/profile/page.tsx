"use client";

import { useState, useEffect } from "react";

const INDUSTRIES = [
  "한식", "양식", "중식", "일식", "제과제빵",
  "카페·베이커리", "퓨전요리", "급식조리", "기타",
];

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    businessNumber: "",
    representative: "",
    industry: "",
    address: "",
    description: "",
    idealTalent: "",
    employeeCount: "",
    website: "",
  });

  useEffect(() => {
    fetch("/api/company/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.company) {
          setForm({
            companyName: data.company.companyName || "",
            businessNumber: data.company.businessNumber || "",
            representative: data.company.representative || "",
            industry: data.company.industry || "",
            address: data.company.address || "",
            description: data.company.description || "",
            idealTalent: data.company.idealTalent || "",
            employeeCount:
              data.company.employeeCount != null
                ? String(data.company.employeeCount)
                : "",
            website: data.company.website || "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/company/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        employeeCount: form.employeeCount
          ? parseInt(form.employeeCount, 10)
          : null,
      }),
    });

    if (res.ok) {
      setMessage("기업정보가 저장되었습니다.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("저장 중 오류가 발생했습니다.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">기업정보 수정</h1>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
            message.includes("오류")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            업체명 *
          </label>
          <input
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사업자등록번호
            </label>
            <input
              value={form.businessNumber}
              onChange={(e) =>
                setForm({ ...form, businessNumber: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="000-00-00000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대표자명
            </label>
            <input
              value={form.representative}
              onChange={(e) =>
                setForm({ ...form, representative: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              업종
            </label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">선택</option>
              {INDUSTRIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              직원 수
            </label>
            <input
              type="number"
              value={form.employeeCount}
              onChange={(e) =>
                setForm({ ...form, employeeCount: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="명"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            소재지
          </label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="전라북도 전주시..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            웹사이트
          </label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            기업 소개
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={5}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="기업의 역사, 특징, 강점 등을 소개해주세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            인재상
          </label>
          <textarea
            value={form.idealTalent}
            onChange={(e) =>
              setForm({ ...form, idealTalent: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="어떤 인재와 함께 하고 싶은지 작성해주세요"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50"
        >
          {saving ? "저장 중..." : "기업정보 저장"}
        </button>
      </form>
    </div>
  );
}
