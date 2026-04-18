import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = (session.user as any).studentId;
  const body = await request.json();

  const existing = await prisma.application.findUnique({
    where: { studentId_jobPostingId: { studentId, jobPostingId: body.jobPostingId } },
  });
  if (existing) {
    return NextResponse.json({ error: "이미 지원한 공고입니다." }, { status: 409 });
  }

  const application = await prisma.application.create({
    data: {
      studentId,
      jobPostingId: body.jobPostingId,
      coverLetter: body.coverLetter || null,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { applicationId, status } = body;

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      reviewedAt: new Date(),
      note: body.note,
    },
  });

  return NextResponse.json({ application });
}
