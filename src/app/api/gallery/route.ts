import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

export async function GET() {
  try {
    await mkdir(GALLERY_DIR, { recursive: true });
    const files = await readdir(GALLERY_DIR);
    const images = files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()
      .map((f) => ({
        name: f,
        url: `/uploads/gallery/${f}`,
      }));
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "업로드할 파일을 선택해주세요." }, { status: 400 });
  }

  await mkdir(GALLERY_DIR, { recursive: true });

  const uploaded: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) continue;

    const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_");
    const fileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(GALLERY_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    uploaded.push(`/uploads/gallery/${fileName}`);
  }

  return NextResponse.json({ uploaded }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const name = String(body.name || "");
  if (!name || name.includes("/") || name.includes("..")) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }
  try {
    await unlink(path.join(GALLERY_DIR, name));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
