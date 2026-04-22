import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcryptjs from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ==================== 관리자 ====================
  const adminPassword = await bcryptjs.hash("admin1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@howon.ac.kr" },
    update: {},
    create: {
      email: "admin@howon.ac.kr",
      password: adminPassword,
      name: "홍인기",
      role: "ADMIN",
      phone: "063-450-7261",
    },
  });

  // ==================== 샘플 학생 ====================
  const studentPassword = await bcryptjs.hash("student1234", 12);

  const studentsData = [
    {
      email: "student1@test.com", name: "김민수", phone: "010-1234-5678",
      school: "진경여자고등학교", grade: "3",
      introduction: "한식과 양식 조리에 관심이 많으며, 전북 지역에서 조리사로 성장하고 싶습니다. 한식조리기능사 자격증을 보유하고 있으며, 다양한 요리 대회에 참가한 경험이 있습니다.",
      desiredField: ["한식", "양식"], desiredLocation: "전주, 군산",
      skills: "한식조리기능사, 위생사",
      experience: "전주비빔밥축제 조리보조 참여, 교내 요리대회 금상, 2025 하이브리드 조리대회 장려상",
    },
    {
      email: "student2@test.com", name: "이서연", phone: "010-2345-6789",
      school: "덕암정보고등학교", grade: "3",
      introduction: "제과제빵과 카페 음료 분야에 열정이 있습니다. 베이커리 창업이 꿈입니다. 호원대 On-D-Gourmet 카페·베이커리 과정 이수했습니다.",
      desiredField: ["제과제빵", "카페·베이커리"], desiredLocation: "전주, 익산",
      skills: "제과기능사, 제빵기능사, 바리스타 2급",
      experience: "카페 아르바이트 6개월, 제과제빵 실습 우수상, 2025 COOKING 브릿지 하이브리드 조리대회 동상",
    },
    {
      email: "student3@test.com", name: "박준혁", phone: "010-3456-7890",
      school: "진경여자고등학교", grade: "2",
      introduction: "아시안 퓨전 요리에 관심이 많고, 세계적인 셰프가 되고 싶습니다.",
      desiredField: ["양식", "퓨전요리", "중식"], desiredLocation: "전주",
      skills: "양식조리기능사",
      experience: "하이브리드 조리대회 참가, 조리융합캠프 1·2차 이수",
    },
    {
      email: "student4@test.com", name: "정지우", phone: "010-4567-8901",
      school: "남원제일고등학교", grade: "3",
      introduction: "남원 추어탕 명가에서 일하며 전통의 맛을 계승하고 싶습니다. 지역 식재료에 관심이 많습니다.",
      desiredField: ["한식"], desiredLocation: "남원, 전주",
      skills: "한식조리기능사, 조리산업기사 필기합격",
      experience: "남원축제 부스 운영 보조, 교내 요리 대회 은상",
    },
    {
      email: "student5@test.com", name: "최다은", phone: "010-5678-9012",
      school: "덕암정보고등학교", grade: "3",
      introduction: "전주 한옥마을의 유명 카페에서 일하고 싶습니다. 라떼아트와 디저트 플레이팅을 좋아합니다.",
      desiredField: ["카페·베이커리"], desiredLocation: "전주",
      skills: "바리스타 1급, 제과기능사",
      experience: "전주 한옥마을 카페 체험, 라떼아트 대회 입상",
    },
    {
      email: "student6@test.com", name: "윤하은", phone: "010-6789-0123",
      school: "진경여자고등학교", grade: "3",
      introduction: "양식 파인다이닝 셰프가 되고 싶습니다. 호원대 사퀴테리 교육을 기대하고 있습니다.",
      desiredField: ["양식", "퓨전요리"], desiredLocation: "전주, 서울",
      skills: "양식조리기능사, 위생사",
      experience: "On-D-Gourmet 1차 이수, 조리융합캠프 1차 이수",
    },
    {
      email: "student7@test.com", name: "강지훈", phone: "010-7890-1234",
      school: "남원제일고등학교", grade: "2",
      introduction: "한식과 중식을 모두 할 수 있는 조리사가 되고 싶습니다.",
      desiredField: ["한식", "중식"], desiredLocation: "남원, 전주, 익산",
      skills: "한식조리기능사",
      experience: "교내 요리대회 우수상",
    },
    {
      email: "student8@test.com", name: "한소영", phone: "010-8901-2345",
      school: "덕암정보고등학교", grade: "3",
      introduction: "제빵과 카페 운영을 배우고 싶습니다. 이성당 같은 전통 베이커리에서 일하고 싶어요.",
      desiredField: ["제과제빵", "카페·베이커리"], desiredLocation: "군산, 전주",
      skills: "제과기능사, 제빵기능사",
      experience: "제빵 실습 우수, 김장봉사 2차 참여",
    },
  ];

  for (const s of studentsData) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        password: studentPassword,
        name: s.name,
        role: "STUDENT",
        phone: s.phone,
        student: {
          create: {
            school: s.school,
            grade: s.grade,
            introduction: s.introduction,
            desiredField: JSON.stringify(s.desiredField),
            desiredLocation: s.desiredLocation,
            skills: s.skills,
            experience: s.experience,
          },
        },
      },
    });
  }

  // ==================== 전북 유명 외식업체 ====================
  const companyPassword = await bcryptjs.hash("company1234", 12);

  // ================================================================
  // 실제 전북 기업/기관 기반 데이터 (2026년 4월 기준 조사)
  // 5개 카테고리: 호텔 · 프랜차이즈 · 단체급식 · 한식명가 · 특화외식
  // 연락처 · 사업자번호는 채용 플랫폼 샘플용 예시 데이터입니다
  // ================================================================
  const companiesData = [
    // ========== [ 1 ] 호텔 · 리조트 (4곳) ==========
    {
      email: "lahan-jeonju@test.com", name: "인사팀", phone: "063-232-7000",
      companyName: "라한호텔 전주",
      businessNumber: "418-81-10001", representative: "라한호텔 대표", industry: "호텔·리조트",
      address: "전북특별자치도 전주시 완산구 기린대로 85",
      description: "전주 중심부 특1급 비즈니스 호텔. 한정식 다이닝 '온리원' · 올데이 다이닝 뷔페 · 인룸 다이닝 · 연회장 4개소 운영. 총 객실 190실, 연간 행사 300회 이상 진행. 전주 컨벤션 · 기업 행사의 중심 호텔.",
      idealTalent: "호텔 조리·서비스에 관심 있는 학생. 한식 조리기능사 + 영어 기초 우대. 체계적 호텔 매뉴얼을 배우며 성장하고 싶은 신입 환영. 교대 근무 가능자.",
      employeeCount: 180, website: "https://lahanhotels.com", isVerified: true,
    },
    {
      email: "bwgunsan@test.com", name: "인사총무팀", phone: "063-469-2000",
      companyName: "베스트웨스턴 군산호텔",
      businessNumber: "418-81-10002", representative: "호텔 총지배인", industry: "호텔·리조트",
      address: "전북특별자치도 군산시 대학로 330",
      description: "군산 대표 4성급 비즈니스 호텔. 객실 152실 + 뷔페 '라운드' + 중식당 + 로비라운지 운영. 새만금 · 군산항 인접으로 기업 수요 다수. 연간 웨딩 · 돌잔치 등 연회 200건 이상.",
      idealTalent: "호텔 F&B · 연회 서비스 지망 학생. 체력 · 예의범절 · 팀워크 중시. 양식 · 한식 혼합 업무 가능자. 호텔리어 커리어 진지하게 고민하는 분.",
      employeeCount: 145, website: "https://bestwestern.com/gunsan", isVerified: true,
    },
    {
      email: "muju-resort@test.com", name: "F&B 채용팀", phone: "063-322-9000",
      companyName: "덕유산리조트 (부영그룹)",
      businessNumber: "418-81-10003", representative: "리조트 대표", industry: "호텔·리조트",
      address: "전북특별자치도 무주군 설천면 만선로 185",
      description: "국내 최대급 산악 리조트. 콘도 1,300실 + 호텔 100실 + 스키장 + 곤돌라 + 워터파크 + 골프장. 메인 뷔페 '실크로드' · 한식당 · 양식당 · 델리 · 바비큐 하우스 등 F&B 10개 업장. 연간 400만 방문객.",
      idealTalent: "대형 리조트의 뷔페 · 단체 조리에 관심 있는 학생. 시즌 집중 근무 가능자 (스키 시즌 11~3월 집중). 기숙사 제공으로 타지역 학생 환영.",
      employeeCount: 850, website: "https://mdysresort.com", isVerified: true,
    },
    {
      email: "hoam-hanok@test.com", name: "운영실", phone: "063-232-7000",
      companyName: "왕의지밀 한옥호텔",
      businessNumber: "418-81-10004", representative: "한옥호텔 대표", industry: "호텔·리조트",
      address: "전북특별자치도 전주시 완산구 태조로 15 (한옥마을)",
      description: "전주 한옥마을 내 프리미엄 한옥 숙박 시설. 전통 한정식 조식 · 궁중 요리 디너 코스 운영. 해외 관광객 비중 40%. 총 객실 28실로 1:1 맞춤 서비스 제공.",
      idealTalent: "한식 전통 조리 + 궁중 요리에 관심 있는 인재. 외국인 고객 응대 가능 영어 기초 우대. 섬세한 플레이팅 · 한복 서비스 경험 학습 의지 필요.",
      employeeCount: 32, isVerified: true,
    },

    // ========== [ 2 ] 프랜차이즈 본사 · 체인 (3곳) ==========
    {
      email: "leesungdang@test.com", name: "이성당 본사 인사팀", phone: "063-445-2772",
      companyName: "이성당 (주식회사 이성당)",
      businessNumber: "405-81-40001", representative: "김현주 대표", industry: "제과제빵",
      address: "전북특별자치도 군산시 중앙로 177 (본점)",
      description: "1945년 군산 창립, 대한민국 최고령 현존 빵집. 단팥빵 · 야채빵 원조. 현재 본점 · 부산 · 서울 잠실/여의도/명동 등 전국 10여개 매장 운영. 연매출 300억+, 연간 단팥빵 300만개 판매. 미슐랭 가이드 빕구르망 선정.",
      idealTalent: "정통 제빵 기술 습득에 진지한 제빵사. 80년 전통 레시피 계승 의지. 군산 본점 근무 후 전국 매장 이동 가능. 장기 근속자에게 기술장(掌) 승진 코스 제공.",
      employeeCount: 380, website: "https://leesungdang1945.com", isVerified: true,
    },
    {
      email: "pnb-hq@test.com", name: "PNB 본사 인사팀", phone: "063-285-6666",
      companyName: "PNB풍년제과 (주식회사 PNB)",
      businessNumber: "405-81-40002", representative: "강현욱 대표", industry: "제과제빵",
      address: "전북특별자치도 전주시 완산구 팔달로 180 (본점)",
      description: "1951년 전주 창립, 70년 제과 브랜드. 수제 초코파이 원조 (연간 500만개 판매). 전주 한옥마을 · 객사 · 팔복동 등 시내 5개 직영점 + 온라인몰 운영. 전주공항 · KTX역 입점.",
      idealTalent: "제과 기본기 + 트렌드 감각 보유자. 신메뉴 개발 참여 희망자 우대. 본점 경력 2년 후 지점 매니저 · 본사 R&D 이동 가능한 경력 코스 제공.",
      employeeCount: 120, website: "https://pnbpoongnyeon.com", isVerified: true,
    },
    {
      email: "veteran@test.com", name: "베테랑 인사팀", phone: "063-285-9898",
      companyName: "베테랑 (전주 본점)",
      businessNumber: "405-81-40003", representative: "김영묵 대표", industry: "한식",
      address: "전북특별자치도 전주시 완산구 경기전길 135",
      description: "1977년 창업 전주 칼국수 원조. 손칼국수 · 들깨 칼국수 · 수육 유명. 전주 · 익산 · 대전 등 프랜차이즈 12호점 운영. 연매출 150억+, 백종원 3대 천왕 · 수요미식회 출연. 전주 한옥마을 필수 맛집.",
      idealTalent: "면 반죽 · 육수 우리기 등 한식 기본기 학습 희망자. 바쁜 피크타임 순발력 필요. 본점 근무 2년 후 지점 매니저 · 프랜차이즈 교육 강사 진로 가능.",
      employeeCount: 65, isVerified: true,
    },

    // ========== [ 3 ] 단체급식 기업 (2곳) ==========
    {
      email: "ourhome-jb@test.com", name: "전북지점 채용", phone: "063-213-2100",
      companyName: "아워홈 전북지점 (단체급식)",
      businessNumber: "418-86-50001", representative: "전북지점장", industry: "급식조리",
      address: "전북특별자치도 전주시 덕진구 백제대로 567 (전북대병원 내 외)",
      description: "국내 단체급식 Top3 기업. 전북대병원 · 원광대병원 · 전북도청 · 주요 학교 · 기업 등 도내 60여 개 사업장 운영. 하루 8만식 제공. 신입부터 영양사 · 조리사 · 조리보조 · 홀 매니저까지 다양한 직군 운영.",
      idealTalent: "안정적인 대기업 복지 희망자. 단체급식 조리 경험 또는 관심자. 새벽 근무 가능 (04:30~13:30). 영양사 국가자격증 준비생 환영. 4대보험 + 퇴직금 + 경조사비 + 자녀 학자금.",
      employeeCount: 720, website: "https://ourhome.co.kr", isVerified: true,
    },
    {
      email: "cj-freshway-jb@test.com", name: "전북영업소", phone: "063-274-1800",
      companyName: "CJ프레시웨이 전북영업소",
      businessNumber: "418-86-50002", representative: "전북영업소장", industry: "급식조리",
      address: "전북특별자치도 전주시 덕진구 기린대로 210",
      description: "CJ그룹 단체급식 · 식자재 유통 계열사. 전북 지역 학교 30여 곳 · 병원 10여 곳 · 공공기관 급식 운영. 조리원 · 영양사 · 영업관리 등 직군. HACCP 인증, 식자재 안전 관리 체계.",
      idealTalent: "CJ 계열 정규직 희망자. 단체급식 또는 식자재 물류 관심자. 조리사 자격증 + 체력 + 위생 관리 마인드 필수. 정시 출퇴근 · 주 5일제 안정적 근무 환경.",
      employeeCount: 450, website: "https://cjfreshway.com", isVerified: true,
    },

    // ========== [ 4 ] 한식 노포 · 명가 (6곳) ==========
    {
      email: "gogung@test.com", name: "고궁 인사담당", phone: "063-251-3211",
      companyName: "고궁 (전주 한옥마을 본점)",
      businessNumber: "402-81-20001", representative: "양정숙 대표", industry: "한식",
      address: "전북특별자치도 전주시 완산구 전주객사3길 22",
      description: "1996년 개업, 전주비빔밥 명가. 전주 10미 지정 음식점 · 전주국제영화제 공식 식당. 전주 한옥마을 · 평양 · 서울 센터필드 등 4호점 운영. 외국인 관광객 비중 30%.",
      idealTalent: "전통 한식 기본기 + 관광 외식 서비스 관심자. 장기 근속 의지 우대. 본점 2년 후 서울 · 해외 지점 근무 기회.",
      employeeCount: 85, website: "https://gogung.co.kr", isVerified: true,
    },
    {
      email: "hangukguan@test.com", name: "한국관 인사", phone: "063-272-9229",
      companyName: "한국관 전주본점",
      businessNumber: "402-81-20002", representative: "김영숙 대표", industry: "한식",
      address: "전북특별자치도 전주시 덕진구 팔달로 119",
      description: "전주비빔밥 지정 음식점, 50년 전통. 육회비빔밥 원조. 단체 관광 300명 동시 수용. 한국 관광공사 · 전주시 관광 추천 음식점. 한정식 · 비빔밥 전문.",
      idealTalent: "한식조리기능사 우대, 한정식 상차림 경험 희망자. 단체 주문 처리 속도 · 성실함 중시.",
      employeeCount: 45, isVerified: true,
    },
    {
      email: "samback@test.com", name: "삼백집 관리부", phone: "063-284-2227",
      companyName: "삼백집",
      businessNumber: "402-81-20003", representative: "박수철 대표", industry: "한식",
      address: "전북특별자치도 전주시 완산구 전주객사2길 22",
      description: "1947년 창업, 전주 콩나물국밥 원조. '하루 300그릇 한정 판매'가 상호 유래. 백종원 3대 천왕 · SBS 생생정보 · JTBC 한끼줍쇼 출연. 연매출 60억+, 해장 전문.",
      idealTalent: "새벽 근무 가능 (5시~) · 성실 · 체력 필수. 한식조리기능사 우대. 80년 전통 맛 지킬 인재.",
      employeeCount: 28, isVerified: true,
    },
    {
      email: "hwasim@test.com", name: "화심순두부", phone: "063-243-8268",
      companyName: "원조 화심순두부 (본점)",
      businessNumber: "402-81-20004", representative: "조명순 대표", industry: "한식",
      address: "전북특별자치도 완주군 소양면 화심순두부길 89",
      description: "1983년 창업 완주 소양면 본점. 국산 콩 100% 가마솥 순두부. 전북 향토음식 지정. 주말 기준 하루 2,000명 방문. 전주 · 대전 · 수원 등 체인 15개 직영점.",
      idealTalent: "새벽 두부 제조 공정 가능자 (04:30 출근). 전통 방식 학습 의지. 본점 2년 근속 시 체인점 매니저 승진.",
      employeeCount: 120, website: "https://hwasim.co.kr", isVerified: true,
    },
    {
      email: "wangyijip@test.com", name: "왱이집 본점", phone: "063-287-6980",
      companyName: "왱이집 (24시 콩나물국밥)",
      businessNumber: "402-81-20005", representative: "이영희 대표", industry: "한식",
      address: "전북특별자치도 전주시 완산구 동문길 88",
      description: "1983년 창업, 24시간 운영 콩나물국밥. 남부시장 직거래 콩나물 · 24시간 우린 육수. 모주와 세트 조합 유명. 전주 해장 필수 코스. 주말 기준 일 1,500그릇 판매.",
      idealTalent: "야간·새벽 근무 가능자 우대 (야간수당). 한식 기본기 + 순발력. 체력 필수.",
      employeeCount: 35, isVerified: true,
    },
    {
      email: "chueohang@test.com", name: "새집추어탕 남원본점", phone: "063-625-3455",
      companyName: "남원 새집추어탕 본점",
      businessNumber: "402-81-20006", representative: "서삼례 대표", industry: "한식",
      address: "전북특별자치도 남원시 천거길 41",
      description: "1959년 창업, 남원 추어탕 원조격. 4대째 가업. 국산 미꾸라지 · 남원 시래기 · 들깨가루 · 된장 베이스. 지리산 둘레길 · 광한루 방문객 필수 코스. 서울 · 대전 · 전주 체인 5호점.",
      idealTalent: "향토음식 계승 의지 + 남원 장기 거주/이주 가능자. 기숙사 지원 가능. 본점 수료 후 체인 매니저 진로 제공.",
      employeeCount: 40, isVerified: true,
    },

    // ========== [ 5 ] 특화 외식 · 모던 다이닝 (5곳) ==========
    {
      email: "bokseongru@test.com", name: "복성루 관리", phone: "063-445-8412",
      companyName: "복성루 (군산 중식)",
      businessNumber: "405-81-30001", representative: "최규열 대표", industry: "중식",
      address: "전북특별자치도 군산시 월명로 382",
      description: "1966년 군산 창업, 맑은 짬뽕 원조. 미슐랭 가이드 빕구르망 3년 연속 선정. 일 400그릇 한정 판매. 대기 줄 평균 1시간. 군산 중화요리의 역사.",
      idealTalent: "중식 웍 · 면 · 불판 마스터 코스. 체력 필수. 정통 중식 기본기 희망자. 본점 5년 경력 시 웍 셰프 승진 코스.",
      employeeCount: 28, isVerified: true,
    },
    {
      email: "gyehwa@test.com", name: "계화회관", phone: "063-581-0844",
      companyName: "계화회관 (부안 해물탕)",
      businessNumber: "402-81-20007", representative: "김정순 대표", industry: "한식",
      address: "전북특별자치도 부안군 계화면 돈지길 64",
      description: "바지락죽 · 백합죽 · 해물탕 명가. 부안 앞바다 해산물 직송. 전라북도 향토음식, 미슐랭 빕구르망 선정. 연간 관광객 30만 방문.",
      idealTalent: "해산물 손질 · 조개류 전처리 가능자. 부안/군산 거주자 우대. 기숙사 지원 가능.",
      employeeCount: 25, isVerified: true,
    },
    {
      email: "imsil-cheese@test.com", name: "임실치즈테마파크", phone: "063-640-2700",
      companyName: "임실N치즈테마파크 (치즈 레스토랑)",
      businessNumber: "418-81-60001", representative: "황경숙 대표", industry: "카페·베이커리",
      address: "전북특별자치도 임실군 성수면 도인2길 50",
      description: "임실치즈농협 운영 대형 치즈 테마파크. 치즈 만들기 체험 · 치즈 레스토랑 · 카페 · 베이커리. 연간 관광객 50만. 피자 · 치즈케이크 · 퐁듀 · 라클렛 요리 전문.",
      idealTalent: "유제품 · 치즈 특화 요리에 관심 있는 인재. 체험 프로그램 운영 보조. 임실 지역 거주/이주 가능자 이주 지원금 제공.",
      employeeCount: 85, website: "https://cheesepark.kr", isVerified: true,
    },
    {
      email: "vegegeun@test.com", name: "베지근", phone: "063-233-8997",
      companyName: "베지근 (전주 모던 한식)",
      businessNumber: "418-81-60002", representative: "이하나 대표", industry: "퓨전요리",
      address: "전북특별자치도 전주시 덕진구 기린대로 418",
      description: "전북 로컬 식재료 + 현대적 조리법 파인다이닝. 30년 된 씨간장 활용 코스. 서울 유명 파인다이닝 출신 셰프 운영. 월간 푸드 매거진 커버 게재. 예약 대기 평균 2개월.",
      idealTalent: "창의적 플레이팅 · 지역 식재료 탐구 · 파인다이닝 커리어 진지 지원자. 포트폴리오 있으면 경력 인정. 해외 연수 기회.",
      employeeCount: 18, isVerified: true,
    },
    {
      email: "bistro-jeonju@test.com", name: "비스트로전주", phone: "063-282-6622",
      companyName: "비스트로 전주",
      businessNumber: "418-81-60003", representative: "박셰프 대표", industry: "양식",
      address: "전북특별자치도 전주시 완산구 효자동 3-1",
      description: "전주 로컬 식재료 + 유럽 조리법 모던 유러피안. 자체 사퀴테리(훈제 · 염장) 생산. 계절 코스 월 변경. 전주 MZ세대 데이트 · 기업 접대 단골. 호원대 On-D-Gourmet 협력사.",
      idealTalent: "양식조리기능사 보유 또는 취득 예정. 사퀴테리 · 소시지 · 테린 제조 관심자. 호원대 수료자 가점. 해외 2주 단기 연수 연간 1회 지원.",
      employeeCount: 14, isVerified: true,
    },
  ];

  for (const c of companiesData) {
    const existing = await prisma.user.findUnique({
      where: { email: c.email },
      include: { company: true },
    });

    if (existing) {
      // 기존 계정: User + Company 모두 최신 정보로 업데이트
      await prisma.user.update({
        where: { id: existing.id },
        data: { name: c.name, phone: c.phone },
      });
      if (existing.company) {
        await prisma.company.update({
          where: { id: existing.company.id },
          data: {
            companyName: c.companyName, businessNumber: c.businessNumber,
            representative: c.representative, industry: c.industry,
            address: c.address, description: c.description,
            idealTalent: c.idealTalent, employeeCount: c.employeeCount,
            website: c.website ?? null, isVerified: c.isVerified,
          },
        });
      } else {
        await prisma.company.create({
          data: {
            userId: existing.id,
            companyName: c.companyName, businessNumber: c.businessNumber,
            representative: c.representative, industry: c.industry,
            address: c.address, description: c.description,
            idealTalent: c.idealTalent, employeeCount: c.employeeCount,
            website: c.website ?? null, isVerified: c.isVerified,
          },
        });
      }
    } else {
      await prisma.user.create({
        data: {
          email: c.email, password: companyPassword, name: c.name,
          role: "COMPANY", phone: c.phone,
          company: {
            create: {
              companyName: c.companyName, businessNumber: c.businessNumber,
              representative: c.representative, industry: c.industry,
              address: c.address, description: c.description,
              idealTalent: c.idealTalent, employeeCount: c.employeeCount,
              website: c.website ?? null, isVerified: c.isVerified,
            },
          },
        },
      });
    }
  }

  // ==================== 채용공고 ====================
  const companyMap = new Map<string, string>();
  for (const c of companiesData) {
    const comp = await prisma.company.findFirst({ where: { companyName: c.companyName } });
    if (comp) companyMap.set(c.companyName, comp.id);
  }

  // ================================================================
  // 채용공고 - 업종별 실제 업계 기준 급여/시간 (2026년 기준)
  // 호텔 | 프랜차이즈 | 단체급식 | 한식명가 | 특화외식
  // ================================================================
  const jobsData: Array<{
    key: string; companyName: string; title: string; field: string;
    description: string; requirements?: string; salary?: string;
    workLocation?: string; workSchedule?: string; benefits?: string;
    recruitCount?: number; deadline?: Date;
  }> = [
    // ====== [ 호텔 · 리조트 ] ======
    {
      key: "job-lahan-1", companyName: "라한호텔 전주",
      title: "[라한호텔 전주] 한식당 '온리원' 조리 보조 (신입)", field: "한식",
      description: "라한호텔 전주 시그니처 한식 레스토랑 '온리원'에서 조리 보조를 모집합니다.\n\n[주요 업무]\n- 전주식 한정식 코스 조리 보조 (전식 · 메인 · 후식 단계별)\n- 호텔급 플레이팅 · 위생 기준 준수\n- 인룸 다이닝 주문 대응\n- 선배 조리사의 1:1 OJT (6개월 집중 교육)\n\n[커리어]\n- 1~2년차: 조리보조 → 주방 코미\n- 3~5년차: 섹션 셰프\n- 7년+: 주방 부팀장 · 총괄 셰프 트랙",
      requirements: "• 한식조리기능사 자격증 필수 (또는 2026년 취득 예정)\n• 조리 관련 고교/대학 재학·졸업\n• 3교대 (조 · 주 · 석) 가능자\n• 4년제 대학 이상 우대\n• 영어 기초 가능자 우대 (외국인 고객 응대)",
      salary: "월 250~280만원 (수습 3개월 90%) · 호텔 통상임금",
      workLocation: "전주시 완산구 기린대로 85 (라한호텔)",
      workSchedule: "3교대 (06:00~14:00 / 14:00~22:00 / 22:00~06:00)",
      benefits: "4대보험 · 퇴직금 · 명절상여 연 200% · 경조사비 · 유니폼 제공 · 호텔 임직원 할인 · 교통비 · 식사 3식 · 법정 연차 15일",
      recruitCount: 3, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-lahan-2", companyName: "라한호텔 전주",
      title: "[라한호텔 전주] 올데이 뷔페 · 연회 조리사 (경력/신입)", field: "양식",
      description: "라한호텔 올데이 다이닝 뷔페 + 연회 행사 (웨딩 · 돌잔치 · 기업행사) 조리사 모집.\n\n[주요 업무]\n- 뷔페 라인 (양식 · 한식 · 중식 · 디저트) 파트 담당\n- 연회 행사 (200~500인분) 단체 조리\n- 시즌 메뉴 개발 참여 (월 1회)\n- 식자재 발주 · 재고 관리 보조",
      requirements: "• 양식조리기능사 우대 (한식·중식 기능사도 가능)\n• 호텔/웨딩 연회 조리 경험자 우대\n• 대량 조리 가능한 체력\n• 주말 · 공휴일 근무 가능 (대체 휴무)",
      salary: "월 260~320만원 (경력 별도 협의, 연봉제)",
      workLocation: "전주시 완산구 기린대로 85",
      workSchedule: "주5일 · 2교대 (06:00~15:00 / 13:00~22:00)",
      benefits: "4대보험 · 성과급 · 연 2회 정기 상여 · 호텔 숙박권 · 전문 유니폼 · 해외 호텔 연수 기회 (연 1회 선발)",
      recruitCount: 2, deadline: new Date("2026-08-31"),
    },
    {
      key: "job-bwgunsan-1", companyName: "베스트웨스턴 군산호텔",
      title: "[BW군산] 뷔페 라운드 조리 및 연회 서비스 (신입)", field: "양식",
      description: "베스트웨스턴 군산호텔 뷔페 레스토랑 '라운드' 및 연회장 조리·서비스 인재 모집.\n\n[주요 업무]\n- 조식 뷔페 세팅 (양식·한식·중식 파트)\n- 연회장 웨딩·돌잔치 행사 지원 (월 20건+)\n- 인룸 다이닝 주문 대응\n- 호텔 체인 표준 매뉴얼 교육 제공",
      requirements: "• 조리 관련 학과 재학/졸업\n• 호텔 서비스 관심자\n• 체력 · 책임감\n• 영어 · 일어 · 중어 기초 가능자 우대",
      salary: "월 235~260만원 (수습 3개월 90%)",
      workLocation: "군산시 대학로 330 (베스트웨스턴 군산)",
      workSchedule: "3교대 (06:00~15:00 / 14:00~23:00 / 야간 로테이션)",
      benefits: "4대보험 · 퇴직금 · BW 호텔 글로벌 체인 숙박 할인 · 식사제공 · 유니폼 · 교통비 · 장기근속 포상",
      recruitCount: 4, deadline: new Date("2026-09-15"),
    },
    {
      key: "job-muju-1", companyName: "덕유산리조트 (부영그룹)",
      title: "[덕유산리조트] 시즌 조리 인력 (기숙사 · 시즌 집중 근무)", field: "양식",
      description: "무주 덕유산리조트 F&B 10개 업장 조리 인력 모집. 스키 시즌 11~3월 집중 운영.\n\n[주요 업무]\n- 메인 뷔페 '실크로드' 또는 한식당 · 양식당 · 바비큐하우스 중 배치\n- 1일 평균 2,000인분 대량 조리\n- 숙박 고객 대상 식음 서비스\n- 시즌제 후 연장 계약 / 정규직 전환 가능",
      requirements: "• 조리 자격증 소지 (한식/양식/중식 무관)\n• 기숙사 입주 가능자 (지방 학생 환영)\n• 시즌 집중 근무 가능 (11~3월 주6일)\n• 체력 필수",
      salary: "월 260~290만원 (성수기 수당 포함) · 기숙사 식비 전액 지원",
      workLocation: "무주군 설천면 만선로 185 (덕유산리조트)",
      workSchedule: "시즌 (11~3월) 주6일 · 비시즌 주5일 · 8시간",
      benefits: "4대보험 · 기숙사 무료 (1인실/2인실) · 식사 3식 제공 · 리프트권 · 워터파크 이용권 · 리조트 내 부대시설 임직원 할인",
      recruitCount: 15, deadline: new Date("2026-10-31"),
    },

    // ====== [ 프랜차이즈 본사 · 체인 ] ======
    {
      key: "job-leesungdang-1", companyName: "이성당 (주식회사 이성당)",
      title: "[이성당] 정규직 제빵사 (단팥빵 · 야채빵 라인)", field: "제과제빵",
      description: "대한민국 최고령 빵집 이성당 군산 본점 제빵사 정규직 모집.\n\n[주요 업무]\n- 단팥빵 · 야채빵 · 채단팥빵 반죽 · 분할 · 성형 · 굽기\n- 80년 전통 레시피 학습 및 준수\n- 일 생산량 관리 (본점 일 평균 단팥빵 8,000개+)\n- 신메뉴 R&D 참여 기회 (경력 3년+)\n\n[승진 코스]\n- 제빵사 → 라인장 → 공장장 → 본사 R&D 팀장",
      requirements: "• 제빵기능사 필수 (제과기능사 병행 보유 우대)\n• 새벽 근무 (04:30 출근) 가능자\n• 군산 거주 가능 또는 기숙사 입주 (타지역 학생 환영)\n• 장기 근속 의지 필수 (최소 3년)",
      salary: "월 260~290만원 (수습 3개월 95%) · 경력 별도",
      workLocation: "군산시 중앙로 177 (이성당 본점)",
      workSchedule: "주5일 · 04:30~13:30 (8시간 + 휴게 1시간)",
      benefits: "4대보험 · 퇴직금 · 명절상여 연 150% · 기숙사 (1인실) · 식사 2식 제공 · 전국 매장 근무 전환 기회 (서울/부산/제주) · 자녀 학자금",
      recruitCount: 5, deadline: new Date("2026-06-30"),
    },
    {
      key: "job-leesungdang-2", companyName: "이성당 (주식회사 이성당)",
      title: "[이성당] 매장 판매직 · 카페 바리스타", field: "카페·베이커리",
      description: "이성당 군산 본점 1층 매장 판매 및 2층 카페 바리스타 모집.\n\n[주요 업무]\n- 고객 응대 · POS · 제품 진열 (본점 하루 방문객 3,000명)\n- 에스프레소 음료 제조 (에스프레소/아메리카노/라떼 등)\n- 외국인 관광객 응대 (영/중/일 기초 회화)",
      requirements: "• 고졸 이상\n• 바리스타 2급 이상 우대\n• 서비스 마인드 · 체력 · 순발력\n• 외국어 기초 우대",
      salary: "월 220~240만원 · 수당 별도",
      workLocation: "군산시 중앙로 177 (이성당 본점)",
      workSchedule: "주5일 · 2교대 (08:00~17:00 / 13:00~22:00)",
      benefits: "4대보험 · 퇴직금 · 제품 50% 할인 · 식사제공 · 유니폼 · 장기근속 포상 (근속 3년 특별 상여)",
      recruitCount: 3, deadline: new Date("2026-07-15"),
    },
    {
      key: "job-pnb-1", companyName: "PNB풍년제과 (주식회사 PNB)",
      title: "[PNB풍년제과] 수제 초코파이 · 케이크 제과사", field: "제과제빵",
      description: "전주 대표 70년 제과 PNB풍년 본점 제과사 모집.\n\n[주요 업무]\n- 수제 초코파이 반죽 · 성형 · 마시멜로 충전 (일 1,500개 생산)\n- 생크림 케이크 · 쿠키 · 파이 · 시즌 상품 제조\n- 본점 5개 직영점 납품 라인 가동\n- 시즌별 신메뉴 R&D 참여 (추석/크리스마스 특별판)",
      requirements: "• 제과기능사 필수 (제빵기능사 겸비 가점)\n• 제과 관련 학과 졸업 또는 재학생\n• 위생 관리 철저 · 꼼꼼함\n• 전주 거주 또는 이주 가능자",
      salary: "월 240~270만원 · 수습 3개월 90%",
      workLocation: "전주시 완산구 팔달로 180 (PNB풍년 본점)",
      workSchedule: "주5일 · 07:00~16:00",
      benefits: "4대보험 · 퇴직금 · 연 2회 정기상여 · 제품 할인 60% · 식사제공 · 직영점 매니저 승진 코스 (3년+) · 본사 R&D 이동",
      recruitCount: 3, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-veteran-1", companyName: "베테랑 (전주 본점)",
      title: "[베테랑 칼국수] 본점 조리 및 면 반죽 담당", field: "한식",
      description: "전주 칼국수 원조 베테랑 본점(경기전 앞) 조리사 모집.\n\n[주요 업무]\n- 손칼국수 반죽 · 숙성 · 면 뽑기 (하루 평균 2,000그릇)\n- 육수 우리기 · 들깨 소스 제조\n- 수육 · 만두 · 김치 등 사이드 메뉴\n- 프랜차이즈 전국 12호점 표준 교육 연계",
      requirements: "• 한식조리기능사 우대\n• 피크타임 순발력 필수 (점심 12~14시 대기 1시간 이상)\n• 면 반죽 경험자 우대 · 체력 필수\n• 프랜차이즈 본사 강사 커리어 희망자 환영",
      salary: "월 230~260만원 · 성과급 별도",
      workLocation: "전주시 완산구 경기전길 135 (베테랑 본점)",
      workSchedule: "주5일 · 09:00~20:00 (브레이크 14:30~16:00)",
      benefits: "4대보험 · 식사 3식 제공 · 프랜차이즈 본사 승진 트랙 · 직영 지점 매니저 전환 기회 · 명절상여",
      recruitCount: 4, deadline: new Date("2026-08-15"),
    },

    // ====== [ 단체급식 대기업 ] ======
    {
      key: "job-ourhome-1", companyName: "아워홈 전북지점 (단체급식)",
      title: "[아워홈] 단체급식 조리원 정규직 (전북대병원 사업장)", field: "급식조리",
      description: "아워홈 전북대병원 사업장(하루 2,500식) 조리원 정규직 모집.\n\n[주요 업무]\n- 환자식 조리 (일반식 · 당뇨식 · 신장식 등 치료식 10종)\n- HACCP 기준 위생 관리\n- 조리 매뉴얼 준수 · 영양사 지시 이행\n- 단체 대량 조리 (100~500인분 단위)\n- 환자 · 보호자 · 직원 배식 라인 운영",
      requirements: "• 한식 또는 단체급식조리사 자격증 필수\n• 위생교육 필수 이수 (입사 후 지원)\n• 새벽 근무 가능 (04:30 출근)\n• 장기 근속 희망자",
      salary: "월 250~280만원 · 호봉제 · 근속 수당",
      workLocation: "전주시 덕진구 (전북대병원 내)",
      workSchedule: "주5일 · 04:30~13:30 (휴게 1시간)",
      benefits: "4대보험 · 퇴직금 (DC/DB 선택) · 명절상여 연 200% · 자녀 학자금 (고교·대학) · 하계 휴가비 · 경조사비 · 의료비 지원 · 사내 복지카드",
      recruitCount: 6, deadline: new Date("2026-09-30"),
    },
    {
      key: "job-ourhome-2", companyName: "아워홈 전북지점 (단체급식)",
      title: "[아워홈] 영양사 (학교급식 사업장)", field: "급식조리",
      description: "아워홈 전북 관내 초 · 중 · 고등학교 급식 사업장 영양사 모집.\n\n[주요 업무]\n- 식단 작성 (주간/월간, NEIS 업로드)\n- 식자재 검수 · 발주 · 재고 관리\n- 조리원 관리 · 작업 배정\n- 위생 점검 · 교육\n- 학생/교직원 영양 상담",
      requirements: "• 영양사 국가자격증 필수\n• HACCP 교육 이수자\n• NEIS 시스템 활용 가능자 우대\n• 학교급식 경력 우대 (신입 지원 가능)",
      salary: "월 280~310만원 (초임) · 경력 별도",
      workLocation: "전북 관내 학교 사업장 (전주·군산·익산·완주 등)",
      workSchedule: "주5일 · 07:30~16:30 (방학 중 단축 근무)",
      benefits: "4대보험 · 퇴직금 · 방학 중 유급 휴가 · 명절상여 · 경조사비 · 자녀 학자금 · 교육 연수비 지원 (영양사 보수교육)",
      recruitCount: 3, deadline: new Date("2026-08-31"),
    },
    {
      key: "job-cjfreshway-1", companyName: "CJ프레시웨이 전북영업소",
      title: "[CJ프레시웨이] 단체급식 조리원 (공공기관 사업장)", field: "급식조리",
      description: "CJ프레시웨이 전북도청 · 공기업 구내식당 조리원 정규직 모집.\n\n[주요 업무]\n- 하루 평균 800~1,200식 단체조리\n- 한식 · 양식 · 일품요리 로테이션\n- HACCP · 식품안전 시스템 준수\n- 대기업 표준 매뉴얼 교육 제공",
      requirements: "• 한식조리사 또는 단체급식조리사 자격증\n• 대량조리 경력자 우대 (신입 가능)\n• 전주·완주·익산 거주자 우대\n• 위생관리사 자격 우대",
      salary: "월 245~275만원 · CJ 호봉제",
      workLocation: "전주시 덕진구 (전북도청 구내식당 외)",
      workSchedule: "주5일 · 05:30~14:30",
      benefits: "4대보험 · 퇴직금 · CJ 임직원 복지 포인트 연 60만원 · 사내 복지몰 (CJ ONE) · 명절상여 · 경조사비 · 건강검진 연 1회",
      recruitCount: 4, deadline: new Date("2026-09-15"),
    },

    // ====== [ 한식 노포 · 명가 ] ======
    {
      key: "job-gogung-1", companyName: "고궁 (전주 한옥마을 본점)",
      title: "[고궁] 전주비빔밥 전문 조리사 (신입/경력)", field: "한식",
      description: "전주비빔밥 명가 '고궁' 한옥마을 본점 조리사 모집.\n\n[주요 업무]\n- 전주비빔밥 · 돌솥비빔밥 · 육회비빔밥 조리\n- 나물 20여 가지 손질 · 무침\n- 반찬 · 탕 · 전 등 한식 전반\n- 외국인 관광객 비중 30% (간단 응대)\n\n[승진]\n- 본점 3년 후 평양점 · 서울점 · 센터필드점 이동 가능",
      requirements: "• 한식조리기능사 필수\n• 조리 관련 학과 재학/졸업\n• 장기 근속 의지 · 성실\n• 영어 초급 가능자 우대",
      salary: "월 240~270만원 · 경력 협의",
      workLocation: "전주시 완산구 전주객사3길 22 (한옥마을)",
      workSchedule: "주5일 · 10:00~21:00 (브레이크 14:30~17:00)",
      benefits: "4대보험 · 식사제공 · 자격증 취득 지원비 · 해외 지점 근무 기회 · 명절상여 · 인센티브",
      recruitCount: 3, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-samback-1", companyName: "삼백집",
      title: "[삼백집] 콩나물국밥 전문 조리 (새벽 근무)", field: "한식",
      description: "1947년 창업 전주 콩나물국밥 원조 삼백집 조리 인력 모집.\n\n[주요 업무]\n- 콩나물국밥 조리 (하루 600~800그릇)\n- 24시간 우린 멸치·새우 육수 관리\n- 모주 제조 · 반찬 준비\n- 위생 · 식자재 검수",
      requirements: "• 새벽 근무 가능 필수 (05:00 출근)\n• 한식조리기능사 우대\n• 체력 · 성실성\n• 전주 거주 또는 이주 가능",
      salary: "월 230~255만원 · 새벽 수당 포함",
      workLocation: "전주시 완산구 전주객사2길 22",
      workSchedule: "주5일 · 05:00~14:00",
      benefits: "4대보험 · 식사제공 · 명절상여 · 장기근속 포상 (5년+)",
      recruitCount: 2, deadline: new Date("2026-06-30"),
    },
    {
      key: "job-wangyijip-1", companyName: "왱이집 (24시 콩나물국밥)",
      title: "[왱이집] 24시 운영 · 야간 전담 조리사", field: "한식",
      description: "24시간 운영 왱이집의 야간~새벽 시간대 전담 조리사 모집.\n\n[주요 업무]\n- 야간/새벽 시간대 콩나물국밥 조리 (일 200그릇)\n- 해장 손님 응대\n- 모주 · 반찬 정리 · 주방 위생\n- 야간수당 50% 가산",
      requirements: "• 야간 근무 가능 필수 (23:00 출근)\n• 성실함 · 책임감\n• 한식조리기능사 우대",
      salary: "월 270~300만원 (야간수당 포함)",
      workLocation: "전주시 완산구 동문길 88",
      workSchedule: "주5일 · 23:00~09:00 (10시간)",
      benefits: "4대보험 · 야간수당 · 식사제공 · 통근버스 · 명절상여",
      recruitCount: 2, deadline: new Date("2026-07-15"),
    },
    {
      key: "job-hwasim-1", companyName: "원조 화심순두부 (본점)",
      title: "[화심순두부] 전통 순두부 제조 (기숙사 제공)", field: "한식",
      description: "완주 화심순두부 본점 전통 가마솥 순두부 제조 인력 모집.\n\n[주요 업무]\n- 가마솥 순두부 제조 (국산 콩 100%, 일 500kg)\n- 두부 응고 · 성형\n- 한식 메인 요리 조리\n- 주말 기준 일 2,000명 응대",
      requirements: "• 새벽 근무 필수 (04:30 출근)\n• 체력 · 성실함\n• 완주/전주 거주자 우대 또는 기숙사 입주\n• 한식조리기능사 우대",
      salary: "월 250~280만원 · 기숙사 무료",
      workLocation: "완주군 소양면 화심순두부길 89",
      workSchedule: "주5일 · 04:30~13:30 (두부 제조 파트) 또는 10:00~20:00 (홀/조리 파트)",
      benefits: "4대보험 · 기숙사 제공 (1인실 · 식비 포함) · 명절상여 · 장기근속 인센티브 · 직영 체인점 (전주/대전/수원) 매니저 승진",
      recruitCount: 3, deadline: new Date("2026-08-15"),
    },
    {
      key: "job-chueohang-1", companyName: "남원 새집추어탕 본점",
      title: "[남원 새집추어탕] 4대째 전통 추어탕 조리사", field: "한식",
      description: "1959년 창업 · 4대째 가업 새집추어탕 본점 조리사 모집.\n\n[주요 업무]\n- 미꾸라지 손질 · 삶기 · 갈기\n- 남원산 시래기 · 된장 · 들깨 베이스 추어탕\n- 추어 튀김 · 숙회 · 전 등 코스\n- 지리산 둘레길 방문객 일 300~500명 응대",
      requirements: "• 한식조리기능사 우대\n• 남원 거주/이주 가능자 우대\n• 기숙사 입주 가능\n• 향토음식 계승 의지",
      salary: "월 230~260만원 · 기숙사 지원",
      workLocation: "남원시 천거길 41 (광한루 인근)",
      workSchedule: "주5일 · 10:00~21:00",
      benefits: "4대보험 · 이주 지원금 · 기숙사 지원 · 명절상여 · 전국 체인 (서울/대전/전주) 매니저 진로 · 향토음식 계승 장학",
      recruitCount: 2, deadline: new Date("2026-09-30"),
    },

    // ====== [ 특화 외식 ] ======
    {
      key: "job-bokseongru-1", companyName: "복성루 (군산 중식)",
      title: "[복성루] 중식 웍 · 면 견습 (정통 중식 커리어)", field: "중식",
      description: "미슐랭 빕구르망 3년 연속 선정 · 맑은 짬뽕 원조 복성루 견습생 모집.\n\n[주요 업무]\n- 웍 · 면 · 불판 관리 견습 (전통 5년 도제식 교육)\n- 맑은 짬뽕 · 짜장 · 탕수육 조리 보조\n- 육수 · 양념 베이스 관리\n- 일 400그릇 피크타임 대응",
      requirements: "• 중식조리기능사 우대 (신입 지원 가능)\n• 체력 필수 (웍 작업 반복)\n• 5년 이상 근속 의지\n• 군산 거주 또는 기숙사 입주",
      salary: "월 240~270만원 · 5년차 이상 시 월 350만원+",
      workLocation: "군산시 월명로 382",
      workSchedule: "주5일 · 10:00~21:30 (브레이크 14:00~16:00)",
      benefits: "4대보험 · 기숙사 제공 · 식사 2식 · 명절상여 · 5년 차 시 웍 셰프 승진 · 10년 차 시 수석 셰프 · 일본/대만 연수 기회",
      recruitCount: 2, deadline: new Date("2026-08-15"),
    },
    {
      key: "job-gyehwa-1", companyName: "계화회관 (부안 해물탕)",
      title: "[계화회관] 해산물 · 바지락죽 전문 조리사", field: "한식",
      description: "부안 계화회관 해산물 전문 조리사 모집 (미슐랭 빕구르망 선정).\n\n[주요 업무]\n- 바지락죽 · 백합죽 조리 (부안 앞바다 직송 해산물)\n- 해물탕 · 조개구이 · 생선구이\n- 새벽 격포항 시장 동행 식재료 선별\n- 관광객 일 1,000명 응대",
      requirements: "• 한식조리기능사 필수\n• 해산물 손질 경험자 적극 우대\n• 부안 · 군산 거주자 또는 이주 가능\n• 기숙사 입주 가능",
      salary: "월 250~280만원 · 경력 별도",
      workLocation: "부안군 계화면 돈지길 64",
      workSchedule: "주5일 · 04:30~13:30 (시장 동행 파트) 또는 10:00~20:00",
      benefits: "4대보험 · 기숙사 제공 · 식사제공 · 성과 인센티브 · 이주지원금 · 격포항 직거래 경험",
      recruitCount: 2, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-imsil-1", companyName: "임실N치즈테마파크 (치즈 레스토랑)",
      title: "[임실N치즈] 치즈 요리 전문 · 이주 지원금 제공", field: "카페·베이커리",
      description: "임실치즈농협 운영 치즈 테마파크 F&B 인력 모집 (관광객 연 50만).\n\n[주요 업무]\n- 피자 · 치즈케이크 · 퐁듀 · 라클렛 조리\n- 임실치즈 특화 신메뉴 개발 참여\n- 치즈 만들기 체험 프로그램 보조 강사\n- 카페 바리스타 업무 병행",
      requirements: "• 제과기능사 또는 바리스타 자격증 우대\n• 유제품에 대한 이해\n• 임실 지역 거주 또는 이주 가능자\n• 관광객 서비스 마인드",
      salary: "월 230~260만원 · 이주지원금 200만원 (입사 후 3개월 경과)",
      workLocation: "임실군 성수면 도인2길 50",
      workSchedule: "주5일 · 09:00~18:00",
      benefits: "4대보험 · 이주지원금 · 기숙사 제공 가능 · 임실치즈 제품 할인 · 통근버스 (임실역)",
      recruitCount: 4, deadline: new Date("2026-08-31"),
    },
    {
      key: "job-vegegeun-1", companyName: "베지근 (전주 모던 한식)",
      title: "[베지근] 모던 한식 파인다이닝 주니어 셰프", field: "퓨전요리",
      description: "전주 모던 한식 파인다이닝 베지근 (예약대기 2개월) 주니어 셰프 모집.\n\n[주요 업무]\n- 10코스 테이스팅 메뉴 조리 보조\n- 30년 씨간장 · 지역 농가 직거래 식재료 활용\n- 월 단위 계절 메뉴 변경 참여\n- 플레이팅 R&D · 포트폴리오 작성",
      requirements: "• 조리 관련 학과 재학 또는 졸업\n• 파인다이닝 관심자 · 포트폴리오 있으면 가점\n• 호원대 On-D-Gourmet 이수자 적극 우대\n• 영어 기초 (해외 셰프 교류)",
      salary: "월 260~320만원 · 포트폴리오/경력 협의",
      workLocation: "전주시 덕진구 기린대로 418",
      workSchedule: "주5일 · 11:00~22:00 (브레이크 15:00~17:30)",
      benefits: "4대보험 · 식사제공 · 해외 연수 기회 연 1회 · 메뉴 개발 인센티브 · 셰프 직함 3년 내 부여",
      recruitCount: 2, deadline: new Date("2026-07-15"),
    },
    {
      key: "job-bistro-1", companyName: "비스트로 전주",
      title: "[비스트로 전주] 양식 & 사퀴테리 주니어 셰프", field: "양식",
      description: "전주 모던 유러피안 비스트로 전주 주니어 셰프 모집 (On-D-Gourmet 협력사).\n\n[주요 업무]\n- 양식 코스 요리 조리 보조 (애피타이저·메인·디저트)\n- 사퀴테리 (훈제 · 염장 · 소시지 · 테린) 제조\n- 로컬 식재료 기반 월별 메뉴 개발\n- 연 1회 해외 단기 연수 (프랑스/이탈리아)",
      requirements: "• 양식조리기능사 보유 또는 취득 예정\n• 호원대 On-D-Gourmet 2차 (양식·사퀴테리) 수료자 적극 우대\n• 영어 기초 · 새로운 조리법 학습 의지\n• 포트폴리오 있으면 경력 인정",
      salary: "월 250~290만원 · 수료자 가점 30만원",
      workLocation: "전주시 완산구 효자동 3-1",
      workSchedule: "주5일 · 11:00~22:00 (브레이크 15:00~17:00)",
      benefits: "4대보험 · 식사제공 · 해외 연수 (프랑스 2주) · 자격증 취득 지원 · 호원대 교수 자문 · 와인 페어링 교육",
      recruitCount: 2, deadline: new Date("2026-06-30"),
    },
  ];

  for (const j of jobsData) {
    const companyId = companyMap.get(j.companyName);
    if (!companyId) { console.warn(`Company not found: ${j.companyName}`); continue; }
    await prisma.jobPosting.upsert({
      where: { id: j.key },
      update: {},
      create: {
        id: j.key,
        companyId, title: j.title, field: j.field,
        description: j.description, requirements: j.requirements ?? null,
        salary: j.salary ?? null, workLocation: j.workLocation ?? null,
        workSchedule: j.workSchedule ?? null, benefits: j.benefits ?? null,
        recruitCount: j.recruitCount ?? null,
        deadline: j.deadline ?? null, status: "OPEN",
      },
    });
  }

  // ==================== 공지사항 (재생성) ====================
  await prisma.notice.deleteMany({});
  const noticesData = [
    {
      title: "🎉 맛JobGO 플랫폼 공식 오픈!",
      content: "전북의 맛을 품은 로컬조리인재 양성 플랫폼, 맛JobGO가 정식 오픈했습니다.\n\n호원대학교 RISE사업 Track 4-3-2 과제의 일환으로, 직업계고 학생 · 전북 지역 외식업체 · 호원대학교를 잇는 AI 기반 인재 매칭 플랫폼입니다.\n\n- 학생: 이력서·자기소개서 등록, AI 기반 기업 매칭\n- 기업: 채용공고 등록, 맞춤 인재 추천\n- 대학: 프로그램 운영, 매칭 현황 모니터링\n\n많은 관심과 참여 부탁드립니다.",
      isPinned: true,
    },
    {
      title: "[필독] 2026년도 2차년도 사업 로드맵 안내",
      content: "맛잡고사업단 2차년도 주요 로드맵을 안내드립니다.\n\n◆ 2026년 상반기\n- On-D-Gourmet 2차 교육 (양식조리 & 사퀴테리)\n- COOKING 브릿지 조리대회 지도 (2차년도)\n- 해외 우수인재 원스톱 지원 연계\n\n◆ 2026년 하반기\n- 하이브리드 조리대회 개최\n- 조리융합캠프 3·4차\n- 지역 사회봉사 (김장봉사 2차년도)\n- 제과제빵실 본격 운영",
      isPinned: true,
    },
    {
      title: "[공지] 2025년 On-D-Gourmet 1차 교육 결과보고",
      content: "2025년 7월 7일~11일, 호원대학교에서 진행된 On-D-Gourmet 취업지원 프로그램 1차 교육이 성공적으로 종료되었습니다.\n\n- 참여 인원: 덕암정보고 · 진경여고 학생 24명\n- 교육 내용: K-로컬 아시안 퀴진, 명장 카페·베이커리 과정\n- 만족도 조사: 4.7/5.0\n- 결과물 갤러리는 '교육프로그램' 페이지에서 확인하실 수 있습니다.",
      isPinned: false,
    },
    {
      title: "[결과] 2025 COOKING 브릿지 하이브리드 조리대회 수상자 발표",
      content: "2025년 12월 23일 진경여자고등학교에서 개최된 COOKING 브릿지 하이브리드 조리대회 수상자를 발표합니다.\n\n◆ 대상: 김○○ (진경여고 3)\n◆ 금상: 이○○ (덕암정보고 3), 박○○ (남원제일고 2)\n◆ 은상 3명 / 동상 5명\n\n수상자에게는 호원대 호텔조리학과 진학 시 장학금 혜택이 제공됩니다. 참여해주신 모든 학생들께 감사드립니다.",
      isPinned: false,
    },
    {
      title: "[모집] On-D-Gourmet 2차 교육 (양식조리 & 사퀴테리) 참가자",
      content: "호원대학교 호텔조리학과에서 진행하는 On-D-Gourmet 2차 교육 참가자를 모집합니다.\n\n- 대상: 직업계고 재학생 30명\n- 일정: 2026년 5~6월 중 5일간\n- 장소: 호원대학교 서양식 실습실\n- 교육 내용: 양식 기본기, 사퀴테리(샤퀴테리) 제조, 전북 로컬 식재료 활용\n- 지원 사항: 조리복/조리도구, 식재료, 여행자보험, 교통비 일부 지원\n- 신청 방법: 소속 학교 담임교사를 통해 접수",
      isPinned: false,
    },
    {
      title: "[공지] 제과제빵실 구축공사 완료 및 본격 운영 시작",
      content: "2025년 12월 22일자로 호원대학교 호텔조리학과 제과제빵실 구축공사가 완료되었습니다.\n\n- 총 30인 동시 실습 가능\n- 최신 데크오븐, 발효기, 도우시트기 구비\n- 2026학년도부터 On-D-Gourmet 프로그램 본격 운영 예정\n\n직업계고 학생 및 지역사회 대상 개방 프로그램도 순차적으로 확대 예정입니다.",
      isPinned: false,
    },
    {
      title: "[결과] 2025 조리융합캠프 1·2차 진행 결과",
      content: "2025년 11월 28일(1차), 12월 7일(2차)에 진행된 COOKING 브릿지 융합형 조리캠프가 성공적으로 종료되었습니다.\n\n- 참여 학교: 진경여고, 덕암정보고, 남원제일고\n- 참여 인원: 총 80명 (1차 40명 + 2차 40명)\n- 주요 프로그램: 지역·타지역 고교 협력 융합 조리 실습, 전북 외식문화 교류\n- 만족도: 4.8/5.0\n\n2차년도 3·4차 캠프는 2026년 하반기 개최 예정입니다.",
      isPinned: false,
    },
    {
      title: "[감사] 김장봉사활동 1·2차 참여 학생·학부모님께 감사드립니다",
      content: "2025년 12월 5일(진경여고)·10일(덕암정보고)에 진행된 김장봉사활동이 성공적으로 마무리되었습니다.\n\n- 참여 인원: 총 60명 (진경 30명 + 덕암 30명)\n- 지원 대상: 지역 독거 어르신 40가구\n- 제공량: 김치 약 400포기\n\n학생들의 자발적인 참여와 학부모님들의 적극적인 협조 덕분에 의미 있는 지역 나눔을 실천할 수 있었습니다. 진심으로 감사드립니다.",
      isPinned: false,
    },
    {
      title: "[공지] 조리 교사 직무연수 신청 안내 (2026)",
      content: "2026학년도 직업계고 조리 교사 직무연수 신청을 받습니다.\n\n- 대상: 전북 지역 직업계고 조리 담당 교사\n- 과정: NCS 국가직무표준능력 고도화 연수 (30시간)\n- 일정: 2026년 여름방학 중 (세부 일정 추후 공지)\n- 내용: 최신 조리 트렌드, 산업체 연계 실습, 평가 기법\n- 신청: 소속 학교를 통해 교육청 공문으로 접수",
      isPinned: false,
    },
    {
      title: "[발간] '직업계고 고등학생의 지역이탈 결정요인과 지역정주 활성화 조건 방안' 정책연구 보고서",
      content: "맛잡고사업단이 실시한 정책연구 보고서가 발간되었습니다.\n\n- 주제: 직업계고 고등학생의 지역이탈 결정요인과 지역정주 활성화 조건 방안\n- 연구 대상: 전북 직업계고 학생 약 500명 + 지역 기업 인사담당자\n- 주요 결론: 지역 정주율 제고를 위한 대학-직업계고-지역기업 연계 매칭 플랫폼 필요성 입증\n\n보고서는 호원대학교 RISE사업단을 통해 요청 시 열람 가능합니다.",
      isPinned: false,
    },
    {
      title: "[안내] 만족도 조사 결과 및 개선사항 반영",
      content: "2025년도 1차년도 프로그램 만족도 조사 결과를 공유드립니다.\n\n- 전체 평균 만족도: 4.7/5.0\n- 주요 강점: 실습 중심 교육 (4.9), 강사 전문성 (4.8), 재료 품질 (4.8)\n- 개선 요청: 실습 시간 확대, 개인별 피드백 강화, 지역 기업 현장 방문 기회 확대\n\n이를 반영하여 2차년도에는 개인 멘토링 시간 2배 확대, 기업 현장 방문 프로그램 신설 예정입니다.",
      isPinned: false,
    },
    {
      title: "[협약] 전북 주요 외식업체 15곳과 산학협력 MOU 체결",
      content: "맛잡고사업단이 전북 주요 외식업체 15곳과 산학협력 양해각서(MOU)를 체결했습니다.\n\n주요 참여 업체:\n- 한식: 고궁수라간, 한국관, 전라회관, 삼백집 등\n- 제과제빵: 이성당(군산), PNB풍년제과\n- 퓨전/양식: 베지근, 비스트로 전주\n- 향토음식: 화심순두부, 남원 추어향, 계화회관 등\n\n협력 내용: 학생 현장실습, 채용 연계, 메뉴 개발 협력, 강사 초빙 등",
      isPinned: false,
    },
    {
      title: "[공지] 기업 회원 가입 및 채용공고 등록 안내",
      content: "전북 지역 외식업체 대표님 · 인사담당자님께 안내드립니다.\n\n맛JobGO 플랫폼에 기업 회원으로 가입하시면 다음 혜택이 제공됩니다.\n\n1. 무료 채용공고 등록 (무제한)\n2. AI 기반 맞춤 인재 추천\n3. 직업계고 학생 프로필 열람\n4. 호원대 호텔조리학과 교수진 자문\n5. 산학협력 MOU 체결 시 추가 지원\n\n가입 문의: inki0110@howon.ac.kr / 063-450-7261",
      isPinned: false,
    },
    {
      title: "[안내] 2026년 하반기 하이브리드 조리대회 개최 일정",
      content: "2026년 하반기 COOKING 브릿지 하이브리드 조리대회를 개최합니다.\n\n- 일정: 2026년 10~11월 중 (세부 일정 추후 공지)\n- 대상: 전북 직업계고 재학생\n- 방식: 온·오프라인 하이브리드 (예선 온라인, 본선 오프라인)\n- 상금: 총 500만원 (대상 200만원 등)\n- 특전: 수상자 호원대 호텔조리학과 장학 혜택\n\n참가 학교 모집은 2026년 7월 공지 예정입니다.",
      isPinned: false,
    },
    {
      title: "[공지] 재료비·조리복 등 지원 사항 안내",
      content: "맛잡고 프로그램 참여 학생 대상 지원 사항을 안내드립니다.\n\n- 조리복 세트 1식 (상의·하의·앞치마·모자·토크)\n- 교육 중 재료비 전액 지원\n- 교육 관련 교통비 1인당 1일 1만원\n- 숙박 프로그램 시 숙소·식사 제공\n- 여행자보험 가입\n\n모든 지원은 정부지원사업(RISE)으로 이루어지며 학생 본인 부담금은 없습니다.",
      isPinned: false,
    },
    {
      title: "[보도자료] 호원대 맛잡고사업, 전북일보 선정 '2025 지역혁신 우수사례'",
      content: "호원대학교 맛잡고사업단이 전북일보 선정 '2025 지역혁신 우수사례'에 선정되었습니다.\n\n- 선정 사유: 대학-직업계고-지역기업 3자 연계 플랫폼 구축으로 전북 직업계고 학생의 지역 정주율 제고에 기여\n- 게재일: 2025.12.28. 전북일보 15면\n\n앞으로도 전북 지역 조리 인재 양성과 외식산업 발전에 기여하는 대학으로 자리매김하겠습니다.",
      isPinned: false,
    },
    {
      title: "[안내] 플랫폼 1:1 메시지 기능 활용 가이드",
      content: "맛JobGO 플랫폼의 1:1 메시지 기능 활용법을 안내드립니다.\n\n◆ 학생 → 기업\n- 관심 기업에 궁금한 점 문의\n- 지원 후 추가 자료 전달\n- 인터뷰 일정 조율\n\n◆ 기업 → 학생\n- 관심 인재에게 스카우트 제안\n- 지원자에게 채용 진행 안내\n- 현장 견학 초청\n\n메시지는 실시간 알림이 가며, 대시보드 상단에서 읽지 않은 메시지 수를 확인할 수 있습니다.",
      isPinned: false,
    },
    {
      title: "[공지] 개인정보 보호 및 프로필 공개 설정 안내",
      content: "학생 회원의 개인정보 보호 및 프로필 공개 설정에 대해 안내드립니다.\n\n- 기본 설정: 프로필 공개 (기업이 학생 탐색 가능)\n- 비공개 전환: 학생 프로필 수정 페이지에서 언제든 변경 가능\n- 비공개 시 영향: 기업 학생 탐색 목록에서 제외되나, 본인이 직접 지원한 공고는 정상 열람 가능\n\n민감 정보(주민등록번호 등)는 수집하지 않으며, 이력서 PDF는 본인이 업로드·삭제할 수 있습니다.",
      isPinned: false,
    },
    {
      title: "[연계] 호원대 호텔조리학과 수시 전형 특별전형 안내",
      content: "맛JobGO 플랫폼 활동 학생 대상 호원대 호텔조리학과 수시 특별전형을 안내드립니다.\n\n- 대상: 맛잡고 프로그램 2개 이상 이수 + 조리 관련 자격증 보유자\n- 전형명: 지역혁신인재 특별전형\n- 가산점: 조리대회 수상자 최대 10점 가산\n- 장학 혜택: 전형 합격자 1학년 등록금 50% 감면 (학점 유지 시 4년 지속)\n\n자세한 사항은 호원대 입학처 (063-450-7800)로 문의해주세요.",
      isPinned: false,
    },
    {
      title: "[안내] 기자재 구입 완료 - 최신 실습 환경 구축",
      content: "2025년 11월 맛잡고사업 예산으로 호텔조리학과 실습실에 최신 기자재를 구축했습니다.\n\n- 인덕션 레인지 20대\n- 진공저온조리기(수비드) 5대\n- 블렌더 및 믹서기 10대\n- 초음파 세척기 2대\n- 전자저울, 온도계 등 소도구 다수\n\n2차년도 On-D-Gourmet, COOKING 브릿지 등 프로그램 품질 향상에 활용됩니다.",
      isPinned: false,
    },
  ];

  for (const n of noticesData) {
    await prisma.notice.create({
      data: {
        title: n.title, content: n.content, authorId: admin.id, isPinned: n.isPinned,
      },
    });
  }

  // ==================== 프로그램 (재생성) ====================
  await prisma.program.deleteMany({});
  const programsData = [
    {
      title: "On-D-Gourmet 1차 - K-로컬 아시안 퀴진 & 카페·베이커리",
      category: "ON_D_GOURMET",
      description: "전북 로컬 식재료를 활용한 아시안 퓨전 요리 + 명장 카페·베이커리 과정. 덕암정보고·진경여고 학생 24명 참여, 5일간 집중 실습.",
      schedule: "2025.07.07 ~ 07.11",
      location: "호원대학교 호텔조리학과 실습실",
      maxParticipants: 24,
      status: "COMPLETED",
    },
    {
      title: "COOKING 브릿지 조리대회지도 1차 (덕암정보고·남원제일고)",
      category: "COOKING_BRIDGE",
      description: "직업계고 학생 대상 조리대회 준비 지도. 덕암정보고, 남원제일고 학생을 대상으로 호원대 교수진이 직접 지도.",
      schedule: "2025.09.30 ~ 10.30",
      location: "덕암정보고등학교, 남원제일고등학교",
      maxParticipants: 30,
      status: "COMPLETED",
    },
    {
      title: "하이브리드 조리대회 1차 (덕암정보고)",
      category: "CAMP",
      description: "온·오프라인 하이브리드 방식으로 진행된 조리대회. 덕암정보고 학생 대상 예선 통과자 본선 진출.",
      schedule: "2025.10.23 (본선)",
      location: "호원대학교 본관 실습실 + 온라인 송출",
      maxParticipants: 20,
      status: "COMPLETED",
    },
    {
      title: "COOKING 브릿지 조리대회지도 2차 (진경여자고등학교)",
      category: "COOKING_BRIDGE",
      description: "진경여고 학생 대상 조리대회 심화 지도. 하이브리드 조리대회 본선 준비.",
      schedule: "2025.11.28 ~ 12.22",
      location: "진경여자고등학교 조리실",
      maxParticipants: 25,
      status: "COMPLETED",
    },
    {
      title: "조리융합캠프 1차 (3개교 합동)",
      category: "CAMP",
      description: "진경여고·덕암정보고·남원제일고 합동 조리융합캠프 1차. 지역·타지역 고교 협력 융합형 프로그램.",
      schedule: "2025.11.28 ~ 11.29",
      location: "호원대학교",
      maxParticipants: 40,
      status: "COMPLETED",
    },
    {
      title: "조리융합캠프 2차 (심화 과정)",
      category: "CAMP",
      description: "1차 캠프 수료생 대상 심화 과정. 지역 식재료 활용 창작 메뉴 개발 프로젝트.",
      schedule: "2025.12.07 ~ 12.08",
      location: "호원대학교",
      maxParticipants: 40,
      status: "COMPLETED",
    },
    {
      title: "김장봉사활동 1차 (진경여자고등학교)",
      category: "VOLUNTEER",
      description: "진경여고 학생과 호원대 사업단이 함께한 김장봉사. 지역 독거 어르신 대상 김치 전달.",
      schedule: "2025.12.05",
      location: "진경여자고등학교 + 주변 지역",
      maxParticipants: 30,
      status: "COMPLETED",
    },
    {
      title: "김장봉사활동 2차 (덕암정보고등학교)",
      category: "VOLUNTEER",
      description: "덕암정보고 학생 대상 김장봉사. 군산 지역 독거 어르신 20가구에 김치 전달.",
      schedule: "2025.12.10",
      location: "덕암정보고등학교 + 군산 지역",
      maxParticipants: 30,
      status: "COMPLETED",
    },
    {
      title: "하이브리드 조리대회 개최 (진경여자고등학교)",
      category: "CAMP",
      description: "진경여고 주관 하이브리드 조리대회 본선. 수상자에게 호원대 호텔조리학과 진학 시 장학금 혜택 제공.",
      schedule: "2025.12.23",
      location: "진경여자고등학교 + 온라인 송출",
      maxParticipants: 30,
      status: "COMPLETED",
    },
    {
      title: "제과제빵실 구축공사 및 오픈",
      category: "ON_D_GOURMET",
      description: "호원대 호텔조리학과 제과제빵실 전면 리모델링 완료. 30인 동시 실습 가능, 최신 데크오븐·발효기·도우시트기 구비.",
      schedule: "2025.12.22 구축 완료",
      location: "호원대학교 본관 제과제빵 실습실",
      maxParticipants: 30,
      status: "COMPLETED",
    },
    {
      title: "COOKING 브릿지 조리대회지도 (2차년도)",
      category: "COOKING_BRIDGE",
      description: "2차년도 첫 조리대회 지도 프로그램. 2025년 수상 학교 대상 심화 지도.",
      schedule: "2026.03.12 ~ 04.30",
      location: "전북 관내 직업계고 순회",
      maxParticipants: 40,
      status: "ONGOING",
    },
    {
      title: "정책연구 보고서 발간 - 직업계고 학생 지역정주 방안",
      category: "ON_D_GOURMET",
      description: "'직업계고 고등학생의 지역이탈 결정요인과 지역정주 활성화 조건 방안' 정책연구 보고서. 전북 직업계고 학생 약 500명 및 지역 기업 대상 조사.",
      schedule: "2026.03.12 발간",
      location: "호원대학교 RISE사업단",
      maxParticipants: null,
      status: "COMPLETED",
    },
    {
      title: "On-D-Gourmet 2차 - 양식조리 & 사퀴테리",
      category: "ON_D_GOURMET",
      description: "서양조리 기법과 사퀴테리(샤퀴테리) 전문 교육. 호원대 새 서양식 실습실에서 진행, 수료자에게는 '비스트로 전주' 등 협력 업체 채용 우대.",
      schedule: "2026.05 ~ 06 (5일간)",
      location: "호원대학교 서양식 실습실",
      maxParticipants: 30,
      status: "UPCOMING",
    },
    {
      title: "On-D-Gourmet 3차 - 명장 카페·베이커리 심화",
      category: "ON_D_GOURMET",
      description: "PNB풍년제과 · 이성당 등 협력 베이커리 명장을 초빙한 심화 과정. 새 제과제빵실에서 본격 운영.",
      schedule: "2026.07 (5일간 예정)",
      location: "호원대학교 제과제빵 실습실",
      maxParticipants: 30,
      status: "UPCOMING",
    },
    {
      title: "조리융합캠프 3차 (2차년도)",
      category: "CAMP",
      description: "2차년도 조리융합캠프. 전북 + 타지역 고교 협력 확대, 메뉴 개발 경진대회 추가.",
      schedule: "2026년 하반기 예정",
      location: "호원대학교",
      maxParticipants: 50,
      status: "UPCOMING",
    },
    {
      title: "조리융합캠프 4차 (심화)",
      category: "CAMP",
      description: "3차 캠프 수료생 심화 과정. 창업 아이템 개발 워크숍 포함.",
      schedule: "2026년 하반기 예정",
      location: "호원대학교",
      maxParticipants: 50,
      status: "UPCOMING",
    },
    {
      title: "COOKING 브릿지 하이브리드 조리대회 2차년도 본선",
      category: "COOKING_BRIDGE",
      description: "2차년도 하이브리드 조리대회 본선 개최. 상금 총 500만원 규모, 수상자 호원대 호텔조리학과 진학 특전.",
      schedule: "2026년 10~11월 중 예정",
      location: "호원대학교 + 온라인 송출",
      maxParticipants: 60,
      status: "UPCOMING",
    },
    {
      title: "김장봉사활동 2차년도 (진경·덕암·남원)",
      category: "VOLUNTEER",
      description: "2차년도 김장봉사 확대 운영. 진경여고 + 덕암정보고 + 남원제일고 3개교 합동, 독거 어르신 60가구 지원 목표.",
      schedule: "2026년 12월 예정",
      location: "3개 협력학교 및 지역사회",
      maxParticipants: 60,
      status: "UPCOMING",
    },
    {
      title: "조리 교사 직무연수 (NCS 고도화)",
      category: "COOKING_BRIDGE",
      description: "전북 직업계고 조리 담당 교사 직무연수. NCS 국가직무표준능력 고도화 연수 30시간 과정.",
      schedule: "2026년 하계 방학 예정",
      location: "호원대학교 호텔조리학과",
      maxParticipants: 30,
      status: "UPCOMING",
    },
  ];

  for (const p of programsData) {
    await prisma.program.create({ data: p });
  }

  // ==================== 대학생 (맛담용) ====================
  const univPassword = await bcryptjs.hash("univ1234", 12);
  const univStudentsData = [
    {
      email: "univ1@howon.ac.kr", name: "오지호", phone: "010-9001-0001",
      school: "호원대학교", grade: "3", major: "호텔조리학과",
      isMentor: true,
      introduction: "3학년 호텔조리학과 재학 중. 양식 파트너쉽 전공. 전주 비스트로에서 파트타임.",
      desiredField: ["양식", "퓨전요리"], desiredLocation: "전주",
      skills: "양식조리기능사, 조리산업기사", experience: "On-D-Gourmet 조교 2학기",
    },
    {
      email: "univ2@howon.ac.kr", name: "김서진", phone: "010-9001-0002",
      school: "호원대학교", grade: "4", major: "호텔조리학과",
      isMentor: true,
      introduction: "4학년, 제과제빵 전공. PNB풍년제과 인턴 수료. 창업 준비 중.",
      desiredField: ["제과제빵", "카페·베이커리"], desiredLocation: "전주",
      skills: "제과·제빵기능사, 바리스타 1급", experience: "PNB풍년제과 인턴 3개월",
    },
    {
      email: "univ3@howon.ac.kr", name: "문예린", phone: "010-9001-0003",
      school: "호원대학교", grade: "2", major: "호텔조리학과",
      isMentor: false,
      introduction: "2학년 재학. 한식 집중 중이며, 지역 향토음식에 관심 많음.",
      desiredField: ["한식"], desiredLocation: "전주, 익산",
      skills: "한식조리기능사", experience: "조리융합캠프 보조강사",
    },
  ];

  for (const s of univStudentsData) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email, password: univPassword, name: s.name,
        role: "STUDENT", phone: s.phone,
        student: {
          create: {
            studentType: "UNIVERSITY",
            school: s.school, grade: s.grade, major: s.major,
            isMentor: s.isMentor, introduction: s.introduction,
            desiredField: JSON.stringify(s.desiredField),
            desiredLocation: s.desiredLocation,
            skills: s.skills, experience: s.experience,
          },
        },
      },
    });
  }

  // ==================== 맛담 샘플 게시글 ====================
  await prisma.comment.deleteMany({});
  await prisma.postLike.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.post.deleteMany({});

  const authorIdFor = async (email: string) => {
    const u = await prisma.user.findUnique({ where: { email } });
    return u?.id;
  };

  const idStudent1 = await authorIdFor("student1@test.com");
  const idStudent2 = await authorIdFor("student2@test.com");
  const idStudent4 = await authorIdFor("student4@test.com");
  const idStudent6 = await authorIdFor("student6@test.com");
  const idStudent8 = await authorIdFor("student8@test.com");
  const idUniv1 = await authorIdFor("univ1@howon.ac.kr");
  const idUniv2 = await authorIdFor("univ2@howon.ac.kr");
  const idUniv3 = await authorIdFor("univ3@howon.ac.kr");
  const idAdmin = admin.id;

  const postsData: Array<{
    authorId: string | undefined;
    category: string;
    title: string;
    content: string;
    tags?: string[];
    isPinned?: boolean;
    isMentorAnswer?: boolean;
    createdAt?: Date;
  }> = [
    {
      authorId: idAdmin,
      category: "PROGRAM",
      title: "🎉 맛담 커뮤니티가 열렸습니다!",
      content: "안녕하세요, 맛JobGO 운영진입니다.\n\n고등학생과 대학생이 함께 이야기를 나누는 공간, **맛담(MatDam)** 이 오픈했습니다.\n\n- 학습경험, 프로그램 후기, 교육과정, 사회공헌, 진로고민, 노하우, 레시피 7개 카테고리로 자유롭게 글을 작성할 수 있습니다.\n- 대학생(호원대 호텔조리학과) 선배들이 **멘토**로 참여해 진로 고민에 답변해 드립니다.\n- 친구·선배에게 궁금한 게 있다면 언제든지 글을 남겨주세요.\n\n맛담에서 나눈 이야기가 모여 전북 조리 인재의 내일을 만듭니다.",
      tags: ["공지", "오픈"], isPinned: true,
    },
    {
      authorId: idUniv1,
      category: "CAREER",
      title: "직업계고에서 호원대 호텔조리학과로 진학한 후기",
      content: "덕암정보고 → 호원대 호텔조리학과로 진학한 지 3년차입니다.\n\n**직업계고 때 잘한 것**\n- 한식·양식 조리기능사 2개 이상 취득: 대학 공부의 기초가 됨\n- 교내 요리대회 꾸준히 출전: 포트폴리오가 됨\n- 전북 식재료에 익숙해진 것\n\n**대학에서 배우는 것**\n- 영양학, 식품위생학 같은 이론 비중이 높음\n- 양식 마스터 스테이지 실습 집중\n- 외식창업·메뉴 기획 같은 경영 마인드\n\n**학비 부담?**\n- RISE 사업 특별전형으로 1학년 50% 감면 받았어요\n- 근로장학, 국가장학금 병행\n\n궁금한 거 댓글 남겨주세요. 아는 선에서 답변드릴게요 🙌",
      tags: ["진학", "호원대", "호텔조리학과", "멘토"],
      isMentorAnswer: true,
    },
    {
      authorId: idStudent2,
      category: "PROGRAM",
      title: "On-D-Gourmet 카페·베이커리 과정 솔직 후기",
      content: "덕암정보고 3학년 이서연입니다!\n\n7월에 참여한 On-D-Gourmet 카페·베이커리 과정 후기 남겨요.\n\n**좋았던 점**\n- PNB풍년제과 셰프님이 직접 초코파이 레시피 전수 🎂\n- 재료비 · 조리복 전액 지원 (진짜 부담 없음)\n- 호원대 새 제과실이 정말 깨끗함\n- 수료증 덕분에 수시 특별전형 준비에 도움\n\n**아쉬웠던 점**\n- 5일이 너무 짧아요, 조금 더 길었으면\n- 개인별 피드백 시간이 더 많았으면 좋겠음\n\n2차는 양식조리 + 사퀴테리인데 신청해봤어요. 주변에 고민하는 친구들 꼭 신청해보세요!",
      tags: ["OnDGourmet", "제과제빵", "후기"],
    },
    {
      authorId: idStudent1,
      category: "TIP",
      title: "한식조리기능사 실기 3주 단기 합격 루틴",
      content: "진경여고 3학년 김민수입니다.\n\n이번 봄 한식조리기능사 실기 붙고 단기 팁 공유합니다.\n\n**주 1주차**\n- 전체 과제 영상 한번씩 시청 (감 잡기)\n- 도마·칼·냄비 위치 손에 익히기\n- 계량 감각 잡기 (물 200ml, 간장 15ml 등)\n\n**2주차**\n- 매일 2개 과제 연습 (타이머 무조건 켜고)\n- 채소 썰기 정확도 / 간 맞추기 집중\n\n**3주차**\n- 취약 과제 2~3개 집중 반복\n- 실전처럼 모의고사 (60분 2과제)\n\n**시험 당일**\n- 전 과제 이미지 트레이닝으로 한번 훑기\n- 칼 끝 상태 체크!\n\n한식 난이도 체감: ★★★☆☆ (꼼꼼함만 있으면 충분)",
      tags: ["자격증", "한식조리기능사", "실기"],
    },
    {
      authorId: idStudent4,
      category: "CAREER",
      title: "남원에 남아서 조리사 하는 게 맞을까요?",
      content: "남원제일고 3학년 정지우입니다.\n\n남원 추어탕 명가에서 일하고 싶은데, 주변에서는 \"젊은데 서울 가야 하는 거 아니냐\"고 해요.\n\n지역에서 조리사 시작해도 괜찮을지, 커리어에 불리하진 않을지 고민됩니다.\n\n- 지역에 남고 싶은 이유: 가족, 남원 식재료와 향토음식에 진심\n- 걱정: 기술 업그레이드 기회, 급여, 커리어 정체\n\n선배님들 의견 듣고 싶어요 🙏",
      tags: ["진로", "지역정주", "남원"],
    },
    {
      authorId: idUniv1,
      category: "CAREER",
      title: "Re: 지역에서 시작하는 조리사도 충분히 경쟁력 있어요",
      content: "@정지우 학생 글 잘 읽었습니다.\n\n3학년 선배로서 제 의견 드릴게요.\n\n**지역에서 시작해도 전혀 불리하지 않아요.**\n- 향토음식 전문성은 오히려 희소 가치예요\n- 남원 추어탕처럼 **브랜드 파워 있는 노포**에서 시작하면 레퍼런스가 됨\n- 최근 트렌드는 **로컬 식재료 + 모던 기법** 조합 (베지근 같은 곳)\n\n**주의할 점**\n- 첫 직장에서 \"단순 반복\"에만 머무르지 말기 (기술 성장)\n- 주 1회라도 외부 워크숍 · SNS · 독서로 최신 트렌드 흡수\n- 3년 지나면 한 번쯤 **서울·해외 스테이지**도 경험 권장\n\n**급여**: 지역 노포도 최근 많이 올랐어요. 추어향은 제가 알기로 220~260만원 수준.\n\n남원에 남고 싶다는 마음이 가장 중요합니다. 그 마음이 장기근속 → 실력 누적으로 이어져요. 응원할게요!",
      tags: ["멘토답변", "지역정주", "커리어"],
      isMentorAnswer: true,
    },
    {
      authorId: idStudent6,
      category: "LEARNING",
      title: "양식 실습 첫날 - 생각보다 훨씬 빡세요",
      content: "진경여고 3학년 윤하은입니다.\n\nOn-D-Gourmet 2차 양식조리 1일차 다녀왔어요.\n\n느낀 점:\n- 양식은 **소스**가 반이에요. 모체 소스 5개 외우기부터 시작\n- 계량이 한식보다 훨씬 엄격 (g · ml 단위)\n- 팬 잡는 법, 스톡 끓이는 시간, 다 디테일이 있음\n\n첫 요리로 미르푸아(mirepoix) 만들고, 치킨 스톡을 4시간 끓였어요.\n\n처음엔 \"양식 쉬울 줄 알았는데…\" 했다가 완전 겸손해졌습니다 😅\n\n5일 뒤가 벌써 기다려져요. 같이 참여한 친구들 화이팅!",
      tags: ["양식", "OnDGourmet", "실습"],
    },
    {
      authorId: idUniv2,
      category: "TIP",
      title: "제과제빵 혼자 연습할 때 추천하는 순서 (예산 최소화)",
      content: "호원대 4학년, 제과제빵 전공 김서진입니다.\n\n집에서 연습할 때 \"뭘 사야 하지?\" 막막한 후배들이 많아서 정리해봤어요.\n\n**최소 장비 (5만원대)**\n- 디지털 저울 (1g 단위)\n- 실리콘 스크레이퍼 2종\n- 스텐 볼 2개 (큰/작은)\n- 180도 오븐온도계\n\n**재료 최소 세트 (2만원)**\n- 박력/강력 밀가루\n- 설탕, 소금, 버터, 계란, 우유\n- 이스트, 베이킹파우더\n\n**추천 연습 순서 (각 2회씩)**\n1. 스콘 (실패해도 맛있음 ✨)\n2. 마들렌\n3. 쿠키 4종 (버터·초코·오트밀·마카롱 베이스)\n4. 파운드 케이크\n5. 호두 브라우니\n6. 식빵 (이스트 컨트롤 경험)\n7. 크림빵 (발효 + 충전)\n\n위 순서로 하면 제빵기능사 실기도 자연스럽게 준비돼요. 응원합니다!",
      tags: ["제과제빵", "혼공", "자격증"],
      isMentorAnswer: true,
    },
    {
      authorId: idStudent8,
      category: "RECIPE",
      title: "집에서 만든 전주식 치즈 단팥빵 레시피",
      content: "덕암정보고 3학년 한소영입니다.\n\n이성당 단팥빵에 영감 받아서 만든 레시피예요. 전주 맛을 담아보고 싶어서 임실 치즈를 넣어봤습니다.\n\n**재료 (6개 분량)**\n- 강력분 250g, 설탕 40g, 소금 3g\n- 이스트 5g, 우유 150g, 계란 1개, 버터 30g\n- 팥앙금 300g (시판), 임실 모짜렐라 치즈 120g\n\n**과정**\n1. 우유 40도 데워 이스트 풀기 → 밀가루/설탕/소금/계란과 반죽 10분\n2. 버터 추가 후 다시 8분 반죽 (윤기 나게)\n3. 1차 발효 40분 (2배 부피)\n4. 6분할 후 둥글리기, 20분 휴지\n5. 팥앙금 + 치즈 한 조각씩 넣고 성형\n6. 2차 발효 30분\n7. 180도 오븐 12~14분\n\n**포인트**\n- 팥이랑 치즈가 만나면 단짠이 대박이에요\n- 식으면 토스터에 30초 돌리면 치즈가 다시 녹아서 더 맛있음 🔥\n\n레시피 공유 환영!",
      tags: ["레시피", "제과제빵", "치즈단팥빵", "임실치즈"],
    },
    {
      authorId: idStudent1,
      category: "VOLUNTEER",
      title: "진경여고 김장봉사활동 다녀왔어요",
      content: "12월 5일 진경여자고등학교 김장봉사 참여 후기입니다.\n\n- 참여 인원: 우리 학교 30명\n- 김치: 약 200포기\n- 지원 가구: 완산구 독거 어르신 20가구\n\n새벽 6시 등교가 힘들긴 했지만, 어르신들 댁 전달하고 인사드릴 때 진짜 뿌듯했어요.\n\n학교 조리 실습실에서 배운 칼질이 실전에서 이렇게 빛날 줄 몰랐네요 😊\n\n2차년도 때 더 많은 학교가 함께했으면 좋겠어요.\n\n사진은 맛JobGO 갤러리에도 올라올 예정이라고 합니다!",
      tags: ["김장봉사", "사회공헌", "진경여고"],
    },
    {
      authorId: idStudent2,
      category: "VOLUNTEER",
      title: "덕암정보고 김장봉사 - 처음이지만 가장 기억에 남아요",
      content: "덕암정보고 3학년 이서연입니다.\n\n12월 10일 김장봉사 2차 참여했어요. 첫 봉사활동이라 긴장했지만,\n\n- 선생님들과 호원대 선배들이 채소 손질·양념 베이스 미리 준비해주셔서 어려움 없었어요\n- 군산 지역 20가구 중 우리 조는 4가구 담당\n- 손주 같다며 눈물 보이시던 할머니 계셔서 저도 울컥 🥺\n\n앞으로 졸업하고 취업해도 이런 봉사는 계속 이어가고 싶어요. 지역에 남아야겠다는 마음이 더 확실해졌습니다.\n\n후배 친구들에게도 강추!",
      tags: ["김장봉사", "군산", "덕암정보고"],
    },
    {
      authorId: idUniv3,
      category: "CURRICULUM",
      title: "호원대 호텔조리학과 커리큘럼 한눈에 보기 (2학년 기준)",
      content: "호원대 호텔조리학과 2학년 재학 중인 문예린입니다.\n\n직업계고 후배들이 궁금해할 것 같아서 정리해요.\n\n**1학년 - 기초 다지기**\n- 조리학개론, 식품학, 영양학\n- 한식 / 양식 / 중식 / 일식 기본 실습\n- 위생관리, 식재료학\n\n**2학년 - 전공 심화**\n- 한식조리 심화, 양식 소스·스톡, 제과제빵 1\n- 외식서비스경영론, 메뉴기획\n- 실습: 학교 실습 레스토랑 서비스 로테이션\n\n**3학년 - 특성화**\n- 전공 선택 (양식/한식/제과제빵/소믈리에 中)\n- 외식창업, 푸드스타일링\n- On-D-Gourmet 조교 또는 전공 심화 실습\n\n**4학년 - 현장 연계**\n- 3~6개월 현장 실습 (협력 업체 선택)\n- 캡스톤 디자인 (창업 프로젝트 or 메뉴 개발)\n- 졸업 포트폴리오\n\n자격증은 1~2학년에 한·양식 다 따두는 걸 권장해요. 3학년부터는 실습 업체 일정이 꽉 차서 시간 없어요 😅",
      tags: ["호원대", "호텔조리학과", "커리큘럼"],
    },
    {
      authorId: idAdmin,
      category: "PROGRAM",
      title: "[모집] On-D-Gourmet 2차 양식조리 & 사퀴테리 참가자",
      content: "2026년 5~6월 중 진행되는 On-D-Gourmet 2차 과정 모집 안내입니다.\n\n- 대상: 전북 직업계고 재학생 30명\n- 내용: 양식 기본기 + 사퀴테리 제조 + 로컬 식재료 활용\n- 지원: 조리복, 재료비, 보험, 교통비 (전액 무료)\n- 장소: 호원대 서양식 실습실\n- 신청: 소속 학교 담임교사 경유\n\n수료 시 비스트로 전주 등 협력 업체 채용 가점 + 호원대 수시 특별전형 가산점이 있습니다.\n\n관심 있는 학생·학부모님 많이 신청 부탁드립니다!",
      tags: ["OnDGourmet", "모집", "2026"],
      isPinned: true,
    },
    {
      authorId: idStudent4,
      category: "LEARNING",
      title: "남원 추어탕 레시피를 학교 수업에서 배웠어요",
      content: "남원제일고 정지우입니다.\n\n이번 주 학교 실습 수업에서 지역 향토음식 특집으로 **남원 추어탕** 만들었어요.\n\n선생님이 알려주신 핵심:\n- **미꾸라지 손질**: 굵은 소금으로 해감 3회\n- **시래기**: 남원산 썼는데, 쌈장에 조물조물 무쳐서 비린내 제거\n- **들깨가루**: 마지막에 넣어야 향이 살아\n- **고추장 vs 된장**: 남원은 **된장 베이스**가 정통\n\n서울이나 다른 지역 추어탕이랑 맛이 완전 달라요. 지역 향토음식 배우니까 \"내가 이 지역에 사는 이유\"가 더 또렷해지는 느낌.\n\n추어향 사장님께 인턴 신청 해볼까 진지하게 고민 중 🤔",
      tags: ["남원추어탕", "향토음식", "실습"],
    },
    {
      authorId: idStudent6,
      category: "TIP",
      title: "조리복 관리 꿀팁 - 기름때 세탁 노하우",
      content: "진경여고 윤하은입니다.\n\n조리복 기름때 진짜 안 빠지죠? 제가 한 학기 동안 이것저것 해보고 찾은 루틴 공유!\n\n**당일 관리**\n1. 실습 끝나자마자 찬물로 얼룩 부위 가볍게 헹구기 (뜨거운 물 절대 NO, 기름 고착됨)\n2. 주방세제 한 방울 + 칫솔로 문지르기\n\n**세탁 (주 1회)**\n- 과탄산소다 1스푼 + 베이킹소다 1스푼 + 40도 미지근한 물에 30분 불리기\n- 세탁기 표준 코스 + 울샴푸 (색 바램 방지)\n- 햇볕에 말려 살균\n\n**소스 얼룩별**\n- 데미글라스: 식초 + 베이킹소다\n- 토마토: 비누로 즉시 처리\n- 블랙 (잉크/간장): 우유에 30분 담그면 진짜 빠짐 ✨\n\n수업 이틀 전에는 꼭 미리 빨아두세요. 마르는데 시간 걸려요.",
      tags: ["조리복", "관리", "팁"],
    },
  ];

  for (const p of postsData) {
    if (!p.authorId) continue;
    const createdAt =
      p.createdAt ||
      new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      );
    await prisma.post.create({
      data: {
        authorId: p.authorId,
        category: p.category,
        title: p.title,
        content: p.content,
        tags: p.tags ? JSON.stringify(p.tags) : null,
        isPinned: !!p.isPinned,
        isMentorAnswer: !!p.isMentorAnswer,
        createdAt,
        viewCount: Math.floor(Math.random() * 200) + 30,
        likeCount: Math.floor(Math.random() * 40) + 3,
      },
    });
  }

  // 댓글 몇 개 심기 (최근 4개 게시글에)
  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  const commenters = [
    idStudent1, idStudent2, idStudent4, idStudent6, idStudent8,
    idUniv1, idUniv2, idUniv3,
  ].filter(Boolean) as string[];
  const commentBank = [
    "좋은 정보 감사합니다! 저도 이번에 준비해볼게요.",
    "진짜 도움 많이 됐어요. 북마크 합니다!",
    "선배님 답변 너무 감동이에요 🥺",
    "저도 비슷한 경험이 있어서 공감합니다.",
    "질문 하나 있어요! 혹시 시간 여유 되시면 쪽지 부탁드려도 될까요?",
    "공유해주셔서 감사합니다. 주변에도 알릴게요.",
    "저희 학교 실습실에서도 해봐야겠어요.",
    "이 부분 더 자세히 알고 싶어요.",
  ];
  for (const p of recentPosts.slice(0, 5)) {
    const nComments = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < nComments; i++) {
      const authorId = commenters[Math.floor(Math.random() * commenters.length)];
      await prisma.comment.create({
        data: {
          postId: p.id,
          authorId,
          content: commentBank[Math.floor(Math.random() * commentBank.length)],
        },
      });
    }
    const finalCount = await prisma.comment.count({ where: { postId: p.id } });
    await prisma.post.update({
      where: { id: p.id },
      data: { commentCount: finalCount },
    });
  }

  console.log("Seed completed!");
  console.log(`- HS Students: ${studentsData.length}`);
  console.log(`- Univ Students: ${univStudentsData.length}`);
  console.log(`- Companies: ${companiesData.length}`);
  console.log(`- Jobs: ${jobsData.length}`);
  console.log(`- Notices: ${noticesData.length}`);
  console.log(`- Programs: ${programsData.length}`);
  console.log(`- 맛담 Posts: ${postsData.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
