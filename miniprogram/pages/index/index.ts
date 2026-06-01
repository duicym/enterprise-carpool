// pages/index/index.ts
import { api } from '../../utils/request';
import { formatDateTime, formatFeeMode } from '../../utils/formatter';

Page({
  data: {
    trips: [] as any[],
    loading: false,
  },

  onLoad() {
    this.loadTrips();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadTrips();
  },

  async loadTrips() {
    this.setData({ loading: true });
    try {
      // 获取我的圈子列表
      const { data: circles } = await api.circle.my();
      
      if (circles && circles.length > 0) {
        // 获取第一个圈子的行程
        const trips = await api.trip.list(circles[0].id);
        this.setData({ trips: trips.data || [] });
      }
    } catch (error) {
      console.error('加载行程失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  onPullDownRefresh() {
    this.loadTrips().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  goToPublish() {
    wx.navigateTo({ url: '/pages/trip/publish/publish' });
  },

  goToDetail(e: any) {
    const tripId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/trip/detail/detail?id=${tripId}` });
  },

  formatDate(date: string) {
    return formatDateTime(date, 'MM/DD HH:mm');
  },

  formatFee(mode: number, amount: number) {
    const modeText = formatFeeMode(mode);
    if (mode === 1) return modeText;
    return `${modeText} ¥${amount}`;
  },
});
