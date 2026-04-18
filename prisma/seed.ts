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

  const companiesData = [
    {
      email: "gogung@test.com", name: "양정숙", phone: "063-251-3211",
      companyName: "고궁수라간 (전주 인사동)",
      businessNumber: "402-81-12345", representative: "양정숙", industry: "한식",
      address: "전북특별자치도 전주시 완산구 전주객사3길 22",
      description: "전주비빔밥의 대표 명가. 1996년 개업 이래 30년간 전통 전주비빔밥의 맛을 지켜왔습니다. 전주 10미 지정 음식점이며, 전주국제영화제 공식 지정 식당입니다.",
      idealTalent: "한식 기본기가 탄탄하고, 전주 전통 음식을 계승할 열정이 있는 인재를 찾습니다. 장기 근속 희망자 우대.",
      employeeCount: 22, website: "https://gogung.co.kr", isVerified: true,
    },
    {
      email: "hangukguan@test.com", name: "김영숙", phone: "063-272-9229",
      companyName: "한국관",
      businessNumber: "403-82-23456", representative: "김영숙", industry: "한식",
      address: "전북특별자치도 전주시 덕진구 팔달로 119",
      description: "전주비빔밥 지정 음식점. 50년 전통의 전주 대표 한정식집. 돌솥비빔밥과 12첩 반상이 유명합니다.",
      idealTalent: "전주 한정식 문화를 계승할 예비 조리인재. 한식조리기능사 자격증 보유자 우대.",
      employeeCount: 35, isVerified: true,
    },
    {
      email: "leesungdang@test.com", name: "김현주", phone: "063-445-2772",
      companyName: "이성당 (군산)",
      businessNumber: "404-83-34567", representative: "김현주", industry: "제과제빵",
      address: "전북특별자치도 군산시 중앙로 177",
      description: "1945년 창립, 대한민국에서 가장 오래된 빵집. 단팥빵과 야채빵의 원조. 연간 300만 개 이상 판매. 미슐랭 가이드 빕구르망 선정.",
      idealTalent: "빵에 대한 진심과 꾸준한 배움의 자세가 있는 제빵사. 80년 전통의 레시피를 익히고자 하는 인재.",
      employeeCount: 65, website: "https://leesungdang1945.com", isVerified: true,
    },
    {
      email: "samback@test.com", name: "박수철", phone: "063-284-2227",
      companyName: "삼백집",
      businessNumber: "405-84-45678", representative: "박수철", industry: "한식",
      address: "전북특별자치도 전주시 완산구 전주객사2길 22",
      description: "전주 콩나물국밥의 원조. 1947년 창업 이래 하루 300그릇만 한정 판매한다는 의미의 '삼백집'. 백종원의 3대 천왕에도 출연한 전주 대표 노포.",
      idealTalent: "아침 일찍 근무 가능하며 성실한 인재. 전통 한식의 맛을 지켜갈 의지가 있는 조리사.",
      employeeCount: 18, isVerified: true,
    },
    {
      email: "wangyijip@test.com", name: "이영희", phone: "063-287-6980",
      companyName: "왱이집",
      businessNumber: "406-85-56789", representative: "이영희", industry: "한식",
      address: "전북특별자치도 전주시 완산구 동문길 88",
      description: "한옥마을 인근 콩나물국밥 명소. 남부시장 콩나물 사용, 24시간 정성스럽게 우려낸 육수가 특징. 모주와 함께 먹는 해장국밥이 유명.",
      idealTalent: "한식 기본기 및 성실함. 주말 근무 가능한 분 우대.",
      employeeCount: 12, isVerified: true,
    },
    {
      email: "hwasim@test.com", name: "조명순", phone: "063-243-8268",
      companyName: "화심순두부 본점",
      businessNumber: "407-86-67890", representative: "조명순", industry: "한식",
      address: "전북특별자치도 완주군 소양면 화심순두부길 89",
      description: "1983년 창업, 순두부의 명가. 국산 콩 100%, 매일 새벽 가마솥에 직접 만드는 순두부. 전북 대표 향토음식점 지정.",
      idealTalent: "새벽 근무 가능, 전통 두부 제조 기법을 배우고자 하는 장기 근속 인재.",
      employeeCount: 28, website: "https://hwasim.co.kr", isVerified: true,
    },
    {
      email: "pnb@test.com", name: "강성원", phone: "063-285-6666",
      companyName: "PNB 풍년제과",
      businessNumber: "408-87-78901", representative: "강성원", industry: "제과제빵",
      address: "전북특별자치도 전주시 완산구 팔달로 180",
      description: "1951년 창업, 전주 대표 제과점. 수제 초코파이 원조로 전국적 인기. 전주 한옥마을 관광의 필수 코스.",
      idealTalent: "제과 기본기와 창의력을 갖춘 인재. 신메뉴 개발에 적극 참여하고자 하는 베이커.",
      employeeCount: 42, isVerified: true,
    },
    {
      email: "jeollahoegwan@test.com", name: "윤미경", phone: "063-231-0555",
      companyName: "전라회관",
      businessNumber: "409-88-89012", representative: "윤미경", industry: "한식",
      address: "전북특별자치도 전주시 완산구 태조로 21",
      description: "전주 한정식 전문점, 20첩 반상의 대표 격. 전라북도 향토음식점 지정. 관공서·기업 접대 행사의 단골 업체.",
      idealTalent: "한정식 상차림과 한식 전반 조리 경험을 쌓고 싶은 조리사. 조리기능사 이상 자격증 보유 우대.",
      employeeCount: 45, isVerified: true,
    },
    {
      email: "chueohang@test.com", name: "정태식", phone: "063-625-3455",
      companyName: "남원 추어향",
      businessNumber: "410-89-90123", representative: "정태식", industry: "한식",
      address: "전북특별자치도 남원시 천거길 41",
      description: "남원 추어탕 명가. 국산 미꾸라지, 남원산 시래기 사용. 지리산 둘레길 방문객의 필수 코스.",
      idealTalent: "향토음식에 관심 있고 남원 지역에서 장기 근속 가능한 한식 조리사.",
      employeeCount: 15, isVerified: true,
    },
    {
      email: "gyehwa@test.com", name: "김정순", phone: "063-581-0844",
      companyName: "부안 계화회관",
      businessNumber: "411-90-01234", representative: "김정순", industry: "한식",
      address: "전북특별자치도 부안군 계화면 돈지길 64",
      description: "바지락죽과 해물탕 명가. 부안 앞바다의 신선한 해산물 직접 공급. 전라북도 향토음식점, 미슐랭 빕구르망 선정.",
      idealTalent: "해산물 손질 경험, 부안 지역 거주자 우대. 새벽 시장 동행 가능한 분.",
      employeeCount: 20, isVerified: true,
    },
    {
      email: "bokseongru@test.com", name: "최규열", phone: "063-445-8412",
      companyName: "군산 복성루",
      businessNumber: "412-91-12345", representative: "최규열", industry: "중식",
      address: "전북특별자치도 군산시 월명로 382",
      description: "1966년 창업, 군산을 대표하는 중화요리집. 빨갛지 않은 맑은 짬뽕의 원조. 미슐랭 가이드 빕구르망 선정.",
      idealTalent: "중식 조리 기본기를 배우고 싶은 예비 셰프. 체력과 성실함 중시.",
      employeeCount: 18, isVerified: true,
    },
    {
      email: "imsil-cheese@test.com", name: "황경숙", phone: "063-640-2700",
      companyName: "임실N치즈테마파크",
      businessNumber: "413-92-23456", representative: "황경숙", industry: "카페·베이커리",
      address: "전북특별자치도 임실군 성수면 도인2길 50",
      description: "임실치즈 관련 디저트 카페·레스토랑. 피자, 치즈케이크, 치즈퐁듀 등 치즈 활용 디저트·요리 전문. 지역 관광 명소.",
      idealTalent: "유제품에 대한 이해와 열정, 신메뉴 개발에 적극적인 제과·카페 인재.",
      employeeCount: 24, website: "https://cheesepark.kr", isVerified: true,
    },
    {
      email: "vegegeun@test.com", name: "이하나", phone: "063-233-8997",
      companyName: "베지근 (모던 한식)",
      businessNumber: "414-93-34567", representative: "이하나", industry: "퓨전요리",
      address: "전북특별자치도 전주시 덕진구 기린대로 418",
      description: "전북 로컬 식재료를 활용한 모던 한식 파인다이닝. 30년 넘은 장을 활용한 현대적 재해석으로 주목받는 신흥 명소.",
      idealTalent: "지역 식재료에 대한 관심, 창의적인 플레이팅, 파인다이닝 경험/관심자 우대.",
      employeeCount: 14, isVerified: true,
    },
    {
      email: "bistro-jeonju@test.com", name: "박셰프", phone: "063-282-6622",
      companyName: "비스트로 전주",
      businessNumber: "415-94-45678", representative: "박셰프", industry: "양식",
      address: "전북특별자치도 전주시 완산구 효자동 3-1",
      description: "전주 로컬 식재료와 유럽 조리법의 융합 모던 유러피안 레스토랑. 사퀴테리 자체 제조, 계절 코스 메뉴 운영.",
      idealTalent: "양식 기본기 보유, 새로운 것에 도전적인 주니어 셰프. 사퀴테리·소시지 제조에 관심 있는 분 환영.",
      employeeCount: 10, isVerified: true,
    },
    {
      email: "naejangsan@test.com", name: "박순자", phone: "063-538-8777",
      companyName: "내장산 산채정식",
      businessNumber: "416-95-56789", representative: "박순자", industry: "한식",
      address: "전북특별자치도 정읍시 내장산로 936-4",
      description: "내장산 자락의 산채한정식 명가. 직접 채취한 산나물과 토속 반찬 30여 가지 제공. 정읍 대표 향토음식점.",
      idealTalent: "산채·나물 손질 경험, 정읍 거주/이주 가능자 우대.",
      employeeCount: 16, isVerified: true,
    },
  ];

  for (const c of companiesData) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email, password: companyPassword, name: c.name,
        role: "COMPANY", phone: c.phone,
        company: {
          create: {
            companyName: c.companyName, businessNumber: c.businessNumber,
            representative: c.representative, industry: c.industry,
            address: c.address, description: c.description,
            idealTalent: c.idealTalent, employeeCount: c.employeeCount,
            website: c.website, isVerified: c.isVerified,
          },
        },
      },
    });
  }

  // ==================== 채용공고 ====================
  const companyMap = new Map<string, string>();
  for (const c of companiesData) {
    const comp = await prisma.company.findFirst({ where: { companyName: c.companyName } });
    if (comp) companyMap.set(c.companyName, comp.id);
  }

  const jobsData: Array<{
    key: string; companyName: string; title: string; field: string;
    description: string; requirements?: string; salary?: string;
    workLocation?: string; workSchedule?: string; benefits?: string;
    recruitCount?: number; deadline?: Date;
  }> = [
    {
      key: "job-gogung-1", companyName: "고궁수라간 (전주 인사동)",
      title: "전주비빔밥 한식 조리사 (신입/경력)", field: "한식",
      description: "고궁수라간에서 함께 전주비빔밥의 맛을 지켜갈 한식 조리사를 모집합니다.\n\n- 전주비빔밥, 돌솥비빔밥 조리\n- 반찬 및 사이드 메뉴 준비\n- 지역 식재료 관리\n- 선배 조리사의 체계적인 OJT 제공",
      requirements: "한식조리기능사 자격증 필수\n조리 관련 학과 재학 또는 졸업\n장기 근속 가능자 우대",
      salary: "월 230만원~ (경력 협의)", workLocation: "전주시 완산구",
      workSchedule: "10:00~21:00 (2교대, 주5일)", benefits: "4대보험, 식사제공, 자격증 취득 지원, 인센티브",
      recruitCount: 3, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-hangukguan-1", companyName: "한국관",
      title: "한정식 조리사 및 찬모 모집", field: "한식",
      description: "전주 한정식의 대표 격 한국관에서 조리사/찬모를 모집합니다.\n\n- 12첩 반상 상차림 준비\n- 전주 전통 반찬 제조\n- 단체 손님 응대\n- 한식 조리 전 과정 교육",
      requirements: "한식조리기능사 자격증 우대\n성실하고 책임감 있는 분",
      salary: "월 220만원~", workLocation: "전주시 덕진구",
      workSchedule: "11:00~22:00 (브레이크타임 포함)", benefits: "4대보험, 식사제공, 명절 상여",
      recruitCount: 2, deadline: new Date("2026-08-31"),
    },
    {
      key: "job-leesungdang-1", companyName: "이성당 (군산)",
      title: "[이성당] 제빵사 (단팥빵·야채빵 담당)", field: "제과제빵",
      description: "대한민국에서 가장 오래된 빵집 이성당에서 함께 할 제빵사를 모집합니다.\n\n- 단팥빵, 야채빵, 채단팥빵 반죽/성형/굽기\n- 80년 전통 레시피 학습 및 계승\n- 신메뉴 개발 참여 기회\n- 엄격한 위생 및 품질 관리",
      requirements: "제빵기능사 자격증 필수\n새벽 근무 가능자\n장기 근속 의지 필수",
      salary: "월 250만원~ (경력 우대)", workLocation: "군산시 중앙로",
      workSchedule: "05:00~14:00 또는 14:00~23:00 (주5일)", benefits: "4대보험, 식사 및 제품 제공, 기숙사, 장기근속 포상",
      recruitCount: 4, deadline: new Date("2026-06-30"),
    },
    {
      key: "job-leesungdang-2", companyName: "이성당 (군산)",
      title: "[이성당] 판매 및 카페 바리스타", field: "카페·베이커리",
      description: "이성당 매장에서 고객 응대와 커피 음료를 담당할 바리스타를 모집합니다.\n\n- 고객 응대 및 상품 판매\n- 에스프레소 기반 음료 제조\n- 매장 위생 및 진열 관리",
      requirements: "바리스타 자격증 소지자 우대\n고객 응대 경험자 우대",
      salary: "월 210만원~", workLocation: "군산시 중앙로",
      workSchedule: "09:00~18:00 (주5일)", benefits: "4대보험, 식사제공, 교통비, 근속 포상",
      recruitCount: 2, deadline: new Date("2026-07-15"),
    },
    {
      key: "job-samback-1", companyName: "삼백집",
      title: "삼백집 콩나물국밥 조리 보조", field: "한식",
      description: "전주 콩나물국밥의 원조 삼백집에서 조리 보조를 모집합니다.\n\n- 콩나물 손질 및 전처리\n- 육수 및 국밥 조리 보조\n- 모주 등 사이드 메뉴 준비\n- 매장 기초 위생 관리",
      requirements: "한식조리기능사 우대\n새벽 근무 가능",
      salary: "월 200만원~", workLocation: "전주시 완산구 한옥마을 인근",
      workSchedule: "05:30~14:30 (주5일)", benefits: "4대보험, 식사제공, 명절 상여",
      recruitCount: 2, deadline: new Date("2026-06-30"),
    },
    {
      key: "job-hwasim-1", companyName: "화심순두부 본점",
      title: "[화심순두부] 순두부 제조 및 한식 조리사", field: "한식",
      description: "화심순두부 본점에서 순두부 제조 및 한식 조리를 담당할 인재를 모집합니다.\n\n- 가마솥 전통 순두부 제조\n- 두부 활용 한식 메뉴 조리\n- 콩·두부 관련 신메뉴 개발 참여",
      requirements: "한식조리기능사 우대\n새벽 근무 가능, 완주·전주 거주자 우대",
      salary: "월 240만원~ (기숙사 별도 제공)", workLocation: "완주군 소양면",
      workSchedule: "04:30~13:30 (순두부 제조) 또는 10:00~20:00 (홀/조리)",
      benefits: "4대보험, 기숙사 제공, 식사제공, 장기근속 인센티브",
      recruitCount: 3, deadline: new Date("2026-08-15"),
    },
    {
      key: "job-pnb-1", companyName: "PNB 풍년제과",
      title: "[PNB 풍년제과] 제과사 (수제 초코파이 담당)", field: "제과제빵",
      description: "전주 한옥마을 대표 제과점 PNB 풍년제과에서 수제 초코파이 제조를 담당할 제과사를 모집합니다.\n\n- 수제 초코파이 반죽/성형/마시멜로 충전\n- 케이크, 파이, 쿠키 등 제과 전반\n- 신메뉴 개발 및 시즌 상품 기획 참여",
      requirements: "제과기능사 자격증 필수\n제빵기능사 우대\n제과 관련 학과 졸업 또는 재학생",
      salary: "월 230만원~", workLocation: "전주시 완산구 팔달로",
      workSchedule: "07:00~16:00 (주5일)", benefits: "4대보험, 식사제공, 제품 할인, 연 2회 상여",
      recruitCount: 3, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-jeollahoegwan-1", companyName: "전라회관",
      title: "전라회관 한정식 조리사 (주니어)", field: "한식",
      description: "전라회관에서 한정식 주니어 조리사를 모집합니다.\n\n- 한정식 20첩 반상 준비\n- 한식 반찬 및 메인 요리 조리\n- 단체 연회 행사 운영 지원",
      requirements: "한식조리기능사 필수\n연회 행사 운영 경험자 우대",
      salary: "월 220만원~", workLocation: "전주시 완산구 태조로",
      workSchedule: "10:00~22:00 (브레이크타임 포함)", benefits: "4대보험, 식사제공, 명절 상여, 자격증 지원",
      recruitCount: 2, deadline: new Date("2026-08-31"),
    },
    {
      key: "job-chueohang-1", companyName: "남원 추어향",
      title: "남원 추어탕 전문 조리사", field: "한식",
      description: "남원 추어탕 명가 추어향에서 전통 추어탕 조리사를 모집합니다.\n\n- 미꾸라지 손질 및 갈아내기\n- 시래기·들깨 등 남원 지역 식재료 활용\n- 추어탕, 추어튀김 등 메뉴 조리",
      requirements: "한식조리기능사 우대\n남원 지역 거주자 또는 이주 가능자 우대",
      salary: "월 210만원~", workLocation: "남원시 천거길",
      workSchedule: "10:00~21:00 (주5일)", benefits: "4대보험, 식사제공, 장기근속 인센티브, 이주 지원금",
      recruitCount: 2, deadline: new Date("2026-09-30"),
    },
    {
      key: "job-gyehwa-1", companyName: "부안 계화회관",
      title: "[부안 계화회관] 해산물 전문 조리사", field: "한식",
      description: "부안 계화회관에서 바지락죽과 해물탕 전문 조리사를 모집합니다.\n\n- 바지락죽, 백합죽 조리\n- 해물탕, 조개 구이 등 해산물 요리\n- 새벽 시장 동행 및 식재료 선별",
      requirements: "한식조리기능사 필수\n해산물 손질 경험자 우대\n부안·군산 거주자 우대",
      salary: "월 230만원~", workLocation: "부안군 계화면",
      workSchedule: "04:30~13:30 또는 10:00~20:00 (주5일)",
      benefits: "4대보험, 식사제공, 기숙사 제공 가능, 성과 인센티브",
      recruitCount: 2, deadline: new Date("2026-07-31"),
    },
    {
      key: "job-bokseongru-1", companyName: "군산 복성루",
      title: "[군산 복성루] 중식 조리 보조 및 견습", field: "중식",
      description: "군산 대표 중화요리집 복성루에서 중식 조리사를 모집합니다.\n\n- 맑은 짬뽕(원조) 조리\n- 중식 면 요리, 볶음 요리\n- 불판 및 화구 관리",
      requirements: "중식조리기능사 우대, 체력 필수\n성실하고 배움의 자세가 있는 분",
      salary: "월 230만원~ (견습 기간 후 조정)", workLocation: "군산시 월명로",
      workSchedule: "10:00~21:30 (브레이크타임 포함, 주5일)",
      benefits: "4대보험, 식사제공, 기숙사 제공, 기술 전수",
      recruitCount: 2, deadline: new Date("2026-08-15"),
    },
    {
      key: "job-imsil-cheese-1", companyName: "임실N치즈테마파크",
      title: "[임실N치즈] 치즈 디저트 카페 제과·바리스타", field: "카페·베이커리",
      description: "임실N치즈테마파크에서 치즈 활용 디저트 카페 인력을 모집합니다.\n\n- 치즈케이크, 치즈피자 등 제조\n- 커피 및 음료 제조\n- 치즈 퐁듀 등 체험 프로그램 운영 지원",
      requirements: "제과기능사 또는 바리스타 자격증 우대\n유제품에 대한 이해도 있는 분",
      salary: "월 210만원~", workLocation: "임실군 성수면",
      workSchedule: "09:00~18:00 (주5일)", benefits: "4대보험, 식사제공, 이주 지원금, 제품 할인",
      recruitCount: 3, deadline: new Date("2026-08-31"),
    },
    {
      key: "job-vegegeun-1", companyName: "베지근 (모던 한식)",
      title: "[베지근] 모던 한식 파인다이닝 주니어 셰프", field: "퓨전요리",
      description: "전북 로컬 식재료를 활용한 모던 한식 파인다이닝 베지근에서 주니어 셰프를 모집합니다.\n\n- 계절 테이스팅 메뉴 개발/조리 보조\n- 지역 농가 직거래 식재료 취급\n- 플레이팅 연구",
      requirements: "조리 관련 학과 재학 또는 졸업\n창의적 플레이팅에 관심 있는 분\n파인다이닝 실습 경험자 우대",
      salary: "월 250만원~ (경력 및 포트폴리오 협의)", workLocation: "전주시 덕진구",
      workSchedule: "11:00~22:00 (브레이크타임 포함, 주5일)",
      benefits: "4대보험, 식사제공, 해외 연수 기회, 메뉴 개발 인센티브",
      recruitCount: 2, deadline: new Date("2026-07-15"),
    },
    {
      key: "job-bistro-jeonju-1", companyName: "비스트로 전주",
      title: "[비스트로 전주] 양식 주니어 셰프 & 사퀴테리 담당", field: "양식",
      description: "비스트로 전주에서 모던 유러피안 주니어 셰프를 모집합니다.\n\n- 코스 요리 조리 보조\n- 사퀴테리(샤퀴테리) 제조\n- 로컬 식재료 기반 메뉴 개발\n- 호원대 On-D-Gourmet 과정 이수생 우대",
      requirements: "양식조리기능사 자격증 보유 또는 취득 예정\n새로운 것에 도전적인 자세\n호원대 On-D-Gourmet 수료자 적극 우대",
      salary: "월 240만원~", workLocation: "전주시 완산구",
      workSchedule: "11:00~22:00 (브레이크타임 포함)", benefits: "4대보험, 식사제공, 해외 연수 기회, 자격증 취득 지원",
      recruitCount: 2, deadline: new Date("2026-06-30"),
    },
    {
      key: "job-naejangsan-1", companyName: "내장산 산채정식",
      title: "[내장산 산채정식] 한식 조리사 (산채 전문)", field: "한식",
      description: "정읍 내장산 산채정식 명가에서 한식 조리사를 모집합니다.\n\n- 산나물 손질 및 무침 조리\n- 산채한정식 상차림\n- 계절 산채 메뉴 개발",
      requirements: "한식조리기능사 우대\n산나물 손질 경험자 또는 학습 의지 강한 분",
      salary: "월 210만원~", workLocation: "정읍시 내장산로",
      workSchedule: "09:30~20:30 (주5일)", benefits: "4대보험, 식사제공, 통근버스 제공, 명절 상여",
      recruitCount: 2, deadline: new Date("2026-09-30"),
    },
    {
      key: "job-wangyijip-1", companyName: "왱이집",
      title: "[왱이집] 콩나물국밥 조리 보조 (야간/새벽)", field: "한식",
      description: "24시간 운영 왱이집에서 새벽 시간대 조리 보조를 모집합니다.\n\n- 콩나물국밥 조리\n- 모주, 반찬 등 사이드 준비\n- 새벽 시간대 매장 운영",
      requirements: "새벽 근무 가능자\n한식조리기능사 우대",
      salary: "월 230만원~ (야간수당 포함)", workLocation: "전주시 완산구 동문길",
      workSchedule: "23:00~09:00 (야간 10시간, 주5일)",
      benefits: "4대보험, 식사제공, 야간수당, 통근 지원",
      recruitCount: 2, deadline: new Date("2026-07-15"),
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
