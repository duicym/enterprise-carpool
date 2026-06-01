# 小程序前端开发指南

## 项目结构

```
miniprogram/
├── app.ts                 # 全局配置
├── app.json              # 小程序配置
├── app.wxss              # 全局样式
├── pages/                # 页面
│   ├── index/           # 首页
│   ├── login/           # 登录页
│   ├── circle/          # 圈子相关页面
│   ├── trip/            # 行程相关页面
│   ├── booking/         # 预约相关页面
│   ├── event/           # 活动页面
│   └── profile/         # 个人中心
├── components/           # 可复用组件
├── utils/               # 工具函数
│   ├── request.ts       # API 请求封装
│   └── formatter.ts     # 格式化工具
└── images/              # 静态资源
```

## 开发规范

### 1. 网络请求

使用封装好的 `request` 工具：

```typescript
import { api } from '../../utils/request';

// GET 请求
const { data } = await api.circle.my();

// POST 请求
await api.circle.create({ name: '测试圈子', type: 1 });
```

### 2. 数据格式化

使用封装的格式化工具：

```typescript
import { formatDateTime, formatPrice } from '../../utils/formatter';

formatDateTime(new Date(), 'YYYY-MM-DD HH:mm'); // "2024-06-01 14:30"
formatPrice(25.5); // "¥25.50"
```

### 3. 页面跳转

```typescript
// 普通跳转
wx.navigateTo({ url: '/pages/trip/detail/detail?id=123' });

// Tab 跳转
wx.switchTab({ url: '/pages/index/index' });

// 返回
wx.navigateBack();
```

### 4. 状态管理

使用 `getApp().globalData` 进行全局状态管理：

```typescript
const app = getApp<any>();
const token = app.globalData.token;
const userInfo = app.globalData.userInfo;
```

## 已实现页面

### ✅ 首页 (pages/index)
- 展示圈子内的行程列表
- 下拉刷新
- 发布行程入口

### ✅ 登录页 (pages/login)
- 微信一键登录
- 获取用户信息
- 保存 token

## 待开发页面

### 📋 圈子模块
- [ ] 圈子列表页 (pages/circle/list)
- [ ] 圈子详情页 (pages/circle/detail)
- [ ] 创建圈子页

### 📋 行程模块
- [ ] 行程发布页 (pages/trip/publish)
- [ ] 行程详情页 (pages/trip/detail)

### 📋 预约模块
- [ ] 预约列表页 (pages/booking/list)
- [ ] 预约详情页 (pages/booking/detail)

### 📋 活动模块
- [ ] 活动详情页 (pages/event/detail)
- [ ] 活动分配结果页

### 📋 个人中心
- [ ] 个人中心页 (pages/profile)
- [ ] 我的评价
- [ ] 消息通知

## 开发流程

1. **创建页面目录**
   ```bash
   mkdir -p pages/moduleName/pageName
   ```

2. **创建页面文件**
   - `.ts` - 页面逻辑
   - `.wxml` - 页面结构
   - `.wxss` - 页面样式
   - `.json` - 页面配置

3. **在 app.json 中注册页面**

4. **开发并测试**

## 样式规范

### 颜色变量

```wxss
:root {
  --primary-color: #07C160;
  --danger-color: #f44336;
  --warning-color: #ff9800;
  --text-color: #333;
  --text-light: #999;
  --bg-color: #f5f5f5;
}
```

### 通用样式类

```wxss
/* 按钮 */
.btn-primary {
  background-color: #07C160;
  color: #fff;
}

/* 卡片 */
.card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 120rpx 0;
}
```

## 调试技巧

### 1. 使用 console.log

```typescript
console.log('调试信息:', data);
```

### 2. 真机调试

在微信开发者工具中：
- 点击"真机调试"
- 使用手机扫码

### 3. 网络调试

在开发者工具中查看 Network 面板，查看请求详情。

## 发布流程

1. **代码审核**
   - 在微信开发者工具中点击"上传"
   
2. **版本管理**
   - 登录微信公众平台
   - 进入"版本管理"
   
3. **提交审核**
   - 填写版本说明
   - 提交审核
   
4. **发布上线**
   - 审核通过后点击"发布"

## 注意事项

1. **域名配置**
   - 生产环境必须配置 HTTPS 域名
   - 在微信公众平台配置 request 合法域名

2. **用户隐私**
   - 不得强制用户授权
   - 需明确告知用户信息用途

3. **性能优化**
   - 图片使用 compression
   - 长列表使用虚拟列表
   - 避免频繁的 setData

## 相关资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Vant Weapp 组件库](https://youzan.github.io/vant-weapp/)
- [腾讯地图小程序 SDK](https://lbs.qq.com/miniProgram/cyber/)
