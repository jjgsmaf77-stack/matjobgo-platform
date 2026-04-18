import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { id: (session.user as any).studentId },
    include: { user: true },
  });

  return NextResponse.json({ student });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = (session.user as any).studentId;
  const formData = await request.formData();

  const updateData: Record<string, any> = {};
  const fields = ["school", "grade", "introduction", "desiredField", "desiredLocation", "skills", "experience", "portfolioUrl"];
  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null) {
      updateData[field] = value.toString();
    }
  }

  // Handle resume file upload
  const resumeFile = formData.get("resume") as File | null;
  if (resumeFile && resumeFile.size > 0) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${studentId}_${Date.now()}_${resumeFile.name}`;
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    await writeFile(filePath, buffer);
    updateData.resumeFile = `/uploads/resumes/${fileName}`;
  }

  const student = await prisma.student.update({
    where: { id: studentId },
    data: updateData,
  });

  return NextResponse.json({ student });
}
