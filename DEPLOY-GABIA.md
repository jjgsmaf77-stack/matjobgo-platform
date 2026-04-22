# 맛JobGO · 가비아 + GitHub 배포 가이드

호원대학교 RISE사업 공식 운영 환경 (RISE 성과관리 배포 방식과 동일).

---

## 🗂 배포 전체 흐름

```
1. 가비아 도메인 구매 (예: matjobgo.co.kr)
   ↓
2. 가비아 g클라우드 서버 신청 (Ubuntu 22.04)
   ↓
3. GitHub 레포 생성 + 코드 push
   ↓
4. 서버 초기 셋업 (setup-server.sh)
   ↓
5. GitHub Secrets 등록 (SSH 키, DB URL 등)
   ↓
6. push → GitHub Actions → 자동 배포
   ↓
7. Let's Encrypt SSL 인증서 발급
   ↓
8. matjobgo.co.kr 정식 서비스 오픈
```

---

## 1단계 · 가비아 도메인 구매 (먼저 해야 할 일)

### 1-1. 가비아 접속
https://www.gabia.com

### 1-2. 추천 도메인 후보

| 도메인 | 연 비용(대략) | 특징 |
|---|---|---|
| **matjobgo.co.kr** | 22,000원 | 대한민국 공식, 기관 신뢰도↑ |
| **matjobgo.co.kr** | 22,000원 | 기업 느낌 강함 |
| matjobgo.com | 18,000원 | 국제 범용 |
| matjob.go.kr | ❌ | go.kr은 정부기관만 |
| howon-matjobgo.co.kr | 22,000원 | 호원대 소속 명확 |
| jb-matjobgo.co.kr | 22,000원 | 전북 + 맛JobGO |

**RISE 사업 공식성 → `.kr` 또는 `.co.kr` 강력 권장**

### 1-3. 구매 절차
1. 가비아 상단 검색창에 `matjobgo` 입력
2. 희망 확장자 선택 (`.kr` 권장)
3. 장바구니 → 결제 (1년, 2년 단위)
4. Whois 정보 입력 (호원대학교 RISE사업단 등록)

### 1-4. 구매 완료 후
**DNS 레코드 설정 UI에서 임시로 아무 IP나 지정해도 됨** — 서버 준비 후 변경 예정.

---

## 2단계 · 가비아 g클라우드 서버 신청

### 2-1. 접속
https://gabia.com/service/cloud

### 2-2. 권장 스펙 (맛JobGO 규모)

| 사양 | 스펙 | 월 요금(대략) |
|---|---|---|
| **g4 · Standard** | vCPU 2 / RAM 4GB / SSD 50GB | 22,000원 |
| g2 · Basic | vCPU 1 / RAM 2GB / SSD 30GB | 11,000원 (최소) |
| g6 · Premium | vCPU 4 / RAM 8GB / SSD 100GB | 45,000원 (여유) |

**추천: g4 Standard** (약 2만 2천원/월, 3개년 사업 기간 ≈ 80만원)

### 2-3. OS 선택
**Ubuntu 22.04 LTS (64bit)** 선택. `setup-server.sh` 는 Ubuntu 기준.

### 2-4. 네트워크 설정
- 공인 IP 할당 (자동)
- 방화벽 기본값: SSH(22) + HTTP(80) + HTTPS(443)

### 2-5. SSH 키 등록
1. 로컬에서 SSH 키 생성 (이미 있으면 건너뜀):
   ```bash
   ssh-keygen -t ed25519 -C "matjobgo-deploy"
   # 저장 위치: ~/.ssh/matjobgo_ed25519
   ```
2. 공개키 `~/.ssh/matjobgo_ed25519.pub` 내용을 가비아 서버 생성 시 등록
3. 비밀키 `~/.ssh/matjobgo_ed25519` 는 GitHub Secrets에 저장 예정

---

## 3단계 · 도메인을 서버에 연결

서버 신청 완료 후 공인 IP (예: `211.234.xxx.xxx`) 확인.

가비아 DNS 관리:
1. My가비아 → 도메인 → 해당 도메인 → DNS 관리
2. A 레코드 추가:
   ```
   @         IN  A   211.234.xxx.xxx       (TTL 3600)
   www       IN  A   211.234.xxx.xxx       (TTL 3600)
   ```
3. 반영 대기 (15분~24시간)
4. 확인: `nslookup matjobgo.co.kr`

---

## 4단계 · GitHub 레포 생성 + push

### 4-1. GitHub 인증 (PAT 방식)

타임아웃 이슈가 있었으니 PAT 방식 권장:
1. https://github.com/settings/tokens/new
2. Note: `matjobgo-deploy`, 권한: `repo`, `workflow`
3. 토큰을 파일에 저장:
   ```powershell
   notepad C:\Users\howon\gh_token.txt
   ```
4. gh CLI 인증:
   ```bash
   gh auth login --with-token < /c/Users/howon/gh_token.txt
   ```

### 4-2. 레포 생성 + push
```bash
cd "E:/2025 RISE 결과보고서/matjobgo-platform"
git add -A && git commit -m "feat: Gabia 배포 준비" || true
gh repo create matjobgo-platform --public --source=. --remote=origin --push
```

---

## 5단계 · 서버 초기 셋업

### 5-1. 서버 접속
```bash
ssh -i ~/.ssh/matjobgo_ed25519 ubuntu@211.234.xxx.xxx
```

### 5-2. 스크립트 업로드 + 실행
로컬에서:
```bash
scp -i ~/.ssh/matjobgo_ed25519 \
    scripts/setup-server.sh \
    scripts/matjobgo.nginx.conf \
    ubuntu@211.234.xxx.xxx:/tmp/
```

서버에서:
```bash
chmod +x /tmp/setup-server.sh
bash /tmp/setup-server.sh
```

설치되는 것:
- Node.js 20 LTS
- PM2 (프로세스 매니저)
- nginx (리버스 프록시)
- certbot (Let's Encrypt SSL)
- ufw 방화벽 설정

---

## 6단계 · GitHub Secrets 등록

https://github.com/<user>/matjobgo-platform/settings/secrets/actions

아래 시크릿을 추가:

| 이름 | 값 |
|---|---|
| `GABIA_HOST` | 서버 공인 IP (예: `211.234.xxx.xxx`) |
| `GABIA_USER` | `ubuntu` (또는 root) |
| `GABIA_PORT` | `22` (기본) |
| `GABIA_SSH_KEY` | 비밀키 전체 내용 (`cat ~/.ssh/matjobgo_ed25519`) |
| `DATABASE_URL` | DB 접속 URL (아래 7단계 참고) |
| `NEXTAUTH_SECRET` | 랜덤 시크릿 (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://matjobgo.co.kr` |

---

## 7단계 · 데이터베이스 선택

### Option A: 서버 내 PostgreSQL (권장, 비용 추가 없음)
```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
```
```sql
CREATE DATABASE matjobgo_prod;
CREATE USER matjobgo WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE matjobgo_prod TO matjobgo;
\q
```
Secret: `DATABASE_URL=postgresql://matjobgo:STRONG_PASSWORD@localhost:5432/matjobgo_prod`

schema.prisma 변경:
```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}
```

### Option B: Neon Postgres (외부, 무료 티어)
- https://neon.tech 가입
- 프로젝트 생성 → `DATABASE_URL` 복사
- 코드 변경 동일

### Option C: SQLite (개발용 그대로)
별도 설정 불필요. 단, 백업 파일만 서버에 유지.

---

## 8단계 · 자동 배포 시작

```bash
# 로컬에서 코드 변경 후
git add -A
git commit -m "feat: 새 기능"
git push origin main
```

`.github/workflows/deploy.yml` 이 자동 실행:
1. npm install → prisma generate → next build
2. 빌드 산출물을 tar.gz 로 압축
3. SSH 로 서버에 업로드
4. 서버에서 압축 해제 + PM2 재시작

1~3분 내 반영. GitHub Actions 탭에서 진행 상황 실시간 확인.

---

## 9단계 · SSL 인증서 발급 (Let's Encrypt 무료)

DNS 반영 확인 후:
```bash
sudo certbot --nginx -d matjobgo.co.kr -d www.matjobgo.co.kr
```
- 이메일 입력
- 약관 동의 (Y)
- HTTPS 리다이렉트 선택 (2)

90일마다 자동 갱신됨 (`certbot renew --dry-run` 으로 확인).

---

## 10단계 · 공식 서비스 오픈 🎉

```
https://matjobgo.co.kr
```

- SSL 인증서 (초록 자물쇠)
- 영구 접속
- GitHub push → 1~3분 내 자동 배포
- PM2 클러스터 모드 (멀티 코어 활용)
- nginx 캐시 + 압축

---

## 운영 체크리스트

### 일상
- [ ] 서버 메모리 / 디스크 모니터링: `htop`, `df -h`
- [ ] PM2 상태: `pm2 status`, `pm2 logs matjobgo`
- [ ] nginx 로그: `sudo tail -f /var/log/nginx/matjobgo.access.log`

### 매주
- [ ] `sudo apt update && sudo apt upgrade` (보안 패치)
- [ ] `pm2 logs` 확인
- [ ] DB 백업: `pg_dump matjobgo_prod > backup_$(date +%Y%m%d).sql`

### 매월
- [ ] 도메인 만료일 확인 (가비아 My 페이지)
- [ ] 서버 비용 결제 확인
- [ ] SSL 인증서 상태: `certbot certificates`

---

## 예상 비용 요약 (3개년 RISE 사업 기준)

| 항목 | 월 | 3년 |
|---|---|---|
| 도메인 `.kr` (1년당 22,000원) | - | 66,000원 |
| 가비아 g클라우드 g4 Standard | 22,000원 | 792,000원 |
| SSL (Let's Encrypt) | 무료 | 0원 |
| **합계** | **22,000원** | **약 86만원** |

정부 지원 RISE 사업 예산에 충분히 수용 가능.

---

## 트러블슈팅

### "502 Bad Gateway"
- PM2 프로세스 종료됨: `pm2 restart matjobgo`
- 로그 확인: `pm2 logs matjobgo --lines 100`

### "404 Not Found"
- nginx 재시작: `sudo systemctl reload nginx`
- `.next` 빌드 결과물 재생성

### GitHub Actions 실패
- Secrets 누락 확인
- 서버 SSH 접속 가능한지 테스트
- 디스크 공간 확인 (`df -h`)

### 느린 응답
- PM2 instances 수 조정
- nginx gzip · 캐시 설정 확인
- DB 쿼리 프로파일링
