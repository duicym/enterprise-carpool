const api = require('../../utils/api');

Page({
  data: {
    orderId: null,
    revieweeId: null,
    revieweeAvatar: '',
    revieweeName: '',
    rating: 0,
    ratingText: '请选择评分',
    content: '',
    isAnonymous: false,
    submitting: false,
  },

  onLoad(options) {
    this.setData({
      orderId: options.orderId,
      revieweeId: options.revieweeId,
    });
    this.loadRevieweeInfo(options.revieweeId);
  },

  async loadRevieweeInfo(revieweeId) {
    try {
      const res = await api.get(`/review/user/${revieweeId}`, {}, { silent: true });
      if (res.data) {
        this.setData({
          revieweeAvatar: res.data.avatar_url || '/images/default-avatar.png',
          revieweeName: res.data.nickname || '用户',
        });
      }
    } catch (error) {
      // 忽略
    }
  },

  selectRating(e) {
    const rating = parseInt(e.currentTarget.dataset.rating);
    const ratingTexts = ['', '非常差', '差', '一般', '好', '非常好'];
    this.setData({ rating, ratingText: ratingTexts[rating] });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onAnonymousChange(e) {
    this.setData({ isAnonymous: e.detail.value });
  },

  async submitReview() {
    const { rating, content, isAnonymous, revieweeId, orderId, submitting } = this.data;

    if (submitting) return;

    if (rating === 0) {
      wx.showToast({ title: '请选择评分', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      await api.post('/review', {
        order_id: parseInt(orderId),
        reviewee_id: parseInt(revieweeId),
        rating,
        content,
        is_anonymous: isAnonymous ? 1 : 0,
      }, { showLoading: true, loadingText: '提交中...' });

      wx.showToast({ title: '评价成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (error) {
      console.error('Submit review failed:', error);
    } finally {
      this.setData({ submitting: false });
    }
  },
});
