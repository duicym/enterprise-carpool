const api = require('../../utils/api');

Page({
  data: {
    routeList: [],
    keyword: '',
    selectedDate: '',
    selectedTime: '',
    loading: false,
    refreshing: false,
    defaultAvatar: '/images/default-avatar.png',
  },

  onLoad() {
    this.loadRouteList();
  },

  onShow() {
    this.loadRouteList();
  },

  async loadRouteList() {
    this.setData({ loading: true });
    try {
      const params = {};
      if (this.data.keyword) {
        params.keyword = this.data.keyword;
      }
      if (this.data.selectedDate) {
        params.publish_date = this.data.selectedDate;
      }
      if (this.data.selectedTime) {
        params.departure_time = this.data.selectedTime;
      }

      const res = await api.get('/route/list', params);
      this.setData({
        routeList: res.data.items || [],
      });
    } catch (error) {
      console.error('Failed to load route list:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ refreshing: true });
    this.loadRouteList().finally(() => {
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
    });
  },

  // 搜索输入
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 执行搜索
  handleSearch() {
    this.loadRouteList();
  },

  // 清空搜索
  clearKeyword() {
    this.setData({ keyword: '' }, () => {
      this.loadRouteList();
    });
  },

  // 选择日期
  selectDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;

    // 计算未来7天
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[d.getDay()];
      dates.push({
        value: `${y}-${m}-${dd}`,
        label: i === 0 ? `今天 (${weekDay})` : i === 1 ? `明天 (${weekDay})` : `${m}-${dd} ${weekDay}`,
      });
    }

    wx.showActionSheet({
      itemList: dates.map(d => d.label),
      success: (res) => {
        const selected = dates[res.tapIndex];
        this.setData({ selectedDate: selected.value });
        this.loadRouteList();
      },
    });
  },

  // 选择时间
  selectTime() {
    const times = [
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00', '22:00',
    ];

    wx.showActionSheet({
      itemList: times,
      success: (res) => {
        this.setData({ selectedTime: times[res.tapIndex] });
        this.loadRouteList();
      },
    });
  },

  // 清除筛选条件
  clearFilters() {
    this.setData({
      selectedDate: '',
      selectedTime: '',
    });
    this.loadRouteList();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/route-detail/route-detail?id=${id}`,
    });
  },

  goToPublish() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({
      url: '/pages/route-publish/route-publish',
    });
  },
});
