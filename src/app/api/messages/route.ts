import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 대화 목록 가져오기
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  // 대화 상대 목록
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 대화 상대별로 그룹핑
  const conversationsMap = new Map<string, {
    partnerId: string;
    partnerName: string;
    partnerRole: string;
    lastMessage: string;
    lastAt: Date;
    unreadCount: number;
  }>();

  for (const msg of messages) {
    const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const partner = msg.senderId === userId ? msg.receiver : msg.sender;

    if (!conversationsMap.has(partnerId)) {
      const unread = await prisma.message.count({
        where: { senderId: partnerId, receiverId: userId, isRead: false },
      });
      conversationsMap.set(partnerId, {
        partnerId,
        partnerName: partner.name,
        partnerRole: partner.role,
        lastMessage: msg.content,
        lastAt: msg.createdAt,
        unreadCount: unread,
      });
    }
  }

  return NextResponse.json({
    conversations: Array.from(conversationsMap.values()),
  });
}

// 메시지 보내기
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await request.json();

  if (!body.receiverId || !body.content) {
    return NextResponse.json({ error: "수신자와 내용을 입력해주세요." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      senderId: userId,
      receiverId: body.receiverId,
      content: body.content,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
