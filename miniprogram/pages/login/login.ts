const api = require('../../utils/api');

Page({
  data: {
    loading: false,
    hasUserInfo: false,
    userInfo: null,
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync('token');
    if (token) {
      getApp().globalData.token = token;
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  // 微信授权登录
  async handleLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      // 1. 获取微信登录 code
      const loginRes = await wx.login();
      const code = loginRes.code;

      // 2. 调用后端登录接口
      const res = await api.post('/auth/wechat-login', { code });

      // 3. 保存登录信息
      const { token, user, isNew } = res.data;
      wx.setStorageSync('token', token);
      getApp().globalData.token = token;
      getApp().globalData.userInfo = user;

      // 4. 根据是否新用户跳转
      if (isNew) {
        wx.redirectTo({ url: '/pages/company-auth/company-auth' });
      } else {
        wx.switchTab({ url: '/pages/index/index' });
      }
    } catch (error) {
      console.error('Login failed:', error);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 授权获取用户信息
  onGetUserProfile(e) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({
          hasUserInfo: true,
          userInfo,
        });
        // 获取到用户信息后继续登录
        this.handleLoginWithProfile(userInfo);
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({
          title: '需要授权才能继续',
          icon: 'none',
        });
      },
    });
  },

  // 带用户信息的登录
  async handleLoginWithProfile(userInfo) {
    try {
      const loginRes = await wx.login();
      const code = loginRes.code;

      const res = await api.post('/auth/wechat-login', {
        code,
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender,
        },
      });

      const { token, user, isNew } = res.data;
      wx.setStorageSync('token', token);
      getApp().globalData.token = token;
      getApp().globalData.userInfo = user;

      if (isNew) {
        wx.redirectTo({ url: '/pages/company-auth/company-auth' });
      } else {
        wx.switchTab({ url: '/pages/index/index' });
      }
    } catch (error) {
      console.error('Login with profile failed:', error);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 跳过登录（开发调试用）
  handleSkip() {
    wx.switchTab({ url: '/pages/index/index' });
  },
});
