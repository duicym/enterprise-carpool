# 企业顺风车后端

基于 NestJS 的企业顺风车平台后端 API 服务。

## 功能模块

| 模块 | 说明 | 路径前缀 |
|------|------|---------|
| Auth | 微信登录认证 | `/api/auth` |
| User | 用户管理 | `/api/user` |
| Company | 企业搜索与认证 | `/api/company` |
| Admin | 后台管理（审核、用户管理） | `/api/admin` |
| Route | 路线发布与查询 | `/api/route` |
| Order | 订单管理 | `/api/order` |
| Review | 双向评价 | `/api/review` |
| Notification | 消息通知 | `/api/notification` |
| OSS | 文件上传（腾讯云 COS） | `/api/admin/certificate/upload` |

## 快速开始

### 本地开发（SQLite 模式）

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 设置 DB_TYPE=sqlite

# 启动开发服务器
npm run start:dev
```

### 生产环境（MySQL + Redis）

```bash
# 启动数据库和 Redis
docker-compose up -d

# 配置环境变量
# 设置 DB_TYPE=mysql，填写数据库连接信息

# 运行数据库迁移
npm run migration:run

# 启动服务
npm run start:prod
```

## 可用脚本

```bash
npm run start          # 启动服务
npm run start:dev      # 开发模式（热重载）
npm run start:prod     # 生产模式
npm run build          # 构建项目
npm run lint           # 代码检查
npm run format         # 代码格式化
npm run migration:run  # 运行数据库迁移
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NODE_ENV` | 运行环境 | `development` |
| `APP_PORT` | 服务端口 | `3000` |
| `APP_PREFIX` | API 前缀 | `api` |
| `DB_TYPE` | 数据库类型（sqlite/mysql） | `sqlite` |
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_USERNAME` | 数据库用户名 | `root` |
| `DB_PASSWORD` | 数据库密码 | `root` |
| `DB_DATABASE` | 数据库名称 | `carpool` |
| `JWT_SECRET` | JWT 密钥 | - |
| `WECHAT_APP_ID` | 微信小程序 AppID | - |
| `WECHAT_APP_SECRET` | 微信小程序 AppSecret | - |
| `REDIS_HOST` | Redis 主机 | `localhost` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `REDIS_PASSWORD` | Redis 密码 | - |
| `COS_SECRET_ID` | 腾讯云 COS SecretId | - |
| `COS_SECRET_KEY` | 腾讯云 COS SecretKey | - |
| `COS_BUCKET` | COS 存储桶名称 | - |
| `COS_REGION` | COS 地域 | - |

## API 文档

启动服务后访问：`http://localhost:3000/api/docs`

## 数据库表

- `user` - 用户表
- `company` - 企业表
- `user_company` - 用户企业关联（含审核）
- `route` - 路线表
- `order` - 订单表
- `review` - 评价表
- `notification` - 通知表

## 部署

### Docker

```bash
docker build -t carpool-backend .
docker run -d -p 3000:3000 --env-file .env carpool-backend
```

### Docker Compose

```bash
docker-compose up -d
```
