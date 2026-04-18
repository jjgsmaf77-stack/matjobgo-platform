import type { IconName } from "@/components/Icon";

export type MatdamCategory =
  | "LEARNING"
  | "PROGRAM"
  | "CURRICULUM"
  | "VOLUNTEER"
  | "CAREER"
  | "TIP"
  | "RECIPE";

// 맛담 브랜드 컬러 (Warm Amber - 커뮤니티 감성)
export const MATDAM_COLORS = {
  bgHeroDark: "#1A0F04",
  bgHeroMid: "#3D2410",
  primary: "#D97706", // amber-600
  primaryDark: "#B45309", // amber-700
  accent: "#F59E0B", // amber-500
  accentLight: "#FCD34D", // amber-300
  accentSoft: "#FEF3C7", // amber-100
  accentBg: "#FFFBF0", // warm cream
  textDark: "#1C0F06",
};

export const CATEGORY_META: Record<
  MatdamCategory,
  {
    label: string;
    short: string;
    iconName: IconName;
    desc: string;
    english: string;
    tagline: string;
    accent: string; // 카테고리별 구분 색 (amber 계열과 조화)
  }
> = {
  LEARNING: {
    label: "학습경험",
    short: "학습",
    iconName: "book",
    desc: "수업·실습에서 얻은 배움 공유",
    english: "LEARNING",
    tagline: "수업과 실습에서 얻은 배움의 순간들",
    accent: "#D97706", // amber
  },
  PROGRAM: {
    label: "프로그램 후기",
    short: "프로그램",
    iconName: "trophy",
    desc: "On-D-Gourmet · 조리캠프 참여 후기",
    english: "PROGRAM",
    tagline: "On-D-Gourmet · 조리캠프 · 경진대회 참여기",
    accent: "#EA580C", // orange
  },
  CURRICULUM: {
    label: "교육과정",
    short: "교육과정",
    iconName: "book-open",
    desc: "교육과정·커리큘럼에 대한 이야기",
    english: "CURRICULUM",
    tagline: "교육과정과 커리큘럼에 대한 이야기",
    accent: "#A16207", // yellow-700
  },
  VOLUNTEER: {
    label: "사회공헌",
    short: "봉사",
    iconName: "hand-heart",
    desc: "봉사활동·지역공헌 경험",
    english: "VOLUNTEER",
    tagline: "지역사회와 함께한 나눔의 기록",
    accent: "#B91C1C", // red warm
  },
  CAREER: {
    label: "진로고민",
    short: "진로",
    iconName: "compass",
    desc: "선배에게 묻고 함께 고민",
    english: "CAREER",
    tagline: "선배에게 묻고 함께 고민하는 진로의 길",
    accent: "#9A3412", // orange-800
  },
  TIP: {
    label: "노하우·팁",
    short: "팁",
    iconName: "lightbulb",
    desc: "실전 꿀팁·자격증 공부법",
    english: "TIP",
    tagline: "실전 꿀팁과 자격증 합격 노하우",
    accent: "#CA8A04", // yellow
  },
  RECIPE: {
    label: "레시피",
    short: "레시피",
    iconName: "bowl",
    desc: "내가 만든 레시피 공개",
    english: "RECIPE",
    tagline: "내가 만든 레시피를 세상에",
    accent: "#92400E", // amber-800
  },
};

export const CATEGORY_ORDER: MatdamCategory[] = [
  "LEARNING",
  "PROGRAM",
  "CURRICULUM",
  "VOLUNTEER",
  "CAREER",
  "TIP",
  "RECIPE",
];

export function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function authorBadge(
  role: string | null | undefined,
  student: { studentType?: string | null; isMentor?: boolean | null } | null
): { label: string; cls: string } {
  if (role === "ADMIN")
    return { label: "운영자", cls: "bg-[#0a0a0a] text-white" };
  if (student?.studentType === "UNIVERSITY") {
    if (student.isMentor)
      return { label: "대학생 멘토", cls: "bg-[#1428A0] text-white" };
    return { label: "대학생", cls: "bg-[#eef0ff] text-[#1428A0]" };
  }
  if (student?.studentType === "HIGH_SCHOOL")
    return { label: "고교생", cls: "bg-[#f6f6f6] text-black/60" };
  if (role === "COMPANY")
    return { label: "기업", cls: "bg-amber-50 text-amber-800" };
  return { label: "회원", cls: "bg-gray-100 text-gray-600" };
}
