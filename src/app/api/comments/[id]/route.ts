import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (comment.authorId !== userId && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });
  await prisma.post.update({
    where: { id: comment.postId },
    data: { commentCount: { decrement: 1 } },
  });

  return NextResponse.json({ ok: true });
}
