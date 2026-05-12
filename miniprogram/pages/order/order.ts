const api = require('../../utils/api');

Page({
  data: {
    orderList: [],
    currentTab: 'all',
    loading: false,
    tabs: [
      { key: 'all', label: '全部' },
      { key: '0', label: '待确认' },
      { key: '1', label: '已确认' },
      { key: '2', label: '已完成' },
      { key: '3', label: '已取消' },
    ],
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
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadOrders();
  },

  async loadOrders() {
    this.setData({ loading: true });
    try {
      const res = await api.get('/order/my');
      let list = res.data || [];

      // 按状态筛选
      if (this.data.currentTab !== 'all') {
        list = list.filter(item => item.status === parseInt(this.data.currentTab));
      }

      this.setData({ orderList: list });
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
  },

  async confirmOrder(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await api.put(`/order/${id}/confirm`, {}, { showLoading: true, loadingText: '确认中...' });
      wx.showToast({ title: '已确认', icon: 'success' });
      this.loadOrders();
    } catch (error) {
      console.error('Confirm failed:', error);
    }
  },

  async cancelOrder(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '取消订单',
      editable: true,
      placeholderText: '请输入取消原因（选填）',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.put(`/order/${id}/cancel`, { reason: res.content || undefined }, { showLoading: true, loadingText: '取消中...' });
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadOrders();
          } catch (error) {
            console.error('Cancel failed:', error);
          }
        }
      },
    });
  },

  async completeOrder(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '完成行程',
      content: '请确认乘客已上车并完成行程',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.put(`/order/${id}/complete`, {}, { showLoading: true, loadingText: '完成中...' });
            wx.showToast({ title: '已完成', icon: 'success' });
            this.loadOrders();
          } catch (error) {
            console.error('Complete failed:', error);
          }
        }
      },
    });
  },
});
