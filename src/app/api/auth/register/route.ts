import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, role, ...profileData } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (!["STUDENT", "COMPANY"].includes(role)) {
      return NextResponse.json(
        { error: "올바른 회원 유형을 선택해주세요." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "이미 가입된 이메일입니다." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        ...(role === "STUDENT" && {
          student: {
            create: {
              school: profileData.school || "",
              grade: profileData.grade,
              desiredField: profileData.desiredField,
            },
          },
        }),
        ...(role === "COMPANY" && {
          company: {
            create: {
              companyName: profileData.companyName || "",
              businessNumber: profileData.businessNumber,
              industry: profileData.industry,
              address: profileData.address,
              description: profileData.description,
            },
          },
        }),
      },
    });

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
