// pages/booking/detail/detail.ts
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
    booking: null as any,
    review: null as any,
    isDriver: false,
    showActions: false,
    canCancel: false,
    canComplete: false,
    canReview: false,
  },

  onLoad(options: any) {
    if (options.id) {
      this.setData({ bookingId: options.id });
      this.loadBookingDetail();
    }
  },

  async loadBookingDetail() {
    try {
      const [bookingRes, reviewRes] = await Promise.all([
        api.booking.detail(this.data.bookingId),
        api.review.getByBooking(this.data.bookingId).catch(() => ({ data: null })),
      ]);

      const booking = bookingRes.data;
      const app = getApp<any>();
      const userId = app.globalData.userInfo?.id;

      const isDriver = booking.driverId === userId;
      const status = booking.status;

      this.setData({
        booking,
        review: reviewRes.data,
        isDriver,
        showActions: !isDriver && (status === 0 || status === 1 || status === 2),
        canCancel: !isDriver && (status === 0 || status === 1),
        canComplete: isDriver && status === 1,
        canReview: !isDriver && status === 2 && !reviewRes.data,
      });
    } catch (error) {
      console.error('加载预约详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
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

  async cancelBooking() {
    wx.showModal({
      title: '取消预约',
      editable: true,
      placeholderText: '请输入取消原因',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.booking.cancel(this.data.bookingId, { reason: res.content || '个人原因' });
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadBookingDetail();
          } catch (error) {
            wx.showToast({ title: '取消失败', icon: 'none' });
          }
        }
      },
    });
  },

  async completeTrip() {
    wx.showModal({
      title: '确认完成',
      content: '确认乘客已上车并完成行程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.booking.complete(this.data.bookingId);
            wx.showToast({ title: '已完成', icon: 'success' });
            this.loadBookingDetail();
          } catch (error) {
            wx.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      },
    });
  },

  writeReview() {
    wx.navigateTo({ url: `/pages/review/write/write?bookingId=${this.data.bookingId}` });
  },

  callPassenger() {
    wx.makePhoneCall({ phoneNumber: this.data.booking.passenger.phone });
  },

  callDriver() {
    wx.makePhoneCall({ phoneNumber: this.data.booking.driver.phone });
  },
});
