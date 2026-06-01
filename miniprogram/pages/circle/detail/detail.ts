// pages/circle/detail/detail.ts
import { api } from '../../../utils/request';
import { formatCircleType } from '../../../utils/formatter';

Page({
  data: {
    circle: null as any,
    members: [] as any[],
    trips: [] as any[],
    isAdmin: false,
    isOwner: false,
    isMember: false,
    loading: false,
  },

  onLoad(options: any) {
    if (options.id) {
      this.setData({ circleId: options.id });
      this.loadCircleDetail();
    }
  },

  onPullDownRefresh() {
    this.loadCircleDetail();
  },

  async loadCircleDetail() {
    this.setData({ loading: true });
    try {
      const [circleRes, membersRes] = await Promise.all([
        api.circle.detail(this.data.circleId),
        api.circle.members(this.data.circleId),
      ]);

      const circle = circleRes.data;
      const app = getApp<any>();
      const userId = app.globalData.userInfo?.id;

      this.setData({
        circle,
        members: membersRes.data || [],
        isAdmin: circle.ownerId === userId || (circle.members || []).some((m: any) => m.userId === userId && m.role === 2),
        isOwner: circle.ownerId === userId,
        isMember: (circle.members || []).some((m: any) => m.userId === userId && m.status === 1),
        trips: circle.trips || [],
      });
    } catch (error) {
      console.error('加载圈子详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  formatType(type: number) {
    return formatCircleType(type);
  },

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  goToTripDetail(e: any) {
    const tripId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/trip/detail/detail?id=${tripId}` });
  },

  goToMemberProfile(e: any) {
    const userId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/profile/profile?userId=${userId}` });
  },

  createTrip() {
    wx.navigateTo({ url: `/pages/trip/publish/publish?circleId=${this.data.circleId}` });
  },

  createEvent() {
    wx.navigateTo({ url: `/pages/event/create/create?circleId=${this.data.circleId}` });
  },

  manageMembers() {
    wx.navigateTo({ url: `/pages/circle/members/members?id=${this.data.circleId}` });
  },

  editCircle() {
    wx.navigateTo({ url: `/pages/circle/edit/edit?id=${this.data.circleId}` });
  },
});
