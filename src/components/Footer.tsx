export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                맛
              </div>
              <span className="text-lg font-bold text-white">
                맛<span className="text-orange-500">Job</span>GO
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              전북의 맛(味)을 &apos;품&apos;은 로컬조리인재 양성
              <br />
              호원대학교 RISE사업 Track IV
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/jobs" className="hover:text-orange-400 transition">채용공고</a></li>
              <li><a href="/companies" className="hover:text-orange-400 transition">참여기업</a></li>
              <li><a href="/programs" className="hover:text-orange-400 transition">교육프로그램</a></li>
              <li><a href="/notices" className="hover:text-orange-400 transition">공지사항</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">연락처</h3>
            <ul className="space-y-2 text-sm">
              <li>호원대학교 호텔외식조리학과</li>
              <li>전라북도 군산시 (호원대학교)</li>
              <li>TEL: 063-450-7261</li>
              <li>E-mail: inki0110@howon.ac.kr</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 맛JobGO | 호원대학교 RISE사업단. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
