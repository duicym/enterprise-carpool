# Requirements Document

## Introduction

企业顺风车平台是一个面向公众的微信小程序拼车服务系统，允许企业名称相同的用户视为同一公司成员，实现跨企业但同名称的通勤拼车。用户自行入驻并提交在职证明进行审核。系统旨在减少通勤成本、缓解交通压力、促进同事间交流。

## Glossary

- **车主 (Driver)**: 有富余座位并愿意搭载其他同事的员工
- **乘客 (Passenger)**: 需要搭乘顺风车的员工
- **路线 (Route)**: 车主定义的从起点到终点的行驶路径
- **订单 (Order)**: 乘客预约车主座位的请求
- **评价 (Rating)**: 用户对行程体验的反馈评分
- **企业 (Company)**: 企业名称相同的用户群体，用户自行入驻时填写
- **在职证明 (Employment Certificate)**: 用于验证用户确实属于所填写企业的证明材料

## Requirements

### Requirement 1: 用户注册与认证

**User Story:** AS 用户，I want 通过微信小程序授权登录并提交企业信息，so that 获得平台访问权限

#### Acceptance Criteria

1. WHEN 用户首次访问小程序时，系统 SHALL 引导用户进行微信授权登录
2. WHEN 用户完成微信登录后，系统 SHALL 要求填写企业名称并上传在职证明
3. WHILE 用户在职证明审核中时，系统 SHALL 限制其发布路线和预约功能
4. IF 在职证明审核通过，系统 SHALL 激活用户账号并允许使用全部功能
5. IF 在职证明审核拒绝，系统 SHALL 通知用户并允许重新提交

### Requirement 2: 车主发布路线

**User Story:** AS 车主，I want 发布我的通勤路线和可用座位，so that 告知有需求的同事

#### Acceptance Criteria

1. WHEN 车主点击"发布路线"时，系统 SHALL 提供路线信息填写表单
2. WHERE 路线表单包含起点、终点、出发时间、可用座位数、价格信息时，系统 SHALL 保存并发布路线
3. WHILE 路线处于有效期内时，系统 SHALL 在路线列表中展示该路线
4. WHEN 车主修改路线信息时，系统 SHALL 更新路线并通知已预约的乘客

### Requirement 3: 乘客搜索路线

**User Story:** AS 乘客，I want 搜索符合我的通勤路线，so that 找到合适的顺风车

#### Acceptance Criteria

1. WHEN 乘客输入起点和终点时，系统 SHALL 显示匹配的路线列表
2. WHEN 乘客设置出发时间范围时，系统 SHALL 筛选符合时间要求的路线
3. WHILE 路线列表展示时，系统 SHALL 显示车主信息、路线详情、剩余座位和评价
4. WHEN 乘客点击路线详情时，系统 SHALL 展示完整的路线信息和车主联系方式

### Requirement 4: 预约与确认

**User Story:** AS 乘客，I want 预约车主的座位，so that 确保有位置搭乘

#### Acceptance Criteria

1. WHEN 乘客点击"预约"时，系统 SHALL 创建预约请求并发送给车主
2. WHEN 车主收到预约请求时，系统 SHALL 通知车主并等待确认
3. IF 车主确认预约，系统 SHALL 锁定座位并向乘客发送确认通知
4. IF 车主拒绝预约或座位已满，系统 SHALL 通知乘客并释放座位

### Requirement 5: 行程管理

**User Story:** AS 用户，I want 查看和管理我的行程，so that 了解行程状态

#### Acceptance Criteria

1. WHILE 用户已登录时，系统 SHALL 提供"我的行程"页面
2. WHEN 行程开始前，系统 SHALL 允许乘客取消预约
3. WHEN 行程完成后，系统 SHALL 提示双方进行评价
4. IF 乘客未按时乘车，系统 SHALL 记录爽约并通知车主

### Requirement 6: 评价系统

**User Story:** AS 用户，I want 对行程进行评价，so that 帮助其他用户了解服务质量

#### Acceptance Criteria

1. WHEN 行程状态为"已完成"时，系统 SHALL 开放评价功能
2. WHERE 评价包含星级评分和文字评论时，系统 SHALL 保存并展示评价
3. WHILE 用户查看车主/乘客资料时，系统 SHALL 显示平均评分和历史评价
4. IF 评价包含不当内容，系统 SHALL 支持举报并隐藏待审核

### Requirement 7: 消息通知

**User Story:** AS 用户，I want 及时收到行程相关通知，so that 不错过重要信息

#### Acceptance Criteria

1. WHEN 预约状态变更时，系统 SHALL 向用户发送通知
2. WHEN 行程即将开始时，系统 SHALL 提前提醒双方
3. WHILE 用户有新消息时，系统 SHALL 在界面显示未读标记
4. WHERE 通知支持应用内消息时，系统 SHALL 提供消息中心页面

### Requirement 10: 安全与合规

**User Story:** AS 平台运营者，I want 支持多企业用户和云端部署，so that 服务 1000 人规模的公众用户

#### Acceptance Criteria

1. WHERE 系统部署在云端时，系统 SHALL 支持弹性扩展以应对 1000 人规模
2. WHEN 用户填写企业名称时，系统 SHALL 自动匹配或创建企业群组
3. WHILE 用户搜索路线时，系统 SHALL 优先展示同企业路线，同时展示跨企业路线
4. WHERE 系统为微信小程序时，系统 SHALL 符合微信小程序审核规范

**User Story:** AS 管理员，I want 确保平台安全合规运营，so that 保护用户权益

#### Acceptance Criteria

1. IF 用户被多次投诉或评价过低时，系统 SHALL 暂停其账户并通知管理员
2. WHEN 用户注册时，系统 SHALL 要求同意服务条款和隐私政策
3. WHILE 路线发布时，系统 SHALL 验证起终点为企业相关地点
4. IF 检测到异常行为时，系统 SHALL 触发安全审核流程
5. WHEN 用户上传在职证明时，系统 SHALL 进行人工或自动审核
6. IF 企业名称相同但域名不同时，系统 SHALL 允许用户加入该企业群组

### Requirement 11: 多企业支持和云端部署

**User Story:** AS 平台运营者，I want 支持多企业用户和云端部署，so that 服务 1000 人规模的公众用户

#### Acceptance Criteria

1. WHERE 系统部署在云端时，系统 SHALL 支持弹性扩展以应对 1000 人规模
2. WHEN 用户填写企业名称时，系统 SHALL 自动匹配或创建企业群组
3. WHILE 用户搜索路线时，系统 SHALL 优先展示同企业路线，同时展示跨企业路线
4. WHERE 系统为微信小程序时，系统 SHALL 符合微信小程序审核规范
