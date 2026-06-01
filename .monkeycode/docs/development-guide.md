# 开发指南

## 环境准备

### 系统要求

- Node.js >= 18.x
- npm >= 9.x
- MySQL 8.0+ (生产) 或 SQLite 3.x (开发)
- Redis 6.0+ (可选)
- 微信开发者工具

### 开发环境配置

#### 1. 克隆项目

```bash
git clone https://github.com/duicym/ceng-carpool.git
cd ceng-carpool
```

#### 2. 安装后端依赖

```bash
cd backend
npm install
```

#### 3. 配置环境变量

创建 `.env` 文件:

```bash
cp .env.example .env
```

编辑 `.env`:

```env
# 数据库配置 (开发模式使用 SQLite)
DB_TYPE=sqlite
DB_DATABASE=./data/carpool.db

# 数据库配置 (生产模式使用 MySQL)
# DB_TYPE=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=your_password
# DB_DATABASE=ceng_carpool

# Redis 配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=7d

# 微信配置
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret

# 文件存储 (腾讯云 COS)
COS_BUCKET=your-bucket
COS_REGION=ap-guangzhou
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key

# 服务配置
PORT=3000
API_PREFIX=/api
```

#### 4. 运行数据库迁移

```bash
npm run migration:run
```

#### 5. 启动开发服务器

```bash
npm run start:dev
```

后端服务将运行在 `http://localhost:3000`

Swagger API 文档：`http://localhost:3000/api/docs`

## 前端开发

#### 1. 打开微信开发者工具

- 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 打开工具，选择「导入项目」
- 目录选择 `miniprogram/`
- 填写你的小程序 AppID (测试可使用测试号)

#### 2. 配置后端地址

编辑 `miniprogram/app.ts`:

```typescript
globalData: {
  apiBaseUrl: 'http://localhost:3000/api',  // 本地开发
  // apiBaseUrl: 'https://your-domain/api',  // 生产环境
}
```

## 编码规范

### TypeScript 规范

- 使用 ES6+ 语法
- 优先使用 `const`, 需要重新赋值时使用 `let`
- 避免使用 `var`
- 使用箭头函数
- 接口和类型使用 PascalCase 命名
- 变量和函数使用 camelCase 命名
- 常量使用 UPPER_SNAKE_CASE 命名

### NestJS 规范

- 模块按业务功能划分
- Controller 只处理 HTTP 请求，不包含业务逻辑
- Service 包含所有业务逻辑
- 使用 DTO 进行参数验证
- 使用 TypeORM 的 Entity 定义数据模型
- 使用装饰器进行权限控制和参数校验

### Git 提交规范

```bash
# 格式
<type>(<scope>): <subject>

# type 类型
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链相关

# 示例
feat(circle): 创建圈子模块
fix(booking): 修复预约并发问题
docs(wiki): 更新架构文档
```

### 分支管理

```bash
# 主分支
main

# 功能分支
feat/xxx-xxx

# 修复分支
fix/xxx-xxx

# 发布分支
release/v1.0.0
```

## 测试

### 单元测试

```bash
# 运行所有测试
npm run test

# 监视模式
npm run test:watch

# 覆盖率
npm run test:cov
```

### E2E 测试

```bash
npm run test:e2e
```

## 调试

### 断点调试

1. 在 VSCode 中打开 `Run and Debug`
2. 选择 `Nest Debug` 配置
3. 按 F5 启动调试

### 日志调试

```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('CircleService');
logger.log('创建圈子', circle.name);
logger.error('创建失败', error);
logger.warn('成员已满', circle.id);
```

## 常见问题

### Q: SQLite 数据库文件在哪里？

A: 默认在 `./data/carpool.db`,可以在 `.env` 中修改。

### Q: 如何重置数据库？

A: 删除 SQLite 数据库文件，然后运行 `npm run migration:run`。

### Q: 微信小程序无法连接本地后端？

A: 在开发者工具中勾选「不校验合法域名」。

### Q: 如何查看 SQL 执行日志？

A: 在 `.env` 中设置 `DB_LOGGING=true`。

## 下一步

完成本地开发后，请查看 [部署指南](./deployment.md) 进行生产环境部署。
