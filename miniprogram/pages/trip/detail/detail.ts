// pages/trip/detail/detail.ts
import { api } from '../../../utils/request';
import { formatFeeMode } from '../../../utils/formatter';

Page({
  data: {
    trip: null as any,
    bookings: [] as any[],
    isDriver: false,
    canBook: false,
  },

  onLoad(options: any) {
    if (options.id) {
      this.setData({ tripId: options.id });
      this.loadTripDetail();
    }
  },

  async loadTripDetail() {
    try {
      const [tripRes, bookingsRes] = await Promise.all([
        api.trip.detail(this.data.tripId),
        api.booking.byTrip(this.data.tripId),
      ]);

      const trip = tripRes.data;
      const app = getApp<any>();
      const userId = app.globalData.userInfo?.id;

      this.setData({
        trip,
        bookings: bookingsRes.data || [],
        isDriver: trip.driverId === userId,
        canBook: userId !== trip.driverId,
      });
    } catch (error) {
      console.error('加载行程详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  formatFeeMode(mode: number) {
    return formatFeeMode(mode);
  },

  formatDateTime(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  },

  calculateArrivalTime(departureTime: string, durationMinutes: number = 30) {
    const date = new Date(departureTime);
    date.setMinutes(date.getMinutes() + durationMinutes);
    return this.formatDateTime(date.toISOString());
  },

  async createBooking() {
    const app = getApp<any>();
    if (!app.globalData.userInfo) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }

    wx.showModal({
      title: '确认预约',
      content: `预约 ${this.data.trip.availableSeats} 个座位`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.booking.create(this.data.tripId, {
              seatsBooked: 1,
            });
            wx.showToast({ title: '预约成功', icon: 'success' });
            this.loadTripDetail();
          } catch (error) {
            console.error('预约失败:', error);
            wx.showToast({ title: '预约失败', icon: 'none' });
          }
        }
      },
    });
  },

  viewBookings() {
    wx.navigateTo({ url: `/pages/booking/list/list?tripId=${this.data.tripId}` });
  },

  async confirmBooking(e: any) {
    const bookingId = e.currentTarget.dataset.id;
    try {
      await api.booking.confirm(bookingId);
      wx.showToast({ title: '已确认', icon: 'success' });
      this.loadTripDetail();
    } catch (error) {
      wx.showToast({ title: '确认失败', icon: 'none' });
    }
  },

  async rejectBooking(e: any) {
    const bookingId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '拒绝预约',
      editable: true,
      placeholderText: '请输入拒绝原因',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.booking.reject(bookingId, { reason: res.content || '座位已满' });
            wx.showToast({ title: '已拒绝', icon: 'success' });
            this.loadTripDetail();
          } catch (error) {
            wx.showToast({ title: '拒绝失败', icon: 'none' });
          }
        }
      },
    });
  },

  async cancelTrip() {
    wx.showModal({
      title: '取消行程',
      content: '确定要取消这个行程吗？已预约的乘客将收到通知。',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.trip.cancel(this.data.tripId);
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadTripDetail();
          } catch (error) {
            wx.showToast({ title: '取消失败', icon: 'none' });
          }
        }
      },
    });
  },
});
