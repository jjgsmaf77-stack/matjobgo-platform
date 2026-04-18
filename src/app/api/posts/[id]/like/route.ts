import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const { id } = await params;

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId: id, userId } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    const post = await prisma.post.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    });
    return NextResponse.json({ liked: false, likeCount: post.likeCount });
  }

  await prisma.postLike.create({ data: { postId: id, userId } });
  const post = await prisma.post.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });
  return NextResponse.json({ liked: true, likeCount: post.likeCount });
}
