import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewPostForm from "./NewPostForm";
import { MATDAM_COLORS } from "../_constants";

export default async function NewPostPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/matdam/new");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: MATDAM_COLORS.accentBg }}
    >
      <div className="max-w-[860px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="mb-8">
          <p
            className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3"
            style={{ color: MATDAM_COLORS.primary }}
          >
            Matdam · New Post
          </p>
          <h1 className="text-[28px] md:text-[36px] font-bold text-black leading-tight tracking-tight">
            이야기를 나눠주세요
          </h1>
          <p className="text-[13px] text-black/50 mt-2">
            다른 학생들에게 도움이 되는 경험을 자유롭게 공유해보세요
          </p>
        </div>
        <NewPostForm />
      </div>
    </div>
  );
}
