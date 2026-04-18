import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { postId: id, parentId: null },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          student: { select: { studentType: true, isMentor: true } },
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
              student: { select: { studentType: true, isMentor: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const { id } = await params;

  const body = await request.json();
  const content = String(body.content || "").trim();
  const parentId = body.parentId ? String(body.parentId) : null;

  if (!content) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { postId: id, authorId: userId, content, parentId },
  });

  await prisma.post.update({
    where: { id },
    data: { commentCount: { increment: 1 } },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
