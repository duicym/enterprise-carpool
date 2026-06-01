# API 接口参考

## 基础信息

- **API 基础路径**: `/api/v1`
- **认证方式**: JWT Token
- **响应格式**: JSON

## 接口列表

### 认证模块

| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth/wechat-login` | POST | 微信登录 |
| `/auth/profile` | GET | 获取用户信息 |
| `/auth/logout` | POST | 登出 |

### 圈子模块

| 接口 | 方法 | 说明 |
|------|------|------|
| `/circle` | POST | 创建圈子 |
| `/circle/my` | GET | 我的圈子 |
| `/circle/:id` | GET | 圈子详情 |
| `/circle/:id/join` | POST | 加入圈子 |
| `/circle/:id/members` | GET | 成员列表 |

### 行程模块

| 接口 | 方法 | 说明 |
|------|------|------|
| `/trip/:circleId` | POST | 发布行程 |
| `/trip/circle/:circleId` | GET | 圈子行程列表 |
| `/trip/:id` | GET | 行程详情 |
| `/trip/:id/cancel` | POST | 取消行程 |

### 预约模块

| 接口 | 方法 | 说明 |
|------|------|------|
| `/booking/:tripId` | POST | 创建预约 |
| `/booking/my` | GET | 我的预约 |
| `/booking/:id` | GET | 预约详情 |
| `/booking/:id/confirm` | POST | 确认预约 |

### 活动模块

| 接口 | 方法 | 说明 |
|------|------|------|
| `/event/:circleId` | POST | 创建活动 |
| `/event/:id` | GET | 活动详情 |
| `/event/:id/join` | POST | 报名活动 |
| `/event/:id/allocate` | POST | 智能分配车辆 |

详细接口文档请参考 Swagger UI `/api/swagger`
