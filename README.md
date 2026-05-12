# 企业顺风车平台

一个面向公众的小程序拼车平台，支持多企业用户（企业名称相同即视为同公司），用户自行入驻并上传在职证明审核。

> 本项目提供完整的后端 API 服务和微信小程序前端，支持本地开发（SQLite 模式）和生产部署（MySQL 模式）。

## 项目结构

```
enterprise-carpool/
├── backend/                  # NestJS 后端服务
│   ├── src/
│   │   ├── modules/         # 业务模块
│   │   │   ├── auth/        # 微信登录认证
│   │   │   ├── user/        # 用户管理
│   │   │   ├── company/     # 企业认证
│   │   │   ├── admin/       # 后台管理
│   │   │   ├── route/       # 路线管理
│   │   │   ├── order/       # 订单管理
│   │   │   ├── review/      # 评价系统
│   │   │   ├── notification/# 消息通知
│   │   │   └── oss/         # 文件上传（腾讯云COS）
│   │   ├── guards/          # JWT 认证守卫
│   │   ├── common/          # 全局过滤器和拦截器
│   │   └── config/          # 数据库和 Redis 配置
│   ├── docker-compose.yml
│   └── package.json
├── miniprogram/              # 微信小程序前端
│   ├── pages/               # 10 个完整页面
│   │   ├── login/           # 微信授权登录
│   │   ├── company-auth/    # 企业认证
│   │   ├── index/           # 首页路线列表
│   │   ├── route-publish/   # 发布路线
│   │   ├── route-detail/    # 路线详情
│   │   ├── order/           # 订单列表
│   │   ├── order-detail/    # 订单详情
│   │   ├── profile/         # 个人中心
│   │   ├── notification/    # 消息通知
│   │   └── review/          # 评价
│   ├── utils/               # API 请求封装
│   ├── images/              # 静态资源
│   └── app.ts               # 全局配置
├── .monkeycode/             # 项目文档和规格
│   └── specs/
│       └── carpool-platform/
├── start.sh                 # 一键启动脚本
└── README.md
```

## 核心功能

### 用户端（小程序）
- ✅ **微信授权登录** - 一键登录，自动识别新老用户
- ✅ **企业认证** - 上传在职证明，支持公司搜索和审核状态展示
- ✅ **路线发布** - 选择起点/终点、出发时间、座位数、价格
- ✅ **路线搜索** - 按关键词、日期、时间筛选
- ✅ **预约座位** - 查看路线详情、预约下单、备注信息
- ✅ **订单管理** - 全部/待确认/已确认/已完成/已取消 Tab 筛选
- ✅ **订单操作** - 确认接单、取消订单、完成行程
- ✅ **联系对方** - 一键拨打车主/乘客电话
- ✅ **双向评价** - 星级评分、文字评价、匿名选项
- ✅ **消息通知** - 订单状态变更、审核结果、系统通知

### 管理端（API）
- ✅ **在职证明审核** - 查看、通过、拒绝（附原因）
- ✅ **用户管理** - 用户列表、状态管理
- ✅ **路线和订单管理** - 全局查看和管理
- ✅ **文件上传** - 腾讯云 COS 集成

## 技术栈

**后端**:
- NestJS 10 + TypeScript
- MySQL 8.0（生产）/ SQLite（本地开发）
- TypeORM
- Redis 6.0（可选，降级为内存存储）
- JWT 认证
- 腾讯云 COS（文件存储）
- Swagger API 文档

**前端**:
- 微信小程序原生开发（TypeScript）
- 统一 API 请求封装（自动 Token 注入、错误处理）
- 现代化 UI 设计（卡片式布局、渐变背景）

## 快速开始

### 方式一：本地开发（SQLite 模式，无需 Docker）

```bash
# 1. 安装后端依赖
cd backend && npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，设置 DB_TYPE=sqlite

# 3. 启动后端服务
npm run start:dev
```

后端服务将运行在 `http://localhost:3000`
Swagger 文档：`http://localhost:3000/api/docs`

### 方式二：生产环境（MySQL + Redis）

```bash
cd backend

# 1. 启动数据库和 Redis
docker-compose up -d

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，设置 DB_TYPE=mysql，填写数据库连接信息

# 3. 运行数据库迁移
npm run migration:run

# 4. 启动服务
npm run start:dev
```

### 小程序前端启动

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具，选择「导入项目」
3. 目录选择 `miniprogram/`
4. 填写你的小程序 AppID
5. 修改 `miniprogram/app.ts` 中的 `apiBaseUrl` 为后端地址：
   ```typescript
   globalData: {
     apiBaseUrl: 'http://localhost:3000/api',  // 本地开发
     // apiBaseUrl: 'https://你的域名/api',    // 生产环境
   }
   ```

## 数据库表结构

| 表名 | 说明 |
|------|------|
| `user` | 用户表（昵称、头像、手机号） |
| `company` | 企业表（名称、简称） |
| `user_company` | 用户企业关联（在职证明、审核状态） |
| `route` | 路线表（起点、终点、时间、座位、价格） |
| `order` | 订单表（状态、金额、取消原因） |
| `review` | 评价表（评分、内容、匿名） |
| `notification` | 通知表（类型、内容、已读状态） |

## API 接口

| 模块 | 路径前缀 | 说明 |
|------|---------|------|
| 认证 | `/api/auth` | 微信登录、获取用户信息 |
| 用户 | `/api/user` | 用户资料管理 |
| 企业 | `/api/company` | 企业搜索、认证提交 |
| 管理 | `/api/admin` | 审核、用户管理 |
| 路线 | `/api/route` | 发布、列表、详情 |
| 订单 | `/api/order` | 创建、确认、取消、完成 |
| 评价 | `/api/review` | 提交、查询 |
| 通知 | `/api/notification` | 列表、已读标记 |
| 文件 | `/api/admin/certificate/upload` | 在职证明上传 |

完整文档：`http://localhost:3000/api/docs`

## 部署

### Docker 部署后端

```bash
cd backend
docker build -t carpool-backend .
docker run -d -p 3000:3000 --env-file .env --name carpool-backend carpool-backend
```

### 小程序发布

1. 在微信开发者工具中点击「上传」
2. 登录 [微信公众平台](https://mp.weixin.qq.com)
3. 进入「版本管理」→ 提交审核
4. 审核通过后点击「发布」

> **注意**: 小程序服务器域名必须是 `https` 且已 ICP 备案

## 开发进度

- [x] 后端项目骨架和核心模块
- [x] 数据库实体和迁移
- [x] 认证和企业审核模块
- [x] 路线和订单模块
- [x] 评价和通知模块
- [x] 文件上传（腾讯云 COS）
- [x] SQLite 本地开发支持
- [x] Redis 降级为内存存储
- [x] 小程序 10 个完整页面开发
- [x] 统一 API 请求封装
- [x] 全局样式和 UI 组件
- [ ] 后端生产环境部署
- [ ] 小程序提交审核
- [ ] 集成测试
- [ ] 性能优化

## 贡献

请查看 `.monkeycode/specs/carpool-platform/` 下的需求和设计文档。

## License

MIT
