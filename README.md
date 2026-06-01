<p align="center">
  <h1 align="center">🚗 蹭蹭车 (Ceng-Carpool)</h1>
  <p align="center">
    熟人社交互助出行平台
  </p>
  <p align="center">
    打破冰冷通勤，让每一次出行都更温暖、更可信！🌟
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-WeChat-07C160?logo=wechat&logoColor=white" alt="Platform">
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white" alt="Backend">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="Database">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="README_en.md"><strong>English</strong></a> · 
  <strong>简体中文</strong>
</p>

---

## 📖 产品定位

**蹭蹭车** 是一款专为企业员工、封闭社区、高校校友等私域熟人圈子打造的互助拼车微信小程序。我们不盲目追求大而全的商业网约车模式，而是深耕 **"高信任、低成本、零营运风险"** 的熟人社交出行生态。

> 💡 不同于滴滴的商业化网约车，蹭蹭车聚焦于**熟人圈子的互助出行**，让同事、邻居、校友之间的每一次搭乘都更温暖、更可信。

### 🎯 核心场景

| 场景 | 描述 | 典型案例 |
|------|------|----------|
| 🏢 **企业通勤** | 同事之间顺路上下班拼车 | "张工每天从科技园到公司，可以带 2 个同事" |
| 🎉 **团建出行** | 团队活动智能分配车辆 | "15 人去团建，5 个车主提供座位，剩余 2 人建议打车" |
| 🏘️ **社群蹭车** | 小区邻居、校友等熟人圈子 | "XX 小区到地铁口的拼车群，早高峰互助出行" |

---

## ✨ 核心亮点一览

### 🤝 无圈子，不拼车

独创 **"圈主管理 + 成员审核"** 机制，看得到的行程都在熟人圈内，天然过滤安全隐患！

- ✅ 只有圈子成员才能看到和发布行程
- ✅ 圈主和管理员审核新成员加入
- ✅ 信用分 + 评价双保险，让靠谱的人更受欢迎

### 🧠 团建排车神器

**行政的绝对福音！** 输入目的地、车主与座位数，系统自动计算最优派车方案与座位组合。

- ✅ 智能分配算法：优先同部门、上车地点相近
- ✅ 自动输出剩余人员打车建议（按 4 人/车计算）
- ✅ 一键查看分配结果，联系对应车主

### 💰 灵活费用红线

支持**免费互助**、**路桥费 AA 分摊**、**微利付费**，严格限制定价天花板，合法合规。

| 模式 | 适用场景 | 费用计算 |
|------|----------|----------|
| 🆓 免费互助 | 同事人情、邻里互助 | 0 元 |
| 🧮 AA 分摊 | 长途出行、过路费分摊 | 油费 + 过路费 ÷ 乘车人数 |
| 💵 付费搭乘 | 固定通勤路线、微利运营 | 车主自定义（平台限制上限） |

### ⚡ 极简技术架构

后端采用轻量高性能的 **NestJS**，前端搭配**原生微信小程序**，支持 SQLite/MySQL 灵活切换，一键脚本秒速部署！

---

## 🛠️ 技术栈与特性

### 技术栈

**后端**

[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-07405E?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Redis](https://img.shields.io/badge/Redis-6-DC382D?logo=redis&logoColor=white)](https://redis.io/)

**前端**

[![WeChat](https://img.shields.io/badge/WeChat_MiniProgram-Latest-07C160?logo=wechat&logoColor=white)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**工具与服务**

- 🔐 JWT 认证
- 📄 Swagger API 文档
- ☁️ 腾讯云 COS 文件存储
- 🐳 Docker 容器化部署

### 核心特性

#### 🛡️ 安全守卫
- JWT 认证 + 圈子审核，筑起安全高墙
- 行程仅圈子内可见，外部无法访问
- 信用分体系 + 双向评价，建立信任机制

#### 📊 数据透明
- 自带 Swagger API 交互文档
- 8 个核心数据表完整定义
- 架构清晰，二次开发极度丝滑

#### 📦 开箱即用
- 提供 `start.sh` 启动脚本
- SQLite 开发模式，无需安装数据库
- 研发成本直接归零！

---

## 🚀 快速开始

### 方式一：本地开发（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd ceng-carpool

# 2. 启动后端（SQLite 模式，无需 Docker）
cd backend
npm install
cp .env.example .env  # 设置 DB_TYPE=sqlite
npm run start:dev

# 3. 小程序前端
# 使用微信开发者工具打开 miniprogram/ 目录
# 修改 app.ts 中的 apiBaseUrl 为 http://localhost:3000/api
```

访问后端 Swagger 文档：http://localhost:3000/api/docs

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

详细部署说明请查看 [QUICKSTART.md](QUICKSTART.md)

---

## 📁 项目结构

```
ceng-carpool/
├── backend/                  # NestJS 后端服务
│   ├── src/
│   │   ├── modules/         # 业务模块
│   │   │   ├── auth/        # 微信登录认证
│   │   │   ├── user/        # 用户管理
│   │   │   ├── circle/      # 圈子管理 ⭐
│   │   │   ├── trip/        # 行程管理 ⭐
│   │   │   ├── booking/     # 预约管理 ⭐
│   │   │   ├── event/       # 团建活动 ⭐
│   │   │   └── ...
│   │   ├── guards/          # JWT 认证守卫
│   │   └── common/          # 全局过滤器
│   └── package.json
├── miniprogram/              # 微信小程序前端
│   ├── pages/               # 页面
│   ├── utils/               # 工具函数
│   └── app.ts               # 全局配置
├── .monkeycode/             # 项目文档
│   ├── docs/                # Wiki 文档
│   └── specs/               # 需求规格
├── start.sh                 # 一键启动脚本
└── README.md
```

---

## 📊 数据模型

| 表名 | 说明 | 核心字段 |
|------|------|----------|
| `user` | 用户表 | openid, nickname, credit_score |
| `circle` | 圈子表 | name, type, owner_id, member_count |
| `circle_member` | 圈子成员 | circle_id, user_id, role, status |
| `trip` | 行程表 | driver_id, start/end, seats, fee_mode |
| `booking` | 预约表 | trip_id, passenger_id, status, fee_amount |
| `event` | 活动表 | title, location, start_time, allocation_status |
| `event_participant` | 活动参与者 | event_id, user_id, role, seats_offered |

---

## 🔗 API 接口

| 模块 | 路径前缀 | 核心接口 |
|------|---------|----------|
| 认证 | `/api/auth` | 微信登录、用户信息 |
| 圈子 | `/api/circle` | 创建/加入/管理圈子、成员管理 |
| 行程 | `/api/trip` | 发布行程、搜索筛选、座位管理 |
| 预约 | `/api/booking` | 创建预约、确认/取消、完成行程 |
| 活动 | `/api/event` | 创建活动、报名、**智能分配车辆** |

完整 API 文档：http://localhost:3000/api/docs

---

## 📚 文档导航

### Wiki 文档
- [📖 Wiki 首页](.monkeycode/docs/wiki.md) - 文档导航
- [🏗️ 项目架构](.monkeycode/docs/architecture.md) - 技术架构和模块设计
- [📊 数据模型](.monkeycode/docs/data-model.md) - 数据库表结构说明
- [🛠️ 开发指南](.monkeycode/docs/development-guide.md) - 本地开发和编码规范

### 产品文档
- [📋 需求规格](.monkeycode/specs/ceng-carpool/requirements.md) - 产品功能需求
- [⚙️ 技术设计](.monkeycode/specs/ceng-carpool/design.md) - 详细技术方案

### 其他文档
- [🚀 快速开始](QUICKSTART.md) - 详细的安装和部署说明
- [🤝 贡献指南](CONTRIBUTING.md) - 如何参与项目开发
- [📜 行为准则](CODE_OF_CONDUCT.md) - 社区行为准则
- [📝 更新日志](CHANGELOG.md) - 版本更新记录

---

## 🤝 贡献

欢迎参与项目开发！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

请查看 [贡献指南](CONTRIBUTING.md) 了解详细说明。

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<p align="center">
  🌟 用代码连接信任，用技术温暖通勤
</p>

<p align="center">
  如果这个项目对你有启发，欢迎点个 <strong>Star</strong> 支持一下！😉
</p>

<p align="center">
  Made with ❤️ by 蹭蹭车团队
</p>
