import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const program = await prisma.program.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.description !== undefined && {
        description: body.description || null,
      }),
      ...(body.schedule !== undefined && { schedule: body.schedule || null }),
      ...(body.location !== undefined && { location: body.location || null }),
      ...(body.maxParticipants !== undefined && {
        maxParticipants: body.maxParticipants
          ? Number(body.maxParticipants)
          : null,
      }),
      ...(body.status !== undefined && { status: body.status }),
    },
  });
  return NextResponse.json({ program });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
