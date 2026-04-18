import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { partnerId } = await params;

  // Mark messages as read
  await prisma.message.updateMany({
    where: { senderId: partnerId, receiverId: userId, isRead: false },
    data: { isRead: true },
  });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
    select: { id: true, name: true, role: true },
  });

  return NextResponse.json({ messages, partner });
}
