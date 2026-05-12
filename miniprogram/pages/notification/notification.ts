const api = require('../../utils/api');

Page({
  data: {
    notificationList: [],
    currentTab: 'all',
    unreadCount: 0,
    loading: false,
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'unread', label: '未读' },
      { key: 'read', label: '已读' },
    ],
    typeMap: {
      'order_confirm': '订单确认',
      'order_cancel': '订单取消',
      'order_complete': '行程完成',
      'review_new': '新评价',
      'audit_pass': '认证通过',
      'audit_reject': '认证拒绝',
      'system': '系统通知',
    },
  },

  onShow() {
    this.loadNotifications();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadNotifications();
  },

  async loadNotifications() {
    this.setData({ loading: true });
    try {
      const res = await api.get('/notification/list');
      const data = res.data;
      let list = data.items || [];

      if (this.data.currentTab === 'unread') {
        list = list.filter(item => item.is_read === 0);
      } else if (this.data.currentTab === 'read') {
        list = list.filter(item => item.is_read === 1);
      }

      this.setData({
        notificationList: list,
        unreadCount: data.unreadCount || 0,
      });
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  async markAsRead(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await api.put(`/notification/${id}/read`, {});
      this.loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  async markAllAsRead() {
    try {
      await api.put('/notification/read-all', {});
      wx.showToast({ title: '已标记为已读', icon: 'success' });
      this.loadNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },
});
