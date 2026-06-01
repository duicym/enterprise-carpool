// app.ts
import 'miniprogram-api-typings';

interface IAppOption {
  globalData: {
    apiBaseUrl: string;
    token: string | null;
    userInfo: any | null;
  };
}

App<IAppOption>({
  globalData: {
    apiBaseUrl: 'http://localhost:3000/api', // 本地开发
    // apiBaseUrl: 'https://your-domain/api',  // 生产环境
    token: null,
    userInfo: null,
  },

  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true,
      });
    }

    // 检查登录态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      // 可以在这里验证 token 是否有效
    }

    // 获取用户信息
    this.loadUserInfo();
  },

  async loadUserInfo() {
    try {
      // 如果有 token，获取用户信息
      if (this.globalData.token) {
        // 调用 API 获取用户信息
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },
});
