# 使用 GitHub Pages 部署官网

## 方案说明

利用 GitHub Pages 免费托管静态网站，适合项目官网、产品文档等场景。

## 自动化部署流程

### 1. 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy-site.yml`：

```yaml
name: Deploy Site to GitHub Pages

on:
  push:
    branches: [ 260509-feat-public-carpool-spec ]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        working-directory: ./docs
        run: npm install

      - name: Build site
        working-directory: ./docs
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
          publish_branch: gh-pages
```

### 2. 启用 GitHub Pages

1. 进入仓库 Settings
2. 点击 Pages 菜单
3. Source 选择 `gh-pages` 分支
4. Root directory 选择 `/(root)`
5. Save 保存

### 3. 访问官网

构建完成后，官网地址为：
```
https://duicym.github.io/enterprise-carpool/
```

## 手动部署方案（临时）

如果没有配置 GitHub Actions，可以手动构建：

```bash
# 安装 VitePress
cd docs
npm install

# 构建站点
npm run build

# 将生成的静态文件部署到 gh-pages 分支
cd .vitepress/dist
git init
git add .
git commit -m "Deploy to GitHub Pages"
git push -f git@github.com:duicym/enterprise-carpool.git main:gh-pages
```

## 自定义域名（可选）

如果想使用自定义域名：

1. 在 `.vitepress/dist` 目录下创建 `CNAME` 文件
2. 内容为你的域名，例如：`cengcar.com`
3. 在域名 DNS 服务商处添加 CNAME 记录到 `duicym.github.io`

## 网站预览

### 主题页面

- **首页**: 产品介绍、核心特性
- **功能页面**: 详细功能说明
- **文档**: 开发者指南、架构说明
- **API 文档**: 接口参考文档

### 主题定制

可以自定义主题颜色、Logo 等：

```ts
// docs/.vitepress/config.ts
export default defineConfig({
  themeConfig: {
    // 自定义品牌色
    brandColor: '#07C160',
    
    // Logo
    logo: '/logo.png',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '功能', link: '/features' },
    ],
  }
})
```

## 成本

- **GitHub Pages**: 完全免费
- **GitHub Actions**: 每月 2000 分钟免费额度（足够使用）
- **存储空间**: 1GB 免费

## 其他方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **GitHub Pages** | 免费、简单 | 仅静态网站 | 文档、官网 👍 |
| **Vercel** | 自动部署、全球 CDN | 需要注册 | 前后端分离项目 |
| **Netlify** | 免费、功能强 | 需要科学上网 | 国际项目 |
| **Cloudflare Pages** | 免费、速度快 | 配置复杂 | 高性能需求 |
