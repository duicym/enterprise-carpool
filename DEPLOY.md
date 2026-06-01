# 蹭蹭车 部署指南

## 📋 部署方式

### 方式一：Docker Compose 部署（推荐）

#### 1. 环境准备

确保已安装：
- Docker 20.10+
- Docker Compose 2.0+

```bash
# 检查 Docker
docker --version
docker-compose --version
```

#### 2. 克隆项目

```bash
git clone https://github.com/duicym/ceng-carpool.git
cd ceng-carpool
```

#### 3. 配置环境变量

```bash
# 复制环境配置示例
cp backend/.env.example backend/.env

# 编辑配置文件
vim backend/.env
```

**必须修改的配置：**
```env
# 数据库密码
DB_PASSWORD=your-secure-password

# Redis 密码
REDIS_PASSWORD=your-redis-password

# JWT 密钥
JWT_SECRET=a-random-secret-key-min-32-chars

# 微信小程序配置
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your-app-secret

# 腾讯云 COS（可选）
COS_BUCKET=your-bucket
COS_REGION=ap-guangzhou
COS_SECRET_ID=your-secret-id
COS_SECRET_KEY=your-secret-key
```

#### 4. 一键部署

```bash
chmod +x deploy.sh
./deploy.sh
```

#### 5. 验证部署

```bash
# 查看服务状态
docker-compose ps

# 查看后端日志
docker-compose logs -f backend

# 访问 Swagger 文档
http://localhost:3000/api/docs
```

### 方式二：手动部署

#### 1. 安装依赖

```bash
cd backend
npm install
```

#### 2. 配置环境

```bash
cp .env.example .env
# 编辑 .env 文件
```

#### 3. 启动数据库

```bash
# 使用 Docker 启动 MySQL
docker run -d \
  --name ceng-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=ceng_carpool \
  -p 3306:3306 \
  mysql:8.0

# 或使用本地 MySQL 服务
```

#### 4. 运行迁移

```bash
npm run migration:run
```

#### 5. 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

---

## 🛠️ Nginx 配置

### HTTPS 部署

1. **申请 SSL 证书**
   - 使用 Let's Encrypt 免费证书
   - 或在阿里云/腾讯云申请免费 SSL

2. **配置 SSL 证书**

```bash
# 创建 SSL 目录
mkdir -p ssl

# 上传证书文件
# fullchain.pem - 证书链
# privkey.pem - 私钥
```

3. **修改 Nginx 配置**

编辑 `nginx/conf.d/default.conf`:
- 修改 `server_name` 为你的域名
- 确保证书路径正确

4. **重启 Nginx**

```bash
docker-compose restart nginx
```

---

## 🔧 运维管理

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend
docker-compose logs mysql
docker-compose logs redis

# 实时查看日志
docker-compose logs -f backend
```

### 备份数据

```bash
# 备份 MySQL 数据库
docker exec ceng-carpool-mysql \
  mysqldump -uceng -p ceng_carpool > backup_$(date +%Y%m%d).sql

# 备份 Redis 数据
docker exec ceng-carpool-redis redis-cli BGSAVE

# 复制 RDB 文件
docker cp ceng-carpool-redis:/data/dump.rdb ./backup/
```

### 服务重启

```bash
# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart backend

# 重建容器
docker-compose up -d --force-recreate backend
```

### 更新版本

```bash
# 拉取最新代码
git pull

# 重新构建镜像
docker-compose build backend

# 重启服务
docker-compose up -d backend

# 运行迁移（如有）
docker exec ceng-carpool-backend npm run migration:run
```

---

## 📊 性能优化

### MySQL 优化

编辑 `docker-compose.yml` 中的 MySQL 配置:
```yaml
command: >
  --character-set-server=utf8mb4
  --collation-server=utf8mb4_unicode_ci
  --max_connections=500
  --innodb_buffer_pool_size=1G
  --innodb_log_file_size=256M
```

### Redis 优化

```yaml
command: >
  redis-server 
  --requirepass your-password
  --maxmemory 512mb
  --maxmemory-policy allkeys-lru
```

---

## 🚨 故障排查

### 后端无法启动

```bash
# 查看日志
docker-compose logs backend

# 检查端口占用
docker-compose ps

# 检查数据库连接
docker exec -it ceng-carpool-mysql mysql -uceng -p
```

### 数据库连接失败

1. 检查 MySQL 是否启动
2. 检查数据库密码是否正确
3. 检查网络配置

```bash
# 测试数据库连接
docker exec -it ceng-carpool-mysql mysqladmin ping -h localhost
```

### Redis 连接失败

```bash
# 测试 Redis
docker exec -it ceng-carpool-redis redis-cli ping
```

---

## 📞 技术支持

如遇到部署问题，请：
1. 查看日志文件
2. 检查环境配置
3. 访问 GitHub Issues 提交问题

---

**最后更新**: 2024-06-01
