import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          student: {
            select: { studentType: true, school: true, major: true, isMentor: true },
          },
        },
      },
    },
  });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 조회수 +1 (best-effort)
  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({ post });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;
  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (post.authorId !== userId && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const data: any = {};
  if (body.title !== undefined) data.title = String(body.title).slice(0, 200);
  if (body.content !== undefined) data.content = String(body.content);
  if (body.category !== undefined) data.category = body.category;
  if (body.images !== undefined)
    data.images = Array.isArray(body.images) ? JSON.stringify(body.images) : null;
  if (body.tags !== undefined)
    data.tags = Array.isArray(body.tags) ? JSON.stringify(body.tags) : null;
  if (role === "ADMIN" && body.isPinned !== undefined)
    data.isPinned = !!body.isPinned;

  const updated = await prisma.post.update({ where: { id }, data });
  return NextResponse.json({ post: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;
  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (post.authorId !== userId && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
