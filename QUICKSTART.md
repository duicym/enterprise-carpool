# 快速开始指南

本指南帮助你快速启动和测试企业顺风车平台。

## 前置要求

### 必需
- Node.js 18+
- Docker & Docker Compose
- 微信开发者工具（用于小程序开发）

### 可选
- Git（代码版本管理）
- Postman（API 测试）

## 第一步：启动后端服务

### 1.1 进入后端目录

```bash
cd /workspace/backend
```

### 1.2 安装依赖

```bash
npm install
```

### 1.3 启动数据库和 Redis

```bash
docker-compose up -d
```

等待 30 秒让 MySQL 和 Redis 完全启动。

### 1.4 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，**必须配置以下变量**：

```env
# 微信小程序配置（必须）
WECHAT_APP_ID=你的小程序 AppID
WECHAT_APP_SECRET=你的小程序 AppSecret

# 数据库配置（Docker 环境默认值）
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=carpool

# Redis 配置（Docker 环境默认值）
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置（生产环境必须修改）
JWT_SECRET=your-random-secret-key-here
```

**重要**：
- `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET` 需要在 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序后获取
- 开发阶段可以暂时不填，但登录功能将无法使用

### 1.5 运行数据库迁移

```bash
npm run migration:run
```

如果提示找不到 TypeORM，需要先安装：

```bash
npx typeorm-ts-node-commonjs migration:run -d src/config/database.ts
```

### 1.6 启动开发服务器

```bash
npm run start:dev
```

服务启动后，访问：
- **后端 API**: http://localhost:3000/api
- **Swagger 文档**: http://localhost:3000/api/docs

## 第二步：开发小程序

### 2.1 打开微信开发者工具

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 启动微信开发者工具
3. 使用微信扫码登录

### 2.2 导入项目

1. 点击 "加号" 或 "导入项目"
2. 项目目录选择：`/workspace/miniprogram`
3. AppID 选择：
   - 测试账号：选择 "测试号"（功能受限）
   - 正式开发：填写你的小程序 AppID
4. 点击 "导入"

### 2.3 配置小程序

打开 `miniprogram/app.ts`，修改 `apiBaseUrl`：

```typescript
App({
  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: 'http://localhost:3000/api',  // 开发环境
    // apiBaseUrl: 'https://api.example.com/api',  // 生产环境
  },
  // ...
});
```

### 2.4 配置服务器域名

**重要**：小程序要求 HTTPS 域名

#### 开发阶段（临时方案）：

1. 在微信开发者工具中点击右上角 "详情"
2. 选择 "本地设置"
3. 勾选 "不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"

#### 生产环境（必须配置）：

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入 "开发" -> "开发管理" -> "开发设置"
3. 在 "服务器域名" 中添加：
   - request 合法域名：`https://your-api-domain.com`

### 2.5 编译和预览

1. 点击微信开发者工具的 "编译" 按钮
2. 查看模拟器中的效果
3. 点击 "预览" 在真机上测试

## 第三步：测试核心功能

### 3.1 用户登录

1. 小程序会自动跳转到登录页
2. 点击 "微信一键登录"
3. 授权后会自动创建用户

### 3.2 企业认证

1. 首次登录会自动跳转到企业认证页
2. 填写企业名称（必填）
3. 填写企业简称（选填）
4. 填写工号（选填）
5. 上传在职证明（必填）
   - 可以是工作证、工牌、在职证明等照片
6. 点击 "提交认证"

### 3.3 发布路线

1. 点击底部导航栏 "首页"
2. 点击右下角 "发布路线" 按钮
3. 填写路线信息：
   - 起点位置（点击选择，调用地图）
   - 终点位置（点击选择，调用地图）
   - 出发时间（选择时间）
   - 座位数量（点击 +/- 调整）
   - 单价（可选，单位：元/座）
   - 发车频率（工作日/每天/自定义）
   - 发布日期（选择日期）
4. 点击 "发布路线"

### 3.4 预约路线

1. 在首页浏览路线列表
2. 点击任意路线卡片查看详情
3. 点击 "预约座位"
4. 填写备注信息（可选）
5. 点击确认

### 3.5 订单管理

1. 点击底部导航栏 "订单"
2. 查看不同状态的订单：
   - 待确认：等待车主确认
   - 已确认：车主已确认
   - 已完成：行程已完成
3. 订单操作：
   - 乘客：可以取消订单
   - 车主：可以确认/完成订单

## 常见问题

### Q1: Docker 启动失败

**问题**: `docker-compose up -d` 报错

**解决**:
1. 确保 Docker Desktop 已启动
2. 检查端口是否被占用：`lsof -i :3306` 和 `lsof -i :6379`
3. 如有占用，修改 `docker-compose.yml` 中的端口映射

### Q2: 数据库迁移失败

**问题**: `npm run migration:run` 报错

**解决**:
```bash
# 手动运行迁移
npx typeorm-ts-node-commonjs migration:run -d src/config/database.ts

# 如果还是没有迁移文件，说明使用了 synchronize: true
# 开发环境会自动同步表结构
```

### Q3: 小程序网络请求失败

**问题**: 小程序提示 "网络错误"

**解决**:
1. 确保后端服务已启动
2. 检查 `app.ts` 中的 `apiBaseUrl` 配置
3. 在微信开发者工具中勾选 "不校验合法域名"
4. 查看微信开发者工具的 "调试器" -> "Console" 查看详细错误

### Q4: 微信登录失败

**问题**: 登录后报错 "微信配置缺失"

**解决**:
1. 检查后端 `.env` 文件中的 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET` 是否填写
2. 确保 AppID 和 AppSecret 匹配
3. 测试阶段可以暂时跳过登录，直接修改代码模拟登录态

### Q5: 找不到模块或文件

**问题**: 运行时报错 `Cannot find module`

**解决**:
```bash
# 重新安装依赖
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 下一步

### 继续开发

1. 查看 `.monkeycode/specs/carpool-platform/tasklist.md` 了解待完成任务
2. 开发更多小程序页面（消息中心、设置页面等）
3. 实现 OSS 对象存储上传
4. 添加微信模板消息通知

### 性能优化

1. 实现 Redis 缓存策略
2. 数据库查询优化（索引、分页）
3. 图片 CDN 加速

### 测试和部署

1. 编写单元测试
2. 集成测试
3. 压力测试
4. 生产环境部署

## 开发工具推荐

- **API 测试**: Postman / ApiFox
- **数据库管理**: Navicat / MySQL Workbench / DBeaver
- **Redis 管理**: Redis Desktop Manager / Another Redis Desktop Manager
- **代码编辑**: VS Code / WebStorm

## 相关文档

- [项目 README](../README.md)
- [需求文档](../.monkeycode/specs/carpool-platform/requirements.md)
- [设计文档](../.monkeycode/specs/carpool-platform/design.md)
- [开发总结](../DEVELOPMENT_SUMMARY.md)
