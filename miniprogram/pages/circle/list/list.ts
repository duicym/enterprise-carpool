// pages/circle/list/list.ts
import { api } from '../../../utils/request';
import { formatCircleType } from '../../../utils/formatter';

Page({
  data: {
    circles: [] as any[],
    loading: false,
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'owner', label: '我创建的' },
    ],
    currentTab: 'all',
  },

  onLoad() {
    this.loadCircles();
  },

  onShow() {
    this.loadCircles();
  },

  async loadCircles() {
    this.setData({ loading: true });
    try {
      const { data } = await api.circle.my();
      let circles = data || [];

      if (this.data.currentTab === 'owner') {
        const app = getApp<any>();
        circles = circles.filter((c: any) => c.ownerId === app.globalData.userInfo?.id);
      }

      this.setData({ circles });
    } catch (error) {
      console.error('加载圈子失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  switchTab(e: any) {
    const tab = e.currentTarget.dataset.key;
    this.setData({ currentTab: tab });
    this.loadCircles();
  },

  goToDetail(e: any) {
    const circleId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/circle/detail/detail?id=${circleId}` });
  },

  goToCreate() {
    wx.navigateTo({ url: '/pages/circle/create/create' });
  },

  formatType(type: number) {
    return formatCircleType(type);
  },
});
