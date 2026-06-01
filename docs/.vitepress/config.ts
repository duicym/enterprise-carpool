import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '蹭蹭车',
  description: '熟人社交互助出行平台',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '功能特性', link: '/features' },
      { text: '开发者文档', link: '/guide/' },
      { text: 'API 文档', link: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '快速开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: '配置', link: '/guide/configuration' },
          ],
        },
        {
          text: '前端开发',
          items: [
            { text: '小程序开发', link: '/guide/miniprogram' },
            { text: '页面组件', link: '/guide/components' },
          ],
        },
        {
          text: '后端开发',
          items: [
            { text: '架构说明', link: '/guide/architecture' },
            { text: '数据库', link: '/guide/database' },
            { text: 'API 开发', link: '/guide/api' },
          ],
        },
        {
          text: '部署运维',
          items: [
            { text: 'Docker 部署', link: '/guide/deployment' },
            { text: '环境配置', link: '/guide/environment' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '认证接口', link: '/api/auth' },
            { text: '用户接口', link: '/api/user' },
            { text: '圈子接口', link: '/api/circle' },
            { text: '行程接口', link: '/api/trip' },
            { text: '预约接口', link: '/api/booking' },
            { text: '活动接口', link: '/api/event' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/duicym/enterprise-carpool' },
    ],

    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2025 duicym',
    },
  },
})
