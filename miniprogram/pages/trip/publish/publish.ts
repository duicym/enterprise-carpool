// pages/trip/publish/publish.ts
import { api } from '../../../utils/request';
import { formatCircleType } from '../../../utils/formatter';

Page({
  data: {
    circles: [] as any[],
    selectedCircle: null as any,
    startAddress: '',
    endAddress: '',
    departureTime: '',
    seatCount: 1,
    feeMode: 1,
    feeAmount: '',
    remark: '',
    showPicker: false,
  },

  onLoad() {
    this.loadCircles();
    // 设置默认出发时间为明天早上
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 30, 0, 0);
    this.setData({
      departureTime: this.formatTime(tomorrow),
    });
  },

  async loadCircles() {
    try {
      const { data } = await api.circle.my();
      if (data && data.length > 0) {
        this.setData({ circles: data, selectedCircle: data[0] });
      }
    } catch (error) {
      console.error('加载圈子失败:', error);
    }
  },

  formatTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },

  onCircleChange(e: any) {
    const index = e.detail.value;
    this.setData({ selectedCircle: this.data.circles[index] });
  },

  onStartLocationChoose() {
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

  onEndLocationChoose() {
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

  onTimeChange(e: any) {
    this.setData({ departureTime: e.detail.value });
  },

  onSeatChange(e: any) {
    this.setData({ seatCount: parseInt(e.detail.value) });
  },

  onFeeModeChange(e: any) {
    this.setData({ feeMode: parseInt(e.detail.value) });
  },

  onFeeAmountInput(e: any) {
    this.setData({ feeAmount: e.detail.value });
  },

  onRemarkInput(e: any) {
    this.setData({ remark: e.detail.value });
  },

  async onSubmit() {
    const {
      selectedCircle,
      startAddress,
      endAddress,
      departureTime,
      seatCount,
      feeMode,
      feeAmount,
      remark,
    } = this.data;

    // 验证必填项
    if (!selectedCircle) {
      wx.showToast({ title: '请选择圈子', icon: 'none' });
      return;
    }

    if (!startAddress || !endAddress) {
      wx.showToast({ title: '请选择起点和终点', icon: 'none' });
      return;
    }

    if (!departureTime) {
      wx.showToast({ title: '请选择出发时间', icon: 'none' });
      return;
    }

    try {
      await api.trip.create(selectedCircle.id, {
        startAddress,
        endAddress,
        departureTime: new Date(departureTime).toISOString(),
        seatCount,
        feeMode,
        feeAmount: feeMode === 1 ? null : parseFloat(feeAmount) || 0,
        remark,
      });

      wx.showToast({ title: '发布成功', icon: 'success' });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error: any) {
      wx.showToast({
        title: error.message || '发布失败',
        icon: 'none',
      });
    }
  },
});
