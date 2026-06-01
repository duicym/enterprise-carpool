// pages/login/login.ts
import { api } from '../../utils/request';

Page({
  data: {
    loading: false,
  },

  onLoad() {
    // 检查是否已有 token
    const app = getApp<any>();
    if (app.globalData.token) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  async onGetUserInfo(e: any) {
    if (e.detail.userInfo) {
      this.setData({ loading: true });
      
      try {
        // 微信登录获取 code
        const { code } = await this.wxLogin();
        
        // 调用后端登录接口
        const { data } = await api.auth.login(code);
        
        // 保存 token 和用户信息
        const app = getApp<any>();
        app.globalData.token = data.token;
        app.globalData.userInfo = data.user;
        wx.setStorageSync('token', data.token);
        
        wx.showToast({
          title: '登录成功',
          icon: 'success',
        });
        
        // 跳转首页
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' });
        }, 1000);
        
      } catch (error) {
        console.error('登录失败:', error);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none',
        });
      } finally {
        this.setData({ loading: false });
      }
    } else {
      wx.showToast({
        title: '需要授权登录',
        icon: 'none',
      });
    }
  },

  wxLogin(): Promise<{ code: string }> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve({ code: res.code });
          } else {
            reject(new Error('微信登录失败'));
          }
        },
        fail: reject,
      });
    });
  },
});
