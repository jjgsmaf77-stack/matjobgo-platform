# 맛JobGO · 외부 배포 구성

호원대학교 RISE사업 Track 4-3-2 플랫폼.
**`howonrise.co.kr` 과 동일한 이중 배포 아키텍처** (GitHub + Netlify + Vercel).

---

## 🌐 배포 구성 개요

### 1. 소스 저장소 (GitHub)
```
github.com/<owner>/matjobgo-platform
```
- `main` 브랜치 push → Netlify / Vercel 자동 감지 → 빌드 & 배포
- PR push → Preview 배포 (커밋별 개별 URL)

### 2. 호스팅 플랫폼 (이중 구성)

Netlify와 Vercel **양쪽 모두 설정 완료**. 어느 쪽이든 원-클릭 배포.

#### 🅰️ Netlify — `netlify.toml`
```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```
- SSR · API 라우트 · ISR 모두 지원 (`@netlify/plugin-nextjs`)
- 보안 헤더: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`

#### 🅱️ Vercel — `vercel.json`
```json
{
  "framework": "nextjs",
  "cleanUrls": true,
  "trailingSlash": false,
  "regions": ["icn1"],
  "headers": [...]
}
```
- 서울 리전(`icn1`) 고정 — 한국 사용자 응답 속도 최적화
- Clean URL + 동일한 보안 헤더

### 3. 커스텀 도메인
```
matjobgo.co.kr            ← 메인 (가비아 등록)
www.matjobgo.co.kr        ← www 서브 → main 으로 301 리다이렉트
```
- 가비아 DNS 관리에서 CNAME 등록
- `public/CNAME` 파일로도 명시
- Let's Encrypt SSL 자동 발급 (Netlify · Vercel 양쪽 모두 자동)

### 4. 캐시 · MIME 헤더 (`public/_headers`)

Netlify 전용 정적 헤더 파일:

| 대상 | 캐시 전략 |
|---|---|
| HTML · `/` | **1시간** (`max-age=3600`) — SSR 최신 상태 반영 |
| JS · CSS | **1일** (`max-age=86400`) + UTF-8 명시 |
| `_next/static/*` | **1년 immutable** (해시 버전 관리) |
| 이미지 (jpg/png/webp/svg) | **7일** (`max-age=604800`) |
| 사용자 업로드 (`/uploads/*`) | **30일** |
| 폰트 (woff/woff2) | **1년 immutable** |
| API 응답 (`/api/*`) | `no-store, no-cache` |

### 5. 빌드 파이프라인

```
[로컬]
  git add -A
  git commit -m "feat: ..."
  git push origin main
    ↓
[GitHub]
  새 커밋 이벤트
    ↓
[Netlify / Vercel]
  (1) 저장소 fetch
  (2) npm install
  (3) npx prisma generate
  (4) next build
  (5) CDN 에 업로드
  (6) 이전 배포 → 롤백 가능 상태로 보존
  (7) 새 배포 promote → matjobgo.co.kr 반영
    ↓
[전 세계 사용자]
  1~3분 내 새 버전 접근 가능
```

---

## ⚙ 필수 환경 변수 (양쪽 플랫폼 공통)

| 변수 | 예시 값 | 설명 |
|---|---|---|
| `TURSO_DATABASE_URL` | `libsql://matjobgo-platform-xxx.turso.io` | DB URL (Turso) |
| `TURSO_AUTH_TOKEN` | `eyJhbGciOiJFZERTQSIs...` | DB 인증 토큰 |
| `NEXTAUTH_SECRET` | 32자+ 랜덤 | JWT 시크릿 · `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://matjobgo.co.kr` | 공식 URL |

### Netlify 등록
Site settings → **Environment variables** → Add variable

### Vercel 등록
Project → Settings → **Environment Variables** → Production/Preview/Development 체크

---

## 🚀 초기 배포 단계

### [1단계] Turso DB 생성 (3분)
```bash
# CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 가입 + DB
turso auth signup
turso db create matjobgo-platform --location nrt
turso db show matjobgo-platform --url          # → TURSO_DATABASE_URL
turso db tokens create matjobgo-platform       # → TURSO_AUTH_TOKEN

# 스키마 + 데이터 주입
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="eyJhbGc..."
npx prisma migrate deploy
npm run seed
```

### [2단계] GitHub 레포 push (3분)
```bash
# PAT 발급: https://github.com/settings/tokens/new
#  Scopes: repo, workflow

gh auth login --with-token < /c/Users/howon/gh_token.txt
git add -A
git commit -m "feat: 외부 배포 구성 (Netlify + Vercel + 가비아)"
gh repo create matjobgo-platform --public --source=. --remote=origin --push
```

### [3단계] Netlify 연결 (옵션 A)
1. https://netlify.com → **Sign up with GitHub**
2. **Add new site** → **Import an existing project** → GitHub → `matjobgo-platform` 선택
3. 빌드 설정 자동 감지됨 (netlify.toml 기반)
4. **Environment variables** 에 위 4개 등록
5. **Deploy site** 클릭
6. 배포 완료 후 URL: `https://matjobgo-platform.netlify.app`

### [3단계] Vercel 연결 (옵션 B · 둘 다 가능)
1. https://vercel.com → **Sign up with GitHub**
2. **Add New Project** → `matjobgo-platform` Import
3. Framework: **Next.js** 자동 감지
4. 환경 변수 4개 등록
5. **Deploy** 클릭
6. URL: `https://matjobgo-platform.vercel.app`

### [4단계] 가비아 DNS 연결 (3분)
가비아 My페이지 → `matjobgo.co.kr` → **DNS 관리**:

**Netlify 사용 시**:
```
호스트    타입     값
@         ALIAS    apex-loadbalancer.netlify.com
www       CNAME    <your-site>.netlify.app
```

**Vercel 사용 시**:
```
호스트    타입     값
@         A        76.76.21.21
www       CNAME    cname.vercel-dns.com
```

Netlify/Vercel 대시보드 → Domains → Add custom domain → `matjobgo.co.kr` 입력 →
안내되는 정확한 레코드 값으로 가비아에 등록.

### [5단계] DNS 전파 대기 + SSL 자동 발급
- 전파: 15분 ~ 24시간
- SSL: Let's Encrypt 자동 (90일 자동 갱신)
- 확인: `nslookup matjobgo.co.kr` · 브라우저에서 https:// 확인

---

## 🔄 향후 업데이트는 push 한 번

```bash
git add -A
git commit -m "feat: 맛담에 신규 카테고리 추가"
git push origin main
```

1~3분 내:
- Netlify → `matjobgo-platform.netlify.app` 업데이트
- Vercel → `matjobgo.co.kr` 반영

---

## 📁 배포 관련 파일 구조

```
matjobgo-platform/
├── netlify.toml              ← Netlify 빌드 · 헤더 · 플러그인
├── vercel.json               ← Vercel 빌드 · 헤더 · 리전
├── next.config.ts            ← Next.js 설정 (standalone 등)
├── package.json              ← @netlify/plugin-nextjs 포함
├── .env.example              ← 환경변수 템플릿
├── public/
│   ├── _headers              ← Netlify 정적 헤더
│   ├── _redirects            ← Netlify 리다이렉트
│   └── CNAME                 ← 도메인 기록
└── DEPLOY.md                 ← 이 문서
```

---

## 🆘 트러블슈팅

### "prisma: command not found"
빌드 명령에 `npx prisma generate` 포함됐는지 확인 (netlify.toml / vercel.json).

### DB 연결 실패
- Turso 토큰 만료 확인: `turso db tokens create matjobgo-platform`
- 환경변수 이름 정확히 `TURSO_DATABASE_URL` (오타 주의)

### 파일 업로드 사라짐
Netlify/Vercel 서버리스 함수는 **파일 시스템이 일시적**.
사용자 이미지 업로드는 별도 서비스 필요:
- **Netlify Blobs** (Netlify 내장)
- **Vercel Blob** (Vercel 내장)
- **Cloudflare R2** (10GB 무료)
- **Supabase Storage** (1GB 무료)

### 도메인 안 붙음
- DNS 전파 `dig matjobgo.co.kr` 로 확인
- Netlify/Vercel "Verify" 재시도
- 가비아 DNS 반영 대기 (최대 24시간)

---

## 💰 예상 운영 비용 (3개년)

| 항목 | 플랜 | 월 | 3년 |
|---|---|---|---|
| 가비아 도메인 `.co.kr` | — | — | 66,000원 |
| Netlify | Free | 0원 | 0원 |
| Vercel | Hobby | 0원 | 0원 |
| Turso DB | Free | 0원 | 0원 |
| **합계** | | **0원** | **66,000원** |

무료 티어 초과 시 (트래픽 100GB+/월 등) 플랜 전환.

---

## ✅ 이 구성의 장점

- **관리 불필요**: 서버 패치 · SSL 갱신 · 백업 모두 자동
- **이중화**: Netlify/Vercel 둘 다 설정되어 있어 한쪽 장애 시 대체 가능
- **Git 중심**: 버전 관리 + 롤백 모두 GitHub 에서
- **미리보기**: PR마다 고유 URL 자동 생성 → 리뷰 편리
- **전 세계 CDN**: 아시아 · 미국 · 유럽 edge 자동 캐시
- **보안**: HSTS · CSP · XSS 방지 헤더 기본
