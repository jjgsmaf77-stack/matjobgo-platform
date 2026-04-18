import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = (session.user as any).companyId;
  const body = await request.json();

  const job = await prisma.jobPosting.create({
    data: {
      companyId,
      title: body.title,
      field: body.field,
      description: body.description,
      requirements: body.requirements || null,
      salary: body.salary || null,
      workLocation: body.workLocation || null,
      workSchedule: body.workSchedule || null,
      benefits: body.benefits || null,
      recruitCount: body.recruitCount || null,
      deadline: body.deadline ? new Date(body.deadline) : null,
      status: "OPEN",
    },
  });

  // 매칭 알고리즘 실행 - 새 공고에 대해 학생 매칭
  await runMatching(job.id, companyId);

  return NextResponse.json({ job }, { status: 201 });
}

async function runMatching(jobPostingId: string, companyId: string) {
  const job = await prisma.jobPosting.findUnique({ where: { id: jobPostingId } });
  if (!job) return;

  const students = await prisma.student.findMany({
    where: { isPublic: true },
    include: { user: true },
  });

  for (const student of students) {
    let score = 0;
    const reasons: string[] = [];

    // 1. 희망분야 매칭 (최대 40점)
    if (student.desiredField) {
      const desiredFields = JSON.parse(student.desiredField) as string[];
      if (desiredFields.includes(job.field)) {
        score += 40;
        reasons.push(`희망분야 일치: ${job.field}`);
      } else if (desiredFields.some(f => job.field.includes(f) || f.includes(job.field))) {
        score += 20;
        reasons.push("관련 분야 유사");
      }
    }

    // 2. 희망근무지역 매칭 (최대 20점)
    if (student.desiredLocation && job.workLocation) {
      const locations = student.desiredLocation.split(/[,\s]+/);
      if (locations.some(loc => job.workLocation!.includes(loc))) {
        score += 20;
        reasons.push("희망 근무지역 일치");
      }
    }

    // 3. 프로필 완성도 (최대 20점)
    if (student.introduction) { score += 5; reasons.push("자기소개서 작성"); }
    if (student.resumeFile) { score += 5; reasons.push("이력서 업로드"); }
    if (student.skills) { score += 5; reasons.push("기술/자격증 보유"); }
    if (student.experience) { score += 5; reasons.push("경험 사항 작성"); }

    // 4. 기본 점수 (최대 20점) - 자격요건 키워드 매칭
    if (job.requirements && student.skills) {
      const reqKeywords = job.requirements.toLowerCase().split(/[\s,]+/);
      const studentSkills = student.skills.toLowerCase();
      const matchCount = reqKeywords.filter(k => studentSkills.includes(k)).length;
      const bonusScore = Math.min(matchCount * 5, 20);
      if (bonusScore > 0) {
        score += bonusScore;
        reasons.push("자격요건 키워드 매칭");
      }
    }

    if (score > 0) {
      await prisma.matchResult.upsert({
        where: {
          studentId_companyId_jobPostingId: {
            studentId: student.id,
            companyId,
            jobPostingId,
          },
        },
        update: { matchScore: score, matchReasons: JSON.stringify(reasons) },
        create: {
          studentId: student.id,
          companyId,
          jobPostingId,
          matchScore: score,
          matchReasons: JSON.stringify(reasons),
        },
      });
    }
  }
}
