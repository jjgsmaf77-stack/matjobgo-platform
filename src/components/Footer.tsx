export default function Footer() {
  return (
    <footer className="bg-[#991B1B] text-white/70 mt-auto relative overflow-hidden">
      {/* 상단 골드 라인 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4A574]" />
      <div className="absolute top-1 left-0 w-1/3 h-0.5 bg-[#DC2626]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center text-white font-black text-sm font-sans-ko">
                맛
              </div>
              <span className="text-lg font-black text-white font-sans-ko tracking-tight flex items-baseline gap-0.5">
                <span>맛</span>
                <span className="text-[#FCA5A5]">Job</span>
                <span>GO</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/60">
              전북의 맛(味)을 &apos;품&apos;은 로컬조리인재 양성
              <br />
              호원대학교 RISE사업 Track IV
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 text-[13px] tracking-wider uppercase">
              <span className="inline-block w-6 h-px bg-[#D4A574] align-middle mr-2" />
              바로가기
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="/jobs" className="hover:text-[#FCA5A5] transition">채용공고</a></li>
              <li><a href="/companies" className="hover:text-[#FCA5A5] transition">참여기업</a></li>
              <li><a href="/programs" className="hover:text-[#FCA5A5] transition">교육프로그램</a></li>
              <li><a href="/matdam" className="hover:text-[#FCA5A5] transition">맛담 커뮤니티</a></li>
              <li><a href="/notices" className="hover:text-[#FCA5A5] transition">공지사항</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 text-[13px] tracking-wider uppercase">
              <span className="inline-block w-6 h-px bg-[#D4A574] align-middle mr-2" />
              연락처
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>호원대학교 호텔외식조리학과</li>
              <li>전라북도 군산시 (호원대학교)</li>
              <li>TEL: 063-450-7261</li>
              <li>E-mail: inki0110@howon.ac.kr</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px]">
          <p className="text-white/50">
            &copy; 2026 맛JobGO | 호원대학교 RISE사업단. All rights reserved.
          </p>
          <p className="text-[#D4A574] font-semibold tracking-[0.15em] uppercase text-[11px]">
            Regional Innovation · RISE Track IV
          </p>
        </div>
      </div>
    </footer>
  );
}
