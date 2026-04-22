// PM2 프로세스 관리 설정 (가비아 g클라우드 + Ubuntu)
// 사용법: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: "matjobgo",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/matjobgo-platform",
      instances: "max",             // 가용 CPU 수만큼 클러스터 모드
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",     // 1GB 초과 시 자동 재시작
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/matjobgo/error.log",
      out_file: "/var/log/matjobgo/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
