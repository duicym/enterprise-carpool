const api = require('../../utils/api');

Page({
  data: {
    startAddress: '',
    startLatitude: null,
    startLongitude: null,
    endAddress: '',
    endLatitude: null,
    endLongitude: null,
    departureTime: '',
    seats: 3,
    price: '',
    frequencyOptions: ['工作日', '每天', '自定义'],
    frequencyIndex: 0,
    publishDate: '',
    minDate: '',
    remark: '',
    submitting: false,
  },

  onLoad() {
    const today = new Date().toISOString().split('T')[0];
    this.setData({ minDate: today, publishDate: today });
  },

  selectStartLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          startAddress: res.address + res.name,
          startLatitude: res.latitude,
          startLongitude: res.longitude,
        });
      },
    });
  },

  selectEndLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          endAddress: res.address + res.name,
          endLatitude: res.latitude,
          endLongitude: res.longitude,
        });
      },
    });
  },

  onDepartureTimeChange(e) {
    this.setData({ departureTime: e.detail.value });
  },

  increaseSeats() {
    const { seats } = this.data;
    if (seats < 10) {
      this.setData({ seats: seats + 1 });
    }
  },

  decreaseSeats() {
    const { seats } = this.data;
    if (seats > 1) {
      this.setData({ seats: seats - 1 });
    }
  },

  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },

  onFrequencyChange(e) {
    this.setData({ frequencyIndex: parseInt(e.detail.value) });
  },

  onPublishDateChange(e) {
    this.setData({ publishDate: e.detail.value });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  async handleSubmit() {
    const {
      startAddress, startLatitude, startLongitude,
      endAddress, endLatitude, endLongitude,
      departureTime, seats, price,
      frequencyIndex, frequencyOptions, publishDate,
      remark, submitting,
    } = this.data;

    if (submitting) return;

    if (!startAddress || !startLatitude) {
      wx.showToast({ title: '请选择起点', icon: 'none' });
      return;
    }

    if (!endAddress || !endLatitude) {
      wx.showToast({ title: '请选择终点', icon: 'none' });
      return;
    }

    if (!departureTime) {
      wx.showToast({ title: '请选择出发时间', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const frequency = frequencyOptions[frequencyIndex];

    try {
      await api.post('/route', {
        start_address: startAddress,
        start_latitude: startLatitude,
        start_longitude: startLongitude,
        end_address: endAddress,
        end_latitude: endLatitude,
        end_longitude: endLongitude,
        departure_time: departureTime + ':00',
        seat_count: seats,
        price_per_seat: price ? parseFloat(price) : 0,
        frequency: frequency,
        publish_date: publishDate,
        remark: remark || undefined,
      }, { showLoading: true, loadingText: '发布中...' });

      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      this.setData({ submitting: false });
    }
  },
});
