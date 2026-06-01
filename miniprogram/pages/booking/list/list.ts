// pages/booking/list/list.ts
import { api } from '../../../utils/request';

const statusMap: Record<number, string> = {
  0: '待确认',
  1: '已确认',
  2: '已完成',
  3: '已取消',
  4: '已拒绝',
  5: '未上车',
};

Page({
  data: {
    bookings: [] as any[],
    loading: false,
    currentTab: 'all',
    isDriver: false,
  },

  onLoad(options: any) {
    if (options.tripId) {
      this.setData({ tripId: options.tripId, isDriver: true });
    }
    this.loadBookings();
  },

  onShow() {
    this.loadBookings();
  },

  onPullDownRefresh() {
    this.loadBookings();
  },

  async loadBookings() {
    this.setData({ loading: true });
    try {
      let data;
      if (this.data.isDriver && this.data.tripId) {
        const res = await api.booking.byTrip(this.data.tripId);
        data = res.data;
      } else {
        const statusMap2 = { all: undefined, pending: 0, confirmed: 1, completed: 2 };
        const status = statusMap2[this.data.currentTab as keyof typeof statusMap2];
        const res = await api.booking.my(status);
        data = res.data;
      }
      this.setData({ bookings: data || [] });
    } catch (error) {
      console.error('加载预约失败:', error);
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadBookings();
  },

  goToDetail(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/booking/detail/detail?id=${id}` });
  },

  formatStatus(status: number) {
    return statusMap[status] || '未知';
  },

  formatDateTime(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  },

  showActions(status: number) {
    if (this.data.isDriver) return false;
    return status === 0 || status === 1 || status === 2;
  },

  async cancelBooking(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消预约',
      editable: true,
      placeholderText: '请输入取消原因',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.booking.cancel(id, { reason: res.content || '个人原因' });
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadBookings();
          } catch (error) {
            wx.showToast({ title: '取消失败', icon: 'none' });
          }
        }
      },
    });
  },

  writeReview(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/review/write/write?bookingId=${id}` });
  },
});
