// pages/event/detail/detail.ts
import { api } from '../../../utils/request';

Page({
  data: {
    event: null as any,
    participants: [] as any[],
    isJoined: false,
    isOrganizer: false,
    isDriver: false,
    showAllocationModal: false,
    allocationResult: [] as any[],
  },

  onLoad(options: any) {
    if (options.id) {
      this.setData({ eventId: options.id });
      this.loadEventDetail();
    }
  },

  onPullDownRefresh() {
    this.loadEventDetail();
  },

  async loadEventDetail() {
    try {
      const [eventRes, participantsRes] = await Promise.all([
        api.event.detail(this.data.eventId),
        api.event.participants(this.data.eventId),
      ]);

      const event = eventRes.data;
      const app = getApp<any>();
      const userId = app.globalData.userInfo?.id;

      const participant = (participantsRes.data || []).find((p: any) => p.userId === userId);
      const isJoined = !!participant;
      const isOrganizer = event.organizerId === userId;

      this.setData({
        event,
        participants: participantsRes.data || [],
        isJoined,
        isOrganizer,
        isDriver: participant?.isDriver === 1,
      });
    } catch (error) {
      console.error('加载活动详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  formatDateTime(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  },

  async joinEvent() {
    wx.showModal({
      title: '报名活动',
      content: '您是提供车位还是搭乘？',
      editable: false,
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.event.join(this.data.eventId, { isDriver: 0, seatsNeeded: 1 });
            wx.showToast({ title: '报名成功', icon: 'success' });
            this.loadEventDetail();
          } catch (error) {
            wx.showToast({ title: '报名失败', icon: 'none' });
          }
        }
      },
    });
  },

  async leaveEvent() {
    wx.showModal({
      title: '退出活动',
      content: '确定要退出这个活动吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.event.leave(this.data.eventId);
            wx.showToast({ title: '已退出', icon: 'success' });
            this.loadEventDetail();
          } catch (error) {
            wx.showToast({ title: '退出失败', icon: 'none' });
          }
        }
      },
    });
  },

  async allocateVehicles() {
    wx.showLoading({ title: '分配中...' });
    try {
      await api.event.allocate(this.data.eventId);
      wx.hideLoading();
      wx.showToast({ title: '分配完成', icon: 'success' });
      this.loadEventDetail();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '分配失败', icon: 'none' });
    }
  },

  async viewAllocation() {
    try {
      const res = await api.event.allocation(this.data.eventId);
      this.setData({
        allocationResult: res.data || [],
        showAllocationModal: true,
      });
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  closeAllocationModal() {
    this.setData({ showAllocationModal: false });
  },
});
