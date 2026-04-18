import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ programs });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (!body.title || !body.category) {
    return NextResponse.json(
      { error: "제목과 카테고리를 입력해주세요." },
      { status: 400 }
    );
  }
  const program = await prisma.program.create({
    data: {
      title: body.title,
      category: body.category,
      description: body.description || null,
      schedule: body.schedule || null,
      location: body.location || null,
      maxParticipants: body.maxParticipants
        ? Number(body.maxParticipants)
        : null,
      status: body.status || "UPCOMING",
    },
  });
  return NextResponse.json({ program }, { status: 201 });
}
