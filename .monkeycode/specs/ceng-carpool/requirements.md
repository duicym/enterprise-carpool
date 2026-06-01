# Requirements Document

## Introduction

蹭蹭车是一个基于熟人社交的蹭车平台微信小程序，支持企业内上下班拼车、团建出行车辆分配、社群（小区/校友）蹭车等多种场景。系统采用圈子机制，用户加入或创建自己的蹭车圈子，在圈子内发布行程、分享座位。支持免费互助、AA 制分摊、付费搭乘三种费用模式。

## Glossary

- **圈子 (Circle)**: 用户自发组织的蹭车群体，如"XX 公司通勤群"、"XX 小区邻居群"、"XX 校友会"
- **圈主 (Circle Owner)**: 创建并管理圈子的人，负责审核成员、维护秩序
- **成员 (Member)**: 加入圈子的用户，可发布行程或预约座位
- **车主 (Driver)**: 提供座位的成員
- **乘客 (Passenger)**: 需要搭乘的成员
- **行程 (Trip)**: 成员发布的从起点到终点的行驶路线
- **预约 (Booking)**: 乘客预约车主座位的请求
- **团建活动 (Team Event)**: 组织性活动，需要智能分配车辆
- **评价 (Rating)**: 用户对行程体验的反馈评分

## Requirements

### Requirement 1: 用户注册与登录

**User Story:** AS 用户，I want 通过微信一键登录，so that 快速开始使用

#### Acceptance Criteria

1. WHEN 用户首次访问小程序时，系统 SHALL 引导用户进行微信授权登录
2. WHEN 用户完成微信登录后，系统 SHALL 创建用户账号
3. WHEN 用户登录成功后，系统 SHALL 引导用户加入或创建圈子
4. IF 用户未加入任何圈子，系统 SHALL 限制其发布和预约功能

### Requirement 2: 圈子管理

**User Story:** AS 用户，I want 创建或加入蹭车圈子，so that 在熟人圈内分享座位

#### Acceptance Criteria

1. WHEN 用户创建圈子时，系统 SHALL 要求填写圈子名称、类型、简介
2. WHERE 圈子类型包含企业通勤、小区邻居、校友群、团建活动、其他时，系统 SHALL 分类管理
3. WHEN 用户申请加入圈子时，系统 SHALL 通知圈主审核
4. IF 圈主审核通过，系统 SHALL 将用户添加为成员
5. WHILE 用户在圈子内时，系统 SHALL 允许其查看和发布行程

### Requirement 3: 车主发布行程

**User Story:** AS 车主，I want 发布我的行程和可用座位，so that 告知圈内成员

#### Acceptance Criteria

1. WHEN 车主点击"发布行程"时，系统 SHALL 提供行程信息填写表单
2. WHERE 行程表单包含起点、终点、出发时间、可用座位数、费用模式时，系统 SHALL 保存并发布
3. WHERE 费用模式包含免费互助、AA 分摊、付费搭乘时，系统 SHALL 支持三种模式
4. WHILE 行程处于有效期内时，系统 SHALL 在圈子行程列表中展示
5. WHEN 车主修改行程信息时，系统 SHALL 通知已预约的成员

### Requirement 4: 乘客搜索与预约

**User Story:** AS 乘客，I want 搜索符合我的行程，so that 找到合适的蹭车

#### Acceptance Criteria

1. WHEN 乘客输入起点和终点时，系统 SHALL 显示当前圈子内匹配的行程列表
2. WHEN 乘客设置出发时间范围时，系统 SHALL 筛选符合时间要求的行程
3. WHILE 行程列表展示时，系统 SHALL 显示车主信息、行程详情、剩余座位
4. WHEN 乘客点击"预约"时，系统 SHALL 创建预约请求（免费模式自动确认）
5. IF 车主确认预约（付费模式需确认），系统 SHALL 锁定座位并通知乘客

### Requirement 5: 团建活动智能分配

**User Story:** AS 活动组织者，I want 智能分配车辆，so that 高效安排团建出行

#### Acceptance Criteria

1. WHEN 组织者创建团建活动时，系统 SHALL 要求填写活动时间、地点、参与人数
2. WHEN 成员报名活动时，系统 SHALL 收集其出行需求（开车/搭车）
3. WHEN 报名截止后，系统 SHALL 智能分配搭车人员到车主车辆
4. WHERE 分配算法优先满足车主同部门/同小组需求时，系统 SHALL 优化分配
5. IF 有成员未被分配，系统 SHALL 建议打车辆数（基于剩余人数）

### Requirement 6: 行程管理

**User Story:** AS 用户，I want 查看和管理我的行程，so that 了解行程状态

#### Acceptance Criteria

1. WHILE 用户已登录时，系统 SHALL 提供"我的行程"页面
2. WHEN 行程开始前，系统 SHALL 允许乘客取消预约
3. WHEN 行程完成后，系统 SHALL 提示双方进行评价
4. IF 乘客未按时乘车，系统 SHALL 记录爽约并通知车主

### Requirement 7: 评价系统

**User Story:** AS 用户，I want 对行程进行评价，so that 帮助圈内成员了解可靠性

#### Acceptance Criteria

1. WHEN 行程状态为"已完成"时，系统 SHALL 开放评价功能
2. WHERE 评价包含星级评分和文字评论时，系统 SHALL 保存并展示
3. WHILE 用户查看其他成员资料时，系统 SHALL 显示平均评分和历史评价
4. IF 成员评价过低，系统 SHALL 提示圈主关注

### Requirement 8: 消息通知

**User Story:** AS 用户，I want 及时收到行程相关通知，so that 不错过重要信息

#### Acceptance Criteria

1. WHEN 预约状态变更时，系统 SHALL 向用户发送通知
2. WHEN 行程即将开始时，系统 SHALL 提前提醒双方
3. WHILE 用户有新消息时，系统 SHALL 在界面显示未读标记
4. WHERE 通知包含圈子申请、行程变更、活动提醒时，系统 SHALL 分类展示

### Requirement 9: AA 制费用计算

**User Story:** AS 用户，I want 自动计算 AA 费用，so that 公平分摊油费

#### Acceptance Criteria

1. WHEN 车主选择 AA 模式时，系统 SHALL 基于距离和油价计算建议分摊金额
2. WHERE 计算公式考虑油费 + 过路费分摊时，系统 SHALL 提供明细
3. WHEN 行程完成后，系统 SHALL 显示应付金额
4. IF 支持微信支付，系统 SHALL 提供付款功能（可选）

### Requirement 10: 安全与合规

**User Story:** AS 平台运营者，I want 确保平台安全合规运营，so that 保护用户权益

#### Acceptance Criteria

1. IF 成员被多次投诉或评价过低时，系统 SHALL 暂停其圈子资格并通知圈主
2. WHEN 用户注册时，系统 SHALL 要求同意服务条款和隐私政策
3. WHILE 行程发布时，系统 SHALL 验证起终点合理性
4. IF 检测到异常行为时，系统 SHALL 触发安全审核流程
5. WHERE 平台为微信小程序时，系统 SHALL 符合微信小程序审核规范
