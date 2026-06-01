# 蹭蹭车开发者指南

## 介绍

蹭蹭车是一款专注于熟人社交的互助出行平台，采用前后端分离架构：

- **后端**: NestJS + TypeScript + MySQL
- **前端**: 微信小程序原生开发
- **部署**: Docker + Nginx

## 快速开始

### 1. 环境要求

- Node.js 18+
- MySQL 8.0+ 或 SQLite 3.27+
- 微信开发者工具

### 2. 开发环境搭建

```bash
# 克隆项目
git clone https://github.com/duicym/enterprise-carpool.git
cd enterprise-carpool

# 后端依赖
cd backend
npm install

# 启动后端服务
npm run start:dev
```

### 3. 小程序开发

1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. 配置 AppID
4. 修改 `utils/request.ts` 中的 API 地址

## 文档目录

- [安装部署](/guide/installation)
- [系统架构](/guide/architecture)
- [API 开发](/api/)
