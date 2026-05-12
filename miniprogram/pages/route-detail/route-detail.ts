const api = require('../../utils/api');

Page({
  data: {
    route: null,
    driverRating: 5.0,
    arrivalTime: '',
    showContact: false,
    bookDisabled: false,
    bookBtnText: '预约座位',
    loading: false,
    booking: false,
  },

  onLoad(options) {
    if (options.id) {
      this.loadRouteDetail(options.id);
    }
  },

  async loadRouteDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await api.get(`/route/${id}`);
      const route = res.data;

      // 计算预计到达时间
      const departureTime = route.departure_time;
      const arrivalTime = this.calculateArrivalTime(departureTime);

      const bookDisabled = route.available_seats <= 0;
      const bookBtnText = bookDisabled ? '已满员' : '预约座位';

      this.setData({
        route,
        arrivalTime,
        bookDisabled,
        bookBtnText,
      });
    } catch (error) {
      console.error('Failed to load route detail:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  calculateArrivalTime(departureTime) {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const arrivalHours = hours + 1;
    return `${String(arrivalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  },

  contactDriver() {
    const { route } = this.data;
    if (route && route.driver && route.driver.phone) {
      wx.makePhoneCall({ phoneNumber: route.driver.phone });
    } else {
      wx.showToast({ title: '车主暂未公开手机号', icon: 'none' });
    }
  },

  async bookSeat() {
    const { route, bookDisabled, booking } = this.data;
    if (bookDisabled || booking) return;

    this.setData({ booking: true });

    wx.showModal({
      title: '预约座位',
      editable: true,
      placeholderText: '备注信息（选填，如上楼地点）',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.post('/order', {
              route_id: route.id,
              seats_booked: 1,
              pickup_address: route.start_address,
              dropoff_address: route.end_address,
            }, { showLoading: true, loadingText: '预约中...' });

            wx.showToast({ title: '预约成功', icon: 'success' });
            setTimeout(() => {
              wx.switchTab({ url: '/pages/order/order' });
            }, 1000);
          } catch (error) {
            console.error('Booking failed:', error);
          } finally {
            this.setData({ booking: false });
          }
        } else {
          this.setData({ booking: false });
        }
      },
    });
  },
});
