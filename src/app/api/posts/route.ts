import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "recent"; // recent | popular
  const query = searchParams.get("q")?.trim();
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

  const where: any = {};
  if (category && category !== "ALL") where.category = category;
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { content: { contains: query } },
    ];
  }

  const orderBy: any =
    sort === "popular"
      ? [{ isPinned: "desc" }, { likeCount: "desc" }, { createdAt: "desc" }]
      : [{ isPinned: "desc" }, { createdAt: "desc" }];

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          student: {
            select: { studentType: true, school: true, isMentor: true },
          },
        },
      },
    },
    orderBy,
    take: limit,
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const body = await request.json();
  const { category, title, content, images, tags } = body;

  if (!category || !title || !content) {
    return NextResponse.json(
      { error: "카테고리, 제목, 내용은 필수 항목입니다." },
      { status: 400 }
    );
  }

  const validCategories = [
    "LEARNING",
    "PROGRAM",
    "CURRICULUM",
    "VOLUNTEER",
    "CAREER",
    "TIP",
    "RECIPE",
  ];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "잘못된 카테고리" }, { status: 400 });
  }

  // 대학생 멘토가 CAREER 카테고리로 작성하는 경우 자동 '멘토 답변' 배지
  const student = await prisma.student.findUnique({ where: { userId } });
  const isMentorAnswer =
    !!student &&
    student.studentType === "UNIVERSITY" &&
    student.isMentor &&
    category === "CAREER";

  const post = await prisma.post.create({
    data: {
      authorId: userId,
      category,
      title: String(title).slice(0, 200),
      content: String(content),
      images: Array.isArray(images) ? JSON.stringify(images) : null,
      tags: Array.isArray(tags) ? JSON.stringify(tags) : null,
      isMentorAnswer,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
