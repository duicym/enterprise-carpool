// pages/profile/profile.ts
import { api } from '../../utils/request';

Page({
  data: {
    userInfo: null as any,
    userStats: null as any,
  },

  onShow() {
    this.loadUserInfo();
  },

  async loadUserInfo() {
    try {
      const app = getApp<any>();
      const userInfo = app.globalData.userInfo;
      
      if (userInfo) {
        this.setData({ userInfo });
        
        // 获取评价统计
        try {
          const { data } = await api.review.userStats(userInfo.id);
          this.setData({ userStats: data });
        } catch (error) {
          console.error('获取评价统计失败:', error);
        }
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  goToMyTrips() {
    wx.navigateTo({ url: '/pages/booking/list/list' });
  },

  goToMyReviews() {
    wx.navigateTo({ url: '/pages/profile/reviews/reviews' });
  },

  goToMyCircles() {
    wx.navigateTo({ url: '/pages/circle/list/list' });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp<any>();
          app.globalData.token = null;
          app.globalData.userInfo = null;
          wx.removeStorageSync('token');
          wx.redirectTo({ url: '/pages/login/login' });
        }
      },
    });
  },

  ratingToStars(rating: number): string {
    return '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
  },
});
