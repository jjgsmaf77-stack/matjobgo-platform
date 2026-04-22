#!/usr/bin/env bash
# 가비아 g클라우드 Ubuntu 22.04 초기 셋업 스크립트
# 최초 1회만 실행: bash setup-server.sh
set -euo pipefail

echo "=============================================="
echo " 맛JobGO 서버 초기 설정"
echo "=============================================="

# 1. 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 2. 필수 패키지 설치
sudo apt install -y curl git build-essential ufw nginx certbot python3-certbot-nginx

# 3. Node.js 20.x LTS 설치 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version

# 4. PM2 전역 설치
sudo npm install -g pm2

# 5. PostgreSQL (선택, DB 자체 호스팅 시)
# sudo apt install -y postgresql postgresql-contrib
# sudo -u postgres createdb matjobgo_prod
# sudo -u postgres psql -c "CREATE USER matjobgo WITH ENCRYPTED PASSWORD 'CHANGE_ME';"
# sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE matjobgo_prod TO matjobgo;"

# 6. 앱 디렉토리 생성 + 권한
sudo mkdir -p /var/www/matjobgo-platform
sudo mkdir -p /var/log/matjobgo
sudo chown -R $USER:$USER /var/www/matjobgo-platform /var/log/matjobgo

# 7. PM2 시스템 서비스 등록 (재부팅 시 자동 시작)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# 8. 방화벽 설정
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 9. nginx 설정 배포
sudo cp /tmp/matjobgo.nginx.conf /etc/nginx/sites-available/matjobgo || true
sudo ln -sf /etc/nginx/sites-available/matjobgo /etc/nginx/sites-enabled/matjobgo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "=============================================="
echo " ✅ 초기 설정 완료"
echo "=============================================="
echo ""
echo "다음 단계:"
echo " 1. 도메인 DNS A 레코드 → 이 서버 IP 등록 (가비아 DNS 관리)"
echo " 2. SSL 인증서 발급:"
echo "    sudo certbot --nginx -d matjobgo.co.kr -d www.matjobgo.co.kr"
echo " 3. GitHub Actions 시크릿 등록 + push 하면 자동 배포"
echo ""
