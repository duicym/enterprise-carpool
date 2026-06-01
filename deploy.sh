#!/bin/bash

set -e

echo "🚀 开始部署蹭蹭车平台..."

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Docker
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误：Docker 未安装${NC}"
    exit 1
  fi
  
  if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误：Docker Compose 未安装${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ Docker 和 Docker Compose 已安装${NC}"
}

# 创建目录
create_directories() {
  echo "创建数据目录..."
  mkdir -p backend/data backend/logs nginx/conf.d ssl
  
  echo -e "${GREEN}✓ 目录创建完成${NC}"
}

# 生成环境文件
generate_env() {
  if [ ! -f backend/.env ]; then
    echo "生成环境配置文件..."
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ 已生成 backend/.env，请修改配置${NC}"
  else
    echo -e "${GREEN}✓ 环境配置文件已存在${NC}"
  fi
}

# 启动服务
start_services() {
  echo "启动服务..."
  docker-compose up -d
  
  echo -e "${GREEN}✓ 服务启动完成${NC}"
}

# 等待服务就绪
wait_services() {
  echo "等待服务就绪..."
  sleep 10
  
  # 检查 MySQL
  until docker exec ceng-carpool-mysql mysqladmin ping -h localhost --silent &> /dev/null; do
    echo "等待 MySQL 启动..."
    sleep 2
  done
  echo -e "${GREEN}✓ MySQL 已就绪${NC}"
  
  # 检查 Redis
  until docker exec ceng-carpool-redis redis-cli ping | grep -q PONG; do
    echo "等待 Redis 启动..."
    sleep 2
  done
  echo -e "${GREEN}✓ Redis 已就绪${NC}"
}

# 运行数据库迁移
run_migrations() {
  echo "运行数据库迁移..."
  docker exec -w /app ceng-carpool-backend \
    npm run migration:run || true
  echo -e "${GREEN}✓ 数据库迁移完成${NC}"
}

# 查看状态
show_status() {
  echo ""
  echo "=================================="
  echo "服务状态:"
  docker-compose ps
  echo "=================================="
  echo ""
  echo -e "${GREEN}部署完成！${NC}"
  echo ""
  echo "后端 API: http://localhost:3000"
  echo "Swagger 文档：http://localhost:3000/api/docs"
  echo "Nginx: http://localhost"
  echo ""
  echo "查看日志:"
  echo "  docker-compose logs -f backend"
  echo ""
  echo "停止服务:"
  echo "  docker-compose down"
  echo ""
}

# 主流程
main() {
  check_docker
  create_directories
  generate_env
  start_services
  wait_services
  run_migrations
  show_status
}

# 执行
main "$@"
