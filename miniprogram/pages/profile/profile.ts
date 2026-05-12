const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    companyName: '',
    auditStatus: null,
    auditStatusText: '',
    unreadCount: 0,
    loading: false,
  },

  onShow() {
    this.loadUserInfo();
  },

  async loadUserInfo() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }

    this.setData({ loading: true });
    try {
      const res = await api.get('/auth/profile');
      const user = res.data;

      let companyName = '';
      let auditStatus = null;
      let auditStatusText = '';

      if (user.userCompanies && user.userCompanies.length > 0) {
        const uc = user.userCompanies[0];
        companyName = uc.company.name;
        auditStatus = uc.audit_status;

        if (auditStatus === 0) auditStatusText = '审核中';
        else if (auditStatus === 1) auditStatusText = '已认证';
        else if (auditStatus === 2) auditStatusText = '已拒绝';
      }

      this.setData({ userInfo: user, companyName, auditStatus, auditStatusText });
      getApp().globalData.userInfo = user;

      // 获取未读消息数
      this.loadUnreadCount();
    } catch (error) {
      console.error('Failed to load user info:', error);
      wx.redirectTo({ url: '/pages/login/login' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async loadUnreadCount() {
    try {
      const res = await api.get('/notification/list', { page: 1, pageSize: 1 }, { silent: true });
      this.setData({ unreadCount: res.data.unreadCount || 0 });
    } catch (error) {
      // 忽略
    }
  },

  goToPage(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          getApp().globalData.token = null;
          getApp().globalData.userInfo = null;
          wx.reLaunch({ url: '/pages/login/login' });
        }
      },
    });
  },
});
