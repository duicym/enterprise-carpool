#!/bin/bash

echo "=== 企业顺风车平台 - 启动脚本 ==="

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "错误：Docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "错误：Docker Compose 未安装"
    exit 1
fi

# 启动数据库和 Redis
echo "1. 启动数据库和 Redis..."
cd backend
docker-compose up -d

# 等待数据库启动
echo "等待数据库启动..."
sleep 10

# 安装后端依赖
echo "2. 安装后端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 配置环境变量
if [ ! -f ".env" ]; then
    echo "3. 创建环境变量配置..."
    cp .env.example .env
    echo "请编辑 backend/.env 文件配置必要的环境变量"
fi

# 运行数据库迁移
echo "4. 运行数据库迁移..."
npm run migration:run

# 启动后端服务
echo "5. 启动后端服务..."
npm run start:dev &
BACKEND_PID=$!

# 等待后端启动
echo "等待后端服务启动..."
sleep 5

# 清理后台进程
trap "kill $BACKEND_PID 2>/dev/null" EXIT

echo ""
echo "=== 启动完成 ==="
echo "后端服务：http://localhost:3000"
echo "Swagger 文档：http://localhost:3000/api/docs"
echo ""
echo "小程序开发：请在微信开发者工具中打开 miniprogram 目录"
echo ""
echo "按 Ctrl+C 停止服务"

# 保持脚本运行
wait
