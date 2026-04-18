import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { readdir, mkdir } from "fs/promises";
import path from "path";
import GalleryManager from "./GalleryManager";

async function getGalleryImages() {
  const dir = path.join(process.cwd(), "public", "uploads", "gallery");
  try {
    await mkdir(dir, { recursive: true });
    const files = await readdir(dir);
    return files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()
      .map((f) => ({ name: f, url: `/uploads/gallery/${f}` }));
  } catch {
    return [];
  }
}

export default async function AdminGalleryPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/login");

  const images = await getGalleryImages();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">갤러리 관리</h1>
      <p className="text-gray-600 mb-8">
        교육 프로그램 결과물 사진을 업로드/삭제합니다 ({images.length}장 등록)
      </p>
      <GalleryManager initialImages={images} />
    </div>
  );
}
