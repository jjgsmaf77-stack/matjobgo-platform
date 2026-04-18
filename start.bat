@echo off
REM 맛JobGO 플랫폼 개발 서버 실행 스크립트
REM Node.js 20+ 와 npm 이 PATH 에 있어야 합니다.

setlocal
cd /d "%~dp0"

echo ====================================
echo   맛JobGO 플랫폼 개발 환경 초기화
echo ====================================

where node >nul 2>nul
if errorlevel 1 (
    echo [오류] Node.js 가 설치되어 있지 않거나 PATH 에 등록되어 있지 않습니다.
    echo        https://nodejs.org 에서 LTS 버전을 설치 후 다시 시도해주세요.
    pause
    exit /b 1
)

if not exist node_modules (
    echo [1/4] 의존성 설치 중...
    call npm install
    if errorlevel 1 goto :fail
) else (
    echo [1/4] 의존성 설치 확인 - 건너뜀
)

echo [2/4] Prisma 클라이언트 생성 중...
call npx prisma generate
if errorlevel 1 goto :fail

echo [3/4] DB 마이그레이션 적용 중...
call npx prisma migrate deploy
if errorlevel 1 goto :fail

echo [3.5/4] 샘플 데이터 시딩 중...
call npm run seed

echo [4/4] 개발 서버 기동 (Ctrl+C 로 종료)
echo        http://localhost:3000
call npm run dev
goto :end

:fail
echo [오류] 초기화 실패.
pause
exit /b 1

:end
endlocal
