App({
  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: 'http://localhost:3000/api',
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },

  onShow() {
    // 检查登录状态
    if (!this.globalData.token) {
      // 如果不在登录页，可以提示用户登录
    }
  },
});
