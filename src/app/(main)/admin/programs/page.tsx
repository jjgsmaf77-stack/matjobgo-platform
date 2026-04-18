import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProgramsManager from "./ProgramsManager";

export default async function AdminProgramsPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/login");

  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">프로그램 관리</h1>
      <p className="text-gray-600 mb-8">
        On-D-Gourmet, COOKING 브릿지, 융합조리캠프 등 교육 프로그램을 등록/수정합니다
      </p>
      <ProgramsManager
        initialPrograms={programs.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description || "",
          schedule: p.schedule || "",
          location: p.location || "",
          maxParticipants: p.maxParticipants,
          status: p.status,
        }))}
      />
    </div>
  );
}
