import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "posts");
  await mkdir(dir, { recursive: true });

  const uploaded: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) continue;
    if (file.size > 10 * 1024 * 1024) continue; // 10MB 제한

    const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_");
    const fileName = `${userId}_${Date.now()}_${safeName}`;
    const filePath = path.join(dir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    uploaded.push(`/uploads/posts/${fileName}`);
  }

  return NextResponse.json({ uploaded }, { status: 201 });
}
