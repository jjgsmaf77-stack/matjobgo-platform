import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  const pinned = notices.filter((n) => n.isPinned);
  const regular = notices.filter((n) => !n.isPinned);

  return (
    <div className="bg-[#FFFBF5]">
      {/* 헤더 */}
      <section className="relative bg-white border-b border-[#DC2626]/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-[#DC2626]" />
        <div className="absolute top-0 right-40 md:right-64 w-2 md:w-3 h-40 md:h-64 bg-[#D4A574]" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 pt-14 md:pt-28 pb-12 md:pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4A574]" />
            <p className="text-[#B8923E] text-[12px] font-bold tracking-[0.35em] uppercase">
              Notices · 공지사항
            </p>
          </div>
          <h1 className="font-sans-ko text-[30px] sm:text-[38px] md:text-[52px] lg:text-[64px] font-black text-[#991B1B] leading-[1.05] tracking-tight max-w-3xl">
            사업단의 <span className="text-[#DC2626]">소식</span>과<br />
            모집 안내
          </h1>
          <p className="text-[#44403C] text-[16px] md:text-[18px] leading-[1.8] mt-6 max-w-2xl">
            RISE 사업단의 <span className="font-bold text-[#991B1B]">공식 공지</span>,
            프로그램 모집, 결과 발표, 보도자료를 한곳에서 확인하세요.
            상단 고정 공지는 놓치지 말아야 할 중요 안내입니다.
          </p>

          {/* 통계 */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-[#FEE2E2] border border-[#DC2626]/20 rounded-2xl px-5 py-3">
              <p className="text-[10px] font-bold text-[#B8923E] tracking-widest uppercase mb-0.5">
                Total
              </p>
              <p className="font-sans-ko font-black text-[#991B1B]">
                <span className="text-[22px]">{notices.length}</span>
                <span className="text-[12px] ml-1 font-bold">건</span>
              </p>
            </div>
            <div className="bg-[#FEF2F2] border border-[#DC2626]/10 rounded-2xl px-5 py-3">
              <p className="text-[10px] font-bold text-[#B8923E] tracking-widest uppercase mb-0.5">
                Pinned
              </p>
              <p className="font-sans-ko font-black text-[#DC2626]">
                <span className="text-[22px]">{pinned.length}</span>
                <span className="text-[12px] ml-1 font-bold">건 고정</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 고정 공지 (딥레드 Featured 블록) */}
      {pinned.length > 0 && (
        <section className="bg-white pt-14 pb-8">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-[#DC2626]" />
              <h2 className="font-sans-ko text-[20px] md:text-[22px] font-black text-[#991B1B]">
                상단 고정 공지
              </h2>
              <span className="text-[11px] font-bold text-[#B8923E] tracking-widest uppercase">
                Pinned · {pinned.length}
              </span>
            </div>

            <div className="space-y-5">
              {pinned.map((n, idx) => (
                <article
                  key={n.id}
                  className="bg-[#991B1B] rounded-3xl p-8 md:p-12 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4A574]" />
                  <div
                    className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#DC2626]/25 rounded-full blur-3xl pointer-events-none"
                    style={{
                      display: idx === 0 ? "block" : "none",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      <span className="bg-[#D4A574] text-[#2D1B0A] text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase inline-flex items-center gap-1.5">
                        <Icon name="pin" size={10} strokeWidth={2.5} />
                        고정 공지
                      </span>
                      <span className="text-[#FCA5A5] text-[11px] font-bold tracking-widest uppercase">
                        {new Date(n.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-sans-ko text-[22px] md:text-[28px] font-black text-white leading-[1.2] tracking-tight mb-4">
                      {n.title}
                    </h3>
                    <p className="text-white/85 text-[14px] md:text-[15px] leading-[1.9] whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 일반 공지 */}
      <section className="bg-[#FFFBF5] py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-[#D4A574]" />
            <h2 className="font-sans-ko text-[20px] md:text-[22px] font-black text-[#991B1B]">
              전체 공지
            </h2>
            <span className="text-[11px] font-bold text-[#B8923E] tracking-widest uppercase">
              All · {regular.length}
            </span>
          </div>

          {notices.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#DC2626]/10 py-24 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FEE2E2] rounded-2xl mb-4">
                <Icon name="megaphone" size={28} strokeWidth={1.75} className="text-[#DC2626]" />
              </div>
              <h3 className="font-sans-ko text-[18px] font-black text-[#991B1B] mb-2">
                등록된 공지사항이 없습니다
              </h3>
            </div>
          ) : (
            <ul className="space-y-3">
              {regular.map((n, idx) => (
                <li
                  key={n.id}
                  className="group bg-white rounded-2xl border border-[#DC2626]/10 p-6 md:p-7 hover:border-[#DC2626]/40 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-8 items-start">
                    <div>
                      <div className="font-sans-ko text-[28px] md:text-[32px] font-black text-[#991B1B] leading-none">
                        {String(regular.length - idx).padStart(2, "0")}
                      </div>
                      <p className="text-[11px] text-[#B8923E] font-bold mt-2">
                        {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-sans-ko text-[17px] md:text-[18px] font-black text-[#991B1B] mb-2 leading-tight group-hover:text-[#DC2626] transition-colors">
                        {n.title}
                      </h3>
                      <p className="text-[13.5px] text-[#44403C] leading-[1.8] line-clamp-3 whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
