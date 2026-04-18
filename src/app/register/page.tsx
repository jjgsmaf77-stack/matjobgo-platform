"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import SessionProvider from "@/components/SessionProvider";

const CULINARY_FIELDS = [
  "한식", "양식", "중식", "일식", "제과제빵",
  "카페·베이커리", "퓨전요리", "급식조리", "기타",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "company" ? "COMPANY" : "STUDENT";

  const [role, setRole] = useState<"STUDENT" | "COMPANY">(defaultRole as any);
  const [formData, setFormData] = useState({
    email: "", password: "", passwordConfirm: "", name: "", phone: "",
    // 학생
    school: "", grade: "", desiredField: [] as string[],
    // 기업
    companyName: "", businessNumber: "", industry: "", address: "", description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      desiredField: prev.desiredField.includes(field)
        ? prev.desiredField.filter((f) => f !== field)
        : [...prev.desiredField, field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
          desiredField: JSON.stringify(formData.desiredField),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("서버 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              맛
            </div>
            <span className="text-2xl font-bold text-gray-900">
              맛<span className="text-orange-600">Job</span>GO
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        </div>

        {/* 역할 선택 */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 py-4 rounded-xl font-bold text-center border-2 transition ${
              role === "STUDENT"
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">🎓</div>
            학생(직업계고)
          </button>
          <button
            type="button"
            onClick={() => setRole("COMPANY")}
            className={`flex-1 py-4 rounded-xl font-bold text-center border-2 transition ${
              role === "COMPANY"
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">🏢</div>
            기업(외식업체)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* 공통 필드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
              <input name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder={role === "STUDENT" ? "학생 이름" : "담당자 이름"} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="6자 이상" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인 *</label>
              <input name="passwordConfirm" type="password" value={formData.passwordConfirm} onChange={handleChange} required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="비밀번호 확인" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="010-0000-0000" />
            </div>
          </div>

          {/* 학생 추가 필드 */}
          {role === "STUDENT" && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-gray-900">학생 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">소속 고등학교 *</label>
                  <input name="school" value={formData.school} onChange={handleChange} required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="예: 진경여자고등학교" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
                  <select name="grade" value={formData.grade} onChange={handleChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">취업 희망 분야 (복수 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {CULINARY_FIELDS.map((field) => (
                    <button key={field} type="button" onClick={() => toggleField(field)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        formData.desiredField.includes(field)
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
                      }`}>
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 기업 추가 필드 */}
          {role === "COMPANY" && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-gray-900">기업 정보</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업체명 *</label>
                <input name="companyName" value={formData.companyName} onChange={handleChange} required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="업체명을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
                  <input name="businessNumber" value={formData.businessNumber} onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="000-00-00000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
                  <select name="industry" value={formData.industry} onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                    <option value="">선택</option>
                    {CULINARY_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소재지</label>
                <input name="address" value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="전북특별자치도 전주시..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기업 소개</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  placeholder="기업에 대해 간단히 소개해주세요" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
            {loading ? "가입 중..." : "회원가입"}
          </button>

          <p className="text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-orange-600 font-medium hover:underline">로그인</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
        <RegisterForm />
      </Suspense>
    </SessionProvider>
  );
}
