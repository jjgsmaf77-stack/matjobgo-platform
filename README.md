# 맛JobGO 플랫폼

> 전북의 맛(味)을 '품'은 로컬조리인재 양성 플랫폼
> 호원대학교 RISE사업 Track 4-3-2

## 개요

맛JobGO는 전북 직업계고 학생, 전북 지역 외식업체, 호원대학교 사업단을
연결하는 **AI 기반 스마트 인재 매칭 플랫폼**입니다.

- **학생(STUDENT)**: 이력서·자기소개서 등록, 채용공고 탐색 및 지원, AI 기반 기업 매칭
- **기업(COMPANY)**: 기업정보·인재상 등록, 채용공고 관리, 학생 탐색 및 스카우트
- **관리자(ADMIN)**: 매칭 현황 대시보드, 프로그램·공지사항 관리, 통계 모니터링

## 기술 스택

- **Next.js 16.2.3** (App Router, React 19)
- **TypeScript 5**
- **Tailwind CSS v4**
- **Prisma 7** (better-sqlite3 어댑터, SQLite dev.db)
- **NextAuth.js v5 (beta)** — JWT 세션, Credentials 인증
- **bcryptjs** — 패스워드 해싱

## 실행 방법

Node.js 20+ 와 npm이 필요합니다.

```bash
# 1. 의존성 설치
npm install

# 2. Prisma 클라이언트 생성 및 DB 마이그레이션
npx prisma generate
npx prisma migrate deploy

# 3. 샘플 데이터 시딩 (관리자/학생/기업 계정, 채용공고, 프로그램)
npm run seed

# 4. 개발 서버 실행
npm run dev
```

Windows 환경에서는 프로젝트 루트의 `start.bat`을 실행하면
위 과정이 순차적으로 자동 수행됩니다.

```
start.bat
```

서버 기동 후 브라우저에서 http://localhost:3000 접속.

## 시딩된 샘플 계정

| 역할     | 이메일                  | 비밀번호       |
| -------- | ----------------------- | -------------- |
| 관리자   | admin@howon.ac.kr       | admin1234      |
| 학생1    | student1@test.com       | student1234    |
| 학생2    | student2@test.com       | student1234    |
| 학생3    | student3@test.com       | student1234    |
| 기업1    | company1@test.com       | company1234    |
| 기업2    | company2@test.com       | company1234    |
| 기업3    | company3@test.com       | company1234    |

## 주요 경로

### 공개
- `/` — 메인 랜딩
- `/jobs`, `/jobs/[id]` — 채용공고 목록/상세
- `/companies`, `/companies/[id]` — 참여기업 목록/상세
- `/programs` — 교육 프로그램 안내 (On-D-Gourmet, COOKING 브릿지, 융합조리캠프, 사회봉사)
- `/notices` — 공지사항
- `/login`, `/register` — 로그인/회원가입 (학생/기업)

### 학생 전용
- `/student/dashboard` — 대시보드 (지원 현황, 추천 매칭)
- `/student/profile` — 프로필 수정 (이력서 PDF 업로드 포함)

### 기업 전용
- `/company/dashboard` — 대시보드 (공고·지원·매칭 요약)
- `/company/profile` — 기업정보 수정
- `/company/jobs/new` — 채용공고 등록 (등록 시 자동 매칭 수행)
- `/company/applications` — 지원자 관리 (합격/불합격 처리)
- `/company/students` — 학생 탐색 및 스카우트

### 관리자 전용
- `/admin/dashboard` — 핵심 지표(학생/기업/공고/지원/매칭/취업률) 모니터링
- `/admin/programs` — 프로그램 등록/수정/삭제
- `/admin/notices` — 공지사항 관리

## AI 매칭 알고리즘

채용공고 등록 시 자동 실행 (`src/app/api/jobs/route.ts` `runMatching`):

| 항목               | 배점     |
| ------------------ | -------- |
| 희망분야 일치       | 최대 40점 |
| 희망 근무지역 일치  | 최대 20점 |
| 프로필 완성도       | 최대 20점 |
| 자격요건 키워드 매칭 | 최대 20점 |
| **합계**            | **100점** |

점수가 0점 이상인 학생-공고 조합이 `MatchResult`에 저장되고,
학생 대시보드와 기업 대시보드 양쪽에서 추천 매칭으로 노출됩니다.

## 디렉토리 구조

```
src/
├── app/
│   ├── (main)/          # 네비/푸터 레이아웃을 공유하는 라우트
│   │   ├── admin/       # 관리자 페이지
│   │   ├── companies/   # 기업 목록/상세 (공개)
│   │   ├── company/     # 기업 전용 페이지
│   │   ├── jobs/        # 채용공고 (공개)
│   │   ├── messages/    # 1:1 메시지
│   │   ├── notices/     # 공지사항 (공개)
│   │   ├── programs/    # 프로그램 안내 (공개)
│   │   └── student/     # 학생 전용 페이지
│   ├── api/             # Route Handlers
│   │   ├── applications/
│   │   ├── auth/
│   │   ├── company/profile/
│   │   ├── jobs/
│   │   ├── messages/
│   │   ├── notices/
│   │   ├── programs/
│   │   └── student/profile/
│   ├── login/
│   ├── register/
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 메인 랜딩
├── components/          # Navbar, Footer, SessionProvider
├── generated/prisma/    # prisma generate 산출물
└── lib/                 # auth.ts, prisma.ts
prisma/
├── schema.prisma        # User / Student / Company / JobPosting /
│                        #  Application / MatchResult / Message /
│                        #  Program / Notice
├── migrations/
└── seed.ts
```

## 사업 연계

본 플랫폼은 호원대학교 RISE사업 Track 4-3-2
"전북의 맛(味)을 '품'은 로컬조리인재 양성" 과제의 산출물로,
직업계고 학생의 **지역 정주율 제고**와 전북 외식업체의
**우수 인재 확보**를 동시에 달성하는 대학–직업계고–지역기업
연계 생태계 구축을 목표로 합니다.

## 연락처

호원대학교 호텔조리학과 · 맛잡고 사업단
전라북도 군산시 임피면 월하로 64
