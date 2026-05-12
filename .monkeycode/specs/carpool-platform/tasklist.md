# 企业顺风车平台实施计划

- [ ] 1. 初始化项目结构和基础配置
  - [ ] 1.1 创建后端项目骨架 (NestJS + TypeScript)
    - 使用 NestJS CLI 创建项目
    - 配置 TypeScript (tsconfig.json)
    - 配置 ESLint 和 Prettier
    - 配置路径别名 (@src, @modules, @common)
  
  - [ ] 1.2 创建微信小程序项目骨架
    - 使用微信开发者工具初始化项目
    - 配置 TypeScript (tsconfig.json)
    - 安装 Vant Weapp 组件库
    - 配置 Mobx-miniprogram 状态管理
    - 配置腾讯地图 SDK
  
  - [ ] 1.3 配置 Docker 开发环境
    - 编写 docker-compose.yml (MySQL, Redis)
    - 编写后端 Dockerfile
    - 配置环境变量模板 (.env.example)
  
  - [ ]* 1.4 配置 CI/CD 流程
    - 编写 GitHub Actions 工作流
    - 配置自动测试和构建

- [ ] 2. 实现数据库层
  - [ ] 2.1 配置 TypeORM 数据库连接
    - 安装 TypeORM 和 MySQL 驱动
    - 配置数据库连接模块
    - 实现连接池配置
    - 配置数据库迁移工具
  
  - [ ] 2.2 创建数据库迁移文件
    - 创建 user 表迁移
    - 创建 company 表迁移
    - 创建 user_company 表迁移
    - 创建 route 表迁移
    - 创建 order 表迁移
    - 创建 review 表迁移
    - 创建 notification 表迁移
    - 创建所有索引
  
  - [ ] 2.3 实现数据实体类
    - User 实体 (user.ts)
    - Company 实体 (company.ts)
    - UserCompany 实体 (user-company.ts)
    - Route 实体 (route.ts)
    - Order 实体 (order.ts)
    - Review 实体 (review.ts)
    - Notification 实体 (notification.ts)
  
  - [ ]* 2.4 为数据库迁移编写测试
    - 测试迁移可正确执行
    - 测试回滚功能

- [ ] 3. 实现核心业务模块
  - [ ] 3.1 实现认证模块 (Auth Module)
    - [ ] 3.1.1 创建认证服务
      - 实现微信登录 (code 换取 openid)
      - 实现 JWT token 生成和验证
      - 实现 token 刷新机制
      - 实现登出功能
    
    - [ ] 3.1.2 创建认证守卫
      - 实现 JWT 守卫 (JwtAuthGuard)
      - 实现角色守卫 (RolesGuard)
      - 实现审核状态守卫 (AuditStatusGuard)
    
    - [ ] 3.1.3 创建认证控制器
      - POST /api/auth/wechat-login
      - POST /api/auth/logout
      - GET /api/auth/profile
  
  - [ ] 3.2 实现用户模块 (User Module)
    - [ ] 3.2.1 创建用户服务
      - 实现用户创建和查询
      - 实现用户信息更新
      - 实现用户企业关系查询
    
    - [ ] 3.2.2 创建用户数据传输对象 (DTO)
      - CreateUserDto
      - UpdateUserDto
      - UserProfileDto
    
    - [ ] 3.2.3 创建用户控制器
      - GET /api/user/profile
      - PUT /api/user/profile
      - GET /api/user/companies
  
  - [ ] 3.3 实现企业模块 (Company Module)
    - [ ] 3.3.1 创建企业服务
      - 实现企业搜索 (按名称模糊匹配)
      - 实现企业创建或查找
      - 实现企业成员列表查询
      - 实现企业详情查询
    
    - [ ] 3.3.2 创建企业数据传输对象
      - SearchCompanyDto
      - CompanyDetailDto
      - CompanyMemberDto
    
    - [ ] 3.3.3 创建企业控制器
      - GET /api/company/search
      - POST /api/company/submit
      - GET /api/company/detail/:id
      - GET /api/company/members/:id
  
  - [ ] 3.4 实现审核管理模块 (Admin Module)
    - [ ] 3.4.1 创建在职证明上传服务
      - 实现 OSS 上传配置
      - 实现图片水印添加
      - 实现文件类型验证
    
    - [ ] 3.4.2 创建审核服务
      - 实现待审核列表查询
      - 实现审核通过/拒绝操作
      - 实现审核通知发送
    
    - [ ] 3.4.3 创建审核控制器
      - POST /api/admin/certificate/upload
      - GET /api/admin/certificates
      - PUT /api/admin/certificate/:id
      - GET /api/admin/users
      - PUT /api/admin/user/:id/status

- [ ] 4. 检查点 - 确保认证和企业审核流程正常工作
  - 确保所有测试通过，如有疑问请询问用户

- [ ] 5. 实现路线模块 (Route Module)
  - [ ] 5.1 创建路线服务
    - 实现路线发布 (带坐标验证)
    - 实现路线搜索 (起点、终点、时间筛选)
    - 实现路线更新和删除
    - 实现座位数管理 (并发控制)
    - 实现路线列表分页查询
  
  - [ ] 5.2 创建路线数据传输对象
    - CreateRouteDto (含坐标验证)
    - UpdateRouteDto
    - RouteListQueryDto
    - RouteDetailDto
  
  - [ ] 5.3 创建路线控制器
    - POST /api/route
    - PUT /api/route/:id
    - DELETE /api/route/:id
    - GET /api/route/list
    - GET /api/route/:id
    - GET /api/route/my
  
  - [ ] 5.4 实现 Redis 缓存
    - 缓存热门路线列表
    - 实现缓存失效策略
    - 实现分布式锁 (防止座位超卖)
  
  - [ ]* 5.5 为路线服务编写单元测试
    - 测试路线发布验证逻辑
    - 测试座位并发扣减
    - 测试搜索筛选逻辑

- [ ] 6. 实现订单模块 (Order Module)
  - [ ] 6.1 创建订单服务
    - 实现订单创建 (事务处理)
    - 实现订单确认/拒绝
    - 实现订单取消 (带原因记录)
    - 实现订单完成确认
    - 实现爽约处理
    - 实现订单状态流转验证
  
  - [ ] 6.2 创建订单数据传输对象
    - CreateOrderDto
    - ConfirmOrderDto
    - CancelOrderDto
    - OrderDetailDto
    - OrderListQueryDto
  
  - [ ] 6.3 创建订单控制器
    - POST /api/order
    - PUT /api/order/:id/confirm
    - PUT /api/order/:id/cancel
    - PUT /api/order/:id/complete
    - GET /api/order/list
    - GET /api/order/:id
    - GET /api/order/my
  
  - [ ] 6.4 实现订单事务处理
    - 使用数据库事务保证原子性
    - 实现座位锁定和释放
    - 实现并发订单处理
  
  - [ ]* 6.5 为订单服务编写单元测试
    - 测试订单状态流转
    - 测试事务回滚
    - 测试并发预约场景

- [ ] 7. 实现评价模块 (Review Module)
  - [ ] 7.1 创建评价服务
    - 实现评价创建 (验证订单完成状态)
    - 实现评价回复
    - 实现评价列表查询
    - 实现用户评分统计
    - 实现评价举报处理
  
  - [ ] 7.2 创建评价数据传输对象
    - CreateReviewDto
    - ReplyReviewDto
    - ReviewListQueryDto
    - ReviewStatsDto
  
  - [ ] 7.3 创建评价控制器
    - POST /api/review
    - PUT /api/review/:id/reply
    - GET /api/review/list
    - GET /api/review/user/:id
    - POST /api/review/:id/report
  
  - [ ]* 7.4 为评价服务编写单元测试
    - 测试评价创建验证
    - 测试评分统计计算

- [ ] 8. 检查点 - 确保核心业务流程正常
  - 确保所有测试通过，如有疑问请询问用户

- [ ] 9. 实现通知模块 (Notification Module)
  - [ ] 9.1 创建通知服务
    - 实现应用内通知创建
    - 实现通知列表查询
    - 实现通知标记已读
    - 实现模板消息推送 (微信小程序)
  
  - [ ] 9.2 创建通知数据传输对象
    - CreateNotificationDto
    - NotificationListDto
    - NotificationStatsDto
  
  - [ ] 9.3 创建通知控制器
    - GET /api/notification/list
    - PUT /api/notification/:id/read
    - PUT /api/notification/read-all
  
  - [ ] 9.4 实现通知事件订阅
    - 订阅订单状态变更事件
    - 订阅审核结果事件
    - 订阅评价通知事件

- [ ] 10. 实现通用功能
  - [ ] 10.1 创建错误处理中间件
    - 实现全局异常过滤器
    - 实现错误码规范 (ErrorCode 枚举)
    - 实现统一错误响应格式
  
  - [ ] 10.2 创建日志模块
    - 配置 Winston 日志
    - 实现请求日志记录
    - 实现错误日志记录
    - 配置日志级别和输出
  
  - [ ] 10.3 创建验证管道
    - 配置 class-validator
    - 实现 DTO 自动验证
    - 实现自定义验证装饰器
  
  - [ ] 10.4 创建工具函数库
    - 订单号生成工具
    - 坐标距离计算工具
    - 时间格式化工具
    - 图片处理工具

- [ ] 11. 实现微信小程序前端
  - [ ] 11.1 搭建小程序基础架构
    - 配置 app.ts 全局状态
    - 实现用户状态管理 (Mobx)
    - 配置 HTTP 请求拦截器
    - 实现路由跳转封装
  
  - [ ] 11.2 实现登录和企业认证页面
    - 登录页面 (微信授权)
    - 企业信息填写页面
    - 在职证明上传页面
    - 审核状态等待页面
  
  - [ ] 11.3 实现首页和路线列表
    - 首页布局 (搜索框、快捷入口)
    - 路线列表页面 (筛选、分页)
    - 路线详情页面
    - 地图选点组件
  
  - [ ] 11.4 实现路线发布页面
    - 路线表单组件
    - 地图选点和坐标获取
    - 时间选择组件
    - 座位和价格设置
  
  - [ ] 11.5 实现订单管理页面
    - 订单列表页面 (状态筛选)
    - 订单详情页面
    - 订单确认/取消操作
    - 订单状态流转展示
  
  - [ ] 11.6 实现评价页面
    - 评价提交页面
    - 评价列表页面
    - 用户评分展示
  
  - [ ] 11.7 实现消息中心页面
    - 通知列表页面
    - 通知详情页面
    - 未读标记管理
  
  - [ ] 11.8 实现个人中心页面
    - 个人信息展示
    - 我的企业信息
    - 设置页面
    - 关于我们和客服

- [ ] 12. 检查点 - 确保前后端联调正常
  - 确保所有测试通过，如有疑问请询问用户

- [ ] 13. 实现安全加固
  - [ ] 13.1 实现 JWT token 安全
    - 配置 token 过期时间
    - 实现 token 刷新机制
    - 实现 token 黑名单
  
  - [ ] 13.2 实现敏感操作验证
    - 取消订单二次验证
    - 删除路线二次验证
    - 提现操作验证
  
  - [ ] 13.3 实现数据脱敏
    - 手机号脱敏显示
    - 身份证信息脱敏
    - 在职证明访问控制
  
  - [ ] 13.4 实现防刷机制
    - API 限流 (rate limiting)
    - 短信验证码防刷
    - 恶意行为检测

- [ ] 14. 实现监控和部署
  - [ ] 14.1 配置监控指标
    - 配置 Prometheus 指标收集
    - 配置 Grafana 仪表盘
    - 配置慢查询日志
  
  - [ ] 14.2 配置告警规则
    - 错误率告警
    - 响应时间告警
    - 资源使用率告警
  
  - [ ] 14.3 编写部署脚本
    - 编写 Kubernetes 部署文件
    - 编写数据库迁移脚本
    - 编写回滚脚本

- [ ]* 15. 编写测试和文档
  - [ ]* 15.1 编写 API 文档
    - 使用 Swagger/OpenAPI
    - 编写接口使用示例
  
  - [ ]* 15.2 编写单元测试
    - 补充各模块单元测试
    - 确保覆盖率达标
  
  - [ ]* 15.3 编写集成测试
    - 核心流程端到端测试
    - 数据库事务测试
  
  - [ ]* 15.4 编写性能测试
    - 并发预约场景压测
    - 接口性能基准测试
  
  - [ ]* 15.5 编写部署文档
    - 部署步骤说明
    - 环境配置说明
    - 常见问题 FAQ
