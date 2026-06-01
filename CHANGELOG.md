# 更新日志

本项目遵循 [语义化版本规范](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增
- 完整的小程序 10 个页面（登录、企业认证、首页、路线发布、路线详情、订单、订单详情、个人中心、消息通知、评价）
- 统一 API 请求封装（自动 Token 注入、错误处理、loading 状态）
- SQLite 本地开发模式支持
- Redis 降级为内存存储（无 Redis 环境时可正常运行）
- Swagger API 文档自动生成

### 修复
- 修复 TypeORM 实体唯一约束定义问题
- 修复模块依赖注入问题（AdminModule、OssModule）
- 修复全局异常过滤器类型问题

## [0.0.1] - 2026-05-09

### 新增
- NestJS 后端项目骨架
- 9 个业务模块（Auth、User、Company、Admin、OSS、Route、Order、Review、Notification）
- JWT 微信登录认证
- 企业认证系统（在职证明上传、审核）
- 路线发布与搜索
- 订单管理（创建、确认、取消、完成）
- 双向评价系统
- 消息通知系统
- 腾讯云 COS 文件上传
- 微信小程序前端骨架
- Docker Compose 开发环境配置

[Unreleased]: https://github.com/duicym/ceng-carpool/compare/0.0.1...HEAD
[0.0.1]: https://github.com/duicym/ceng-carpool/releases/tag/0.0.1
