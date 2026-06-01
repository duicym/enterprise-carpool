# GitHub 项目更新指南

## 更新 About 描述

### 手动更新步骤

1. 打开项目主页：https://github.com/duicym/ceng-carpool
2. 点击右上角齿轮图标 (Settings)
3. 在 "About" 区域填写以下信息:

**Website:** (可选) 留空或填写你的演示地址

**Topics:** 添加以下标签
- wechat-miniprogram
- carpool
- ride-sharing
- nestjs
- typescript
- mysql

### About 描述文案

```text
🚗 熟人社交蹭车平台 - 企业通勤 | 团建出行 | 社群拼车

基于微信小程序，支持圈子机制、智能车辆分配、AA/免费/付费灵活模式。

技术栈：NestJS · TypeScript · MySQL · Redis
```

### 上传项目 Logo

1. 在 GitHub 仓库根目录创建或更新 `.github/profile.md`
2. 或者直接上传到仓库根目录，然后在 README 中引用

### 使用 GitHub API 自动更新 (可选)

```bash
# 需要先准备 GitHub Token
export GITHUB_TOKEN=your_token

# 使用 curl 更新项目描述
curl -X PATCH https://api.github.com/repos/duicym/ceng-carpool \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "description": "🚗 熟人社交蹭车平台 - 企业通勤 | 团建出行 | 社群拼车",
    "homepage": "https://your-domain.com",
    "topics": ["wechat-miniprogram", "carpool", "ride-sharing", "nestjs", "typescript"]
  }'
```

## 固定 README 到 About 区域

1. 进入 Settings 页面
2. 找到 "Features" 区域
3. 勾选 "README" 使其显示在 About 下方
