# GitHub Pages 官网部署指南

## 快速部署步骤

### 第一步：合并代码到 main 分支

官网部署工作流会在代码推送到 `main` 分支时自动触发。

```bash
# 方案 1: 合并到 main 分支
git checkout main
git merge 260509-feat-public-carpool-spec
git push origin main

# 或者方案 2: 在 GitHub 上创建 Pull Request
# 1. 进入 https://github.com/duicym/enterprise-carpool
# 2. 点击 "Pull requests" -> "New pull request"
# 3. 从 260509-feat-public-carpool-spec 合并到 main
# 4. 合并后自动触发部署
```

### 第二步：启用 GitHub Pages

1. 打开仓库 https://github.com/duicym/enterprise-carpool
2. 点击 **Settings** (设置)
3. 左侧菜单选择 **Pages**
4. **Source** 选择：
   - Deploy from a branch
   - Branch: 选择 `gh-pages`
   - Folder: 选择 `/(Root)`
5. 点击 **Save**

### 第三步：等待自动构建

代码推送后，GitHub Actions 会自动：
1. 安装 VitePress
2. 构建静态网站
3. 部署到 gh-pages 分支

查看构建状态：
- 进入 **Actions** 标签
- 查看 "Deploy Site to GitHub Pages" 工作流
- 绿色勾选表示成功

### 第四步：访问官网

部署成功后，访问：
```
https://duicym.github.io/enterprise-carpool/
```

## 本地预览

在部署前可以本地预览网站：

```bash
cd docs
npm install
npm run dev
```

然后打开浏览器访问 `http://localhost:5173`

## 自定义配置

### 修改网站标题和描述

编辑 `docs/.vitepress/config.ts`：

```ts
export default defineConfig({
  title: '蹭蹭车',
  description: '熟人社交互助出行平台',
})
```

### 添加 Logo

1. 将 logo 图片放到 `docs/public/logo.png`
2. 配置中引用即可

### 自定义域名

如需使用自己的域名：

1. 在 GitHub Pages 设置中添加自定义域名
2. 在 `docs/public/CNAME` 文件中写入域名：
   ```
   cengcar.com
   ```
3. DNS 配置 CNAME 记录：
   ```
   cengcar.com. CNAME duicym.github.io.
   ```

## 常见问题

### 问题 1: 部署失败

查看 Actions 日志，常见原因：
- Node.js 版本不兼容
- npm 依赖安装失败
- 构建配置错误

解决方法：
```bash
cd docs
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 问题 2: 访问 404

确认：
- GitHub Pages 已启用 gh-pages 分支
- 构建成功且 dist 目录有文件

### 问题 3: 构建太慢

优化依赖缓存：
```yaml
cache: 'npm'
cache-dependency-path: docs/package-lock.json
```

## 后续规划

### 内容完善

- [ ] 补充详细的开发者文档
- [ ] 添加 API 接口详细说明
- [ ] 产品使用手册
- [ ] FAQ 常见问题

### 功能增强

- [ ] 添加在线演示
- [ ] 产品截图和演示视频
- [ ] 用户评价展示
- [ ] 数据统计和监控

### 品牌优化

- [ ] 设计专属 Logo
- [ ] 统一 UI 风格
- [ ] 添加产品介绍视频
- [ ] 制作宣传海报

---

**官网地址**: https://duicym.github.io/enterprise-carpool/  
**仓库地址**: https://github.com/duicym/enterprise-carpool
