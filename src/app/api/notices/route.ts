import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ notices });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "제목과 내용을 입력해주세요." },
      { status: 400 }
    );
  }

  const notice = await prisma.notice.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: (session.user as any).id,
      isPinned: !!body.isPinned,
    },
  });
  return NextResponse.json({ notice }, { status: 201 });
}
