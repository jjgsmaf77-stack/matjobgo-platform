# 맛JobGO · Vercel + 가비아 도메인 배포 (권장)

**RISE 성과관리 사이트들이 실제로 가장 많이 쓰는 방식** — 서버 관리 불필요, 5분 내 배포, 자동 SSL, git push 하나로 재배포.

```
[사용자] → matjobgo.co.kr → [가비아 DNS]
                              ↓ CNAME
                         [Vercel Edge · 전 세계 CDN]
                              ↓
                         [Next.js 앱]
                              ↓
                         [Turso SQLite 클라우드 DB]
```

## 💰 비용 비교

| 방식 | 월 | 3년 | 관리 |
|---|---|---|---|
| ❌ g클라우드 VPS | 22,000원 | 800,000원 | 직접 서버 관리 |
| ✅ **Vercel + Turso + 도메인** | **0원** | **66,000원** | 관리 불필요 |

무료 티어만으로 충분 (Vercel: 100GB 대역폭/월, Turso: 500 DB/5억 읽기/10억 쓰기 연간).

---

## 10분 배포 로드맵

```
1. Turso DB 생성                      (3분)
2. GitHub 레포 생성 + 코드 push       (3분)
3. Vercel 가입 + GitHub 연결          (1분)
4. Vercel 환경변수 등록               (2분)
5. Vercel Deploy 클릭                 (1분, 자동)
6. 가비아 DNS에서 CNAME 설정          (3분)
7. Vercel에서 도메인 추가 → SSL 자동  (1분)
8. DNS 전파 대기                      (15분~24시간)
9. https://matjobgo.co.kr 오픈 🎉
```

---

## 1단계 · Turso DB 생성

### 1-1. CLI 설치
PowerShell / Git Bash:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
# PATH 에 ~/.turso 추가 후 쉘 재시작
```

Windows 에서 curl 없으면:
- https://github.com/tursodatabase/turso-cli/releases
- 최신 `turso-windows-amd64.zip` 다운로드 후 PATH에 추가

### 1-2. 가입 + DB 생성
```bash
turso auth signup          # GitHub 계정으로 가입 권장
turso db create matjobgo-platform --location nrt    # nrt = Tokyo (한국 가장 가까움)

# DB URL + 토큰 발급
turso db show matjobgo-platform --url
turso db tokens create matjobgo-platform
```

출력 예시:
```
libsql://matjobgo-platform-howon.turso.io
eyJhbGciOiJFZERTQSIsInR...
```

이 두 값을 **따로 기록**해두세요 (Vercel 환경변수에 등록).

### 1-3. 로컬 DB에서 Turso로 스키마+데이터 복사

로컬에서 실행:
```bash
# 환경변수 임시 설정
export TURSO_DATABASE_URL="libsql://matjobgo-platform-howon.turso.io"
export TURSO_AUTH_TOKEN="eyJhbGc..."

# 마이그레이션 실행 (스키마 생성)
npx prisma migrate deploy

# 시드 데이터 주입
npm run seed
```

Windows PowerShell:
```powershell
$env:TURSO_DATABASE_URL="libsql://matjobgo-platform-howon.turso.io"
$env:TURSO_AUTH_TOKEN="eyJhbGc..."
npx prisma migrate deploy
npm run seed
```

---

## 2단계 · GitHub 레포 생성

### 2-1. PAT 발급
https://github.com/settings/tokens/new
- Note: `matjobgo-deploy`
- Scopes: `repo`, `workflow`
- Generate → 토큰 복사

### 2-2. 로컬에서 gh 인증
```bash
# 토큰을 파일로 저장
notepad C:\Users\howon\gh_token.txt
# ghp_xxxxx... 붙여넣기 저장

# 인증
gh auth login --with-token < /c/Users/howon/gh_token.txt
```

### 2-3. 레포 생성 + push
```bash
cd "E:/2025 RISE 결과보고서/matjobgo-platform"
git add -A
git commit -m "feat: Vercel 배포 준비 + Turso DB 지원" || true

gh repo create matjobgo-platform \
  --public \
  --source=. \
  --remote=origin \
  --description "호원대학교 RISE사업 Track 4-3-2 맛JobGO 플랫폼" \
  --push
```

완료되면 `https://github.com/<계정>/matjobgo-platform` 에 코드 업로드됨.

---

## 3단계 · Vercel 연결

### 3-1. 가입
https://vercel.com → **"Sign Up with GitHub"** 클릭 (가장 쉬움)

### 3-2. 프로젝트 Import
1. 대시보드 → **"Add New... Project"**
2. GitHub 저장소 목록에서 **`matjobgo-platform`** 찾아 **"Import"** 클릭
3. Framework Preset: **Next.js** 자동 감지
4. Root Directory: 그대로 (`/`)
5. Build Command: 기본값 (`next build`)
6. **"Environment Variables"** 섹션에서 아래 3개 추가:

| Name | Value |
|---|---|
| `TURSO_DATABASE_URL` | 위에서 발급받은 URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | 위에서 발급받은 토큰 (`eyJhbGc...`) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` 결과 (32자+) |
| `NEXTAUTH_URL` | `https://matjobgo.co.kr` |

7. **"Deploy"** 클릭

1~3분 후 자동으로:
```
https://matjobgo-platform-<hash>.vercel.app
```
주소가 발급됩니다.

---

## 4단계 · 가비아 도메인 → Vercel 연결

### 4-1. Vercel에 도메인 추가
Vercel 프로젝트 → **Settings** → **Domains** → 
- `matjobgo.co.kr` 입력 → **Add**
- `www.matjobgo.co.kr` 입력 → **Add**

Vercel이 필요한 DNS 레코드를 알려줍니다. 예:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com.
```

### 4-2. 가비아 DNS에 등록
1. 가비아 My페이지 → 도메인 → **`matjobgo.co.kr`** → **DNS 관리** 클릭
2. 기존 A/CNAME 레코드 모두 삭제
3. Vercel이 알려준 레코드 추가:
   ```
   호스트: @        타입: A        값: 76.76.21.21     (Vercel 안내 IP)
   호스트: www      타입: CNAME    값: cname.vercel-dns.com.
   ```
4. 저장

### 4-3. 전파 대기 + SSL 자동 발급
- DNS 전파: 15분~24시간
- Vercel이 자동으로 **Let's Encrypt SSL 인증서 발급** (90일마다 자동 갱신)
- 확인: `nslookup matjobgo.co.kr`

전파 완료 후:
```
https://matjobgo.co.kr  ← 공식 URL 오픈 🎉
```

---

## 5단계 · 향후 배포 (git push 한 번으로)

```bash
# 로컬에서 코드 수정 후
git add -A
git commit -m "feat: 새 기능"
git push origin main
```

Vercel이 자동으로:
1. 빌드 실행
2. Preview 배포 (커밋마다 개별 URL)
3. main 브랜치는 **production 자동 배포**
4. `https://matjobgo.co.kr` 에 1~2분 내 반영

---

## 파일 업로드 주의사항 (맛담 게시글 이미지 등)

Vercel serverless는 **파일 시스템이 일시적** → `public/uploads/` 에 이미지 저장해도 **재배포 시 사라짐**.

### 해결책 3가지

#### Option A: Vercel Blob (가장 쉬움)
```bash
npm install @vercel/blob
```
Vercel 대시보드에서 Blob Storage 추가 → 토큰 복사 → 환경변수 등록.
`src/app/api/posts/upload/route.ts` 에서 파일 쓰기 대신 Blob SDK 사용.

#### Option B: Cloudflare R2 (무료 10GB)
- AWS S3 호환
- 무료 티어 풍부

#### Option C: Supabase Storage (무료 1GB)
- Postgres + Storage 번들

**지금 당장은 시드된 갤러리 이미지만 정적 제공하면 되므로 Option 선택은 런칭 후 결정 가능.**

---

## 트러블슈팅

### 배포는 되는데 500 에러
- Vercel 대시보드 → Deployments → 실패한 배포 클릭 → **Function Logs**
- 보통 환경변수 누락 또는 DB 연결 실패

### "Prisma client not found"
- Vercel 빌드 명령에 `prisma generate` 추가 (이미 `vercel.json` 에 포함됨)

### DNS 전파 느림
- `dig matjobgo.co.kr` 또는 `nslookup matjobgo.co.kr` 로 확인
- 국내 DNS 서버 캐시: 보통 1~2시간
- 글로벌: 최대 24시간

### 로그인 후 리다이렉트 안 됨
- `NEXTAUTH_URL` 환경변수 확인 (`https://matjobgo.co.kr`)
- `NEXTAUTH_SECRET` 설정 확인

---

## 운영 팁

| 작업 | 경로 |
|---|---|
| 배포 이력 | Vercel → Deployments |
| 로그 실시간 보기 | Vercel → Logs |
| 트래픽 통계 | Vercel → Analytics (무료) |
| DB 콘솔 | `turso db shell matjobgo-platform` |
| 환경변수 변경 | Vercel → Settings → Environment Variables |
| 프리뷰 배포 | feature 브랜치 push → PR 댓글에 링크 자동 |
| 롤백 | Vercel → Deployments → 이전 배포 → "Promote to Production" |

---

## 정리

**이 방법이 왜 RISE 성과관리 스타일인가?**
- 대부분 정부 사업 사이트는 실제로 **관리형 호스팅** 사용 (직접 서버 관리 없음)
- 가비아 · 카페24 · AWS Amplify 등 PaaS 방식
- Vercel은 **한국 공공 · 교육기관 도입 사례 다수** (PaaS 중 가장 현대적)
- SSL · CDN · 배포 · 롤백 · 모니터링 모두 자동

**도메인(가비아) + 호스팅(Vercel) 분리가 표준.**
