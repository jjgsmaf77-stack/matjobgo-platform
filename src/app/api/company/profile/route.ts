import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await prisma.company.findUnique({
    where: { id: (session.user as any).companyId },
    include: { user: true },
  });

  return NextResponse.json({ company });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = (session.user as any).companyId;
  const body = await request.json();

  const updateData: Record<string, any> = {};
  const stringFields = [
    "companyName",
    "businessNumber",
    "representative",
    "industry",
    "address",
    "description",
    "idealTalent",
    "website",
    "logoImage",
  ];
  for (const field of stringFields) {
    if (body[field] !== undefined) updateData[field] = body[field] || null;
  }
  if (body.employeeCount !== undefined) {
    updateData.employeeCount =
      body.employeeCount === null || body.employeeCount === ""
        ? null
        : Number(body.employeeCount);
  }

  // companyName은 필수값이므로 빈 문자열이 들어오면 기존 값 유지
  if (updateData.companyName === null || updateData.companyName === "") {
    delete updateData.companyName;
  }

  const company = await prisma.company.update({
    where: { id: companyId },
    data: updateData,
  });

  return NextResponse.json({ company });
}
