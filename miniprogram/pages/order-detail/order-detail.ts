const api = require('../../utils/api');

Page({
  data: {
    order: null,
    statusMap: {
      0: '待确认',
      1: '已确认',
      2: '已完成',
      3: '已取消',
      4: '已拒绝',
      5: '已爽约',
    },
    statusClassMap: {
      0: 'status-pending',
      1: 'status-confirmed',
      2: 'status-completed',
      3: 'status-cancelled',
      4: 'status-rejected',
      5: 'status-no-show',
    },
    isDriver: false,
    loading: false,
  },

  onLoad(options) {
    if (options.id) {
      this.loadOrderDetail(options.id);
    }
  },

  async loadOrderDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await api.get(`/order/${id}`);
      const order = res.data;
      const userId = getApp().globalData.userInfo?.id;
      const isDriver = order.driver_id === userId;

      this.setData({ order, isDriver });
    } catch (error) {
      console.error('Failed to load order detail:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  contactOther() {
    const { order, isDriver } = this.data;
    const phone = isDriver ? order.passenger?.phone : order.driver?.phone;
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone });
    } else {
      wx.showToast({ title: isDriver ? '乘客未公开手机号' : '车主未公开手机号', icon: 'none' });
    }
  },

  async confirmOrder() {
    const { order } = this.data;
    try {
      await api.put(`/order/${order.id}/confirm`, {}, { showLoading: true, loadingText: '确认中...' });
      wx.showToast({ title: '已确认', icon: 'success' });
      this.loadOrderDetail(order.id);
    } catch (error) {
      console.error('Confirm failed:', error);
    }
  },

  async cancelOrder() {
    const { order } = this.data;

    wx.showModal({
      title: '取消订单',
      editable: true,
      placeholderText: '请输入取消原因',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.put(`/order/${order.id}/cancel`, { reason: res.content || undefined }, { showLoading: true, loadingText: '取消中...' });
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadOrderDetail(order.id);
          } catch (error) {
            console.error('Cancel failed:', error);
          }
        }
      },
    });
  },

  async completeOrder() {
    const { order } = this.data;

    wx.showModal({
      title: '完成行程',
      content: '请确认乘客已上车并到达目的地',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.put(`/order/${order.id}/complete`, {}, { showLoading: true, loadingText: '完成中...' });
            wx.showToast({ title: '已完成', icon: 'success' });
            this.loadOrderDetail(order.id);
          } catch (error) {
            console.error('Complete failed:', error);
          }
        }
      },
    });
  },

  writeReview() {
    const { order, isDriver } = this.data;
    const revieweeId = isDriver ? order.passenger_id : order.driver_id;
    wx.navigateTo({ url: `/pages/review/review?orderId=${order.id}&revieweeId=${revieweeId}` });
  },
});
